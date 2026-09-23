// ============================================================
// ATLAS — CENTRALIZED GEMINI CLIENT
// Raw REST calls to the current Gemini API (v1beta) with
// categorized errors + automatic model self-heal.
// SDK choice: raw REST (no @google SDK bundling) so the app stays
// a zero-backend static SPA, consistent with every other provider.
// ============================================================

import {
  GEMINI_MAX_OUTPUT_TOKENS,
  GEMINI_TEMPERATURE,
  GEMINI_REQUEST_TIMEOUT_MS,
  SUPPORTED_GEMINI_MODELS,
  geminiGenerateContentUrl,
  geminiModelsUrl,
  isRetiredGeminiModel,
} from './config.js';

export const GEMINI_ERROR_CATEGORIES = {
  INVALID_API_KEY: 'INVALID_API_KEY',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  MODEL_UNAVAILABLE: 'MODEL_UNAVAILABLE',
  RATE_LIMITED: 'RATE_LIMITED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  BAD_REQUEST: 'BAD_REQUEST',
  TIMEOUT: 'TIMEOUT',
  NETWORK: 'NETWORK',
  BLOCKED: 'BLOCKED',
  EMPTY_RESPONSE: 'EMPTY_RESPONSE',
  GENERIC: 'GENERIC',
};

export function classifyGeminiError(status, message) {
  const msg = String(message || '').toLowerCase();

  if (status === 401 || status === 403 || msg.includes('api key not valid') || msg.includes('invalid api key')) {
    return { category: GEMINI_ERROR_CATEGORIES.INVALID_API_KEY };
  }
  if (status === 403 && (msg.includes('permission denied') || msg.includes('permission'))) {
    return { category: GEMINI_ERROR_CATEGORIES.PERMISSION_DENIED };
  }
  if (
    status === 404 ||
    msg.includes('is not found for api version') ||
    msg.includes('is not supported for') ||
    msg.includes('not supported for generatecontent') ||
    msg.includes('is not supported')
  ) {
    return { category: GEMINI_ERROR_CATEGORIES.MODEL_UNAVAILABLE };
  }
  if (status === 429 || msg.includes('resource_exhausted') || msg.includes('rate limit')) {
    return {
      category: msg.includes('resource_exhausted') || msg.includes('quota')
        ? GEMINI_ERROR_CATEGORIES.QUOTA_EXCEEDED
        : GEMINI_ERROR_CATEGORIES.RATE_LIMITED,
    };
  }
  if (status === 400 || status === 422) return { category: GEMINI_ERROR_CATEGORIES.BAD_REQUEST };
  if (status >= 500) return { category: GEMINI_ERROR_CATEGORIES.GENERIC };
  return { category: GEMINI_ERROR_CATEGORIES.GENERIC };
}

function friendlyMessage(category, detail, model) {
  switch (category) {
    case GEMINI_ERROR_CATEGORIES.INVALID_API_KEY:
      return 'Gemini rejected your API key. Verify the key at Google AI Studio and try again.';
    case GEMINI_ERROR_CATEGORIES.PERMISSION_DENIED:
      return 'Gemini denied access with this key. Make sure Generative Language API is enabled for the key.';
    case GEMINI_ERROR_CATEGORIES.MODEL_UNAVAILABLE:
      return `The Gemini model "${model || 'selected'}" has been retired or is not supported by the Gemini API. ATLAS re-verifies and switches to a currently supported model automatically.`;
    case GEMINI_ERROR_CATEGORIES.RATE_LIMITED:
      return 'Gemini rate limit reached. Wait a few seconds and try again.';
    case GEMINI_ERROR_CATEGORIES.QUOTA_EXCEEDED:
      return 'Gemini free quota exceeded for this key. Try again later or use another free key.';
    case GEMINI_ERROR_CATEGORIES.BAD_REQUEST:
      return 'Gemini rejected the request format. Please try again.';
    case GEMINI_ERROR_CATEGORIES.TIMEOUT:
      return 'The request to Gemini timed out. Check your connection and try again.';
    case GEMINI_ERROR_CATEGORIES.NETWORK:
      return detail || 'Network error while contacting Gemini. Check your internet connection.';
    case GEMINI_ERROR_CATEGORIES.BLOCKED:
      return 'Gemini blocked this response because the content was flagged as unsafe.';
    case GEMINI_ERROR_CATEGORIES.EMPTY_RESPONSE:
      return 'Gemini returned an empty response. Please try again.';
    default:
      return detail || 'Gemini generation failed. Please try again.';
  }
}

export function toGeminiError(status, message, model) {
  const { category } = classifyGeminiError(status, message);
  const err = new Error(friendlyMessage(category, message, model));
  err.category = category;
  err.detail = message;
  err.status = status;
  err.model = model;
  err.isGemini = true;
  return err;
}

// List models currently served by the account's key that support generateContent.
// Returns [] on failure (callers fall back to the curated supported list).
export async function discoverGeminiModels({ apiKey, fetcher = fetch, timeoutMs = 10000 }) {
  try {
    const res = await fetcher(
      geminiModelsUrl(),
      { headers: { 'x-goog-api-key': apiKey } },
      timeoutMs
    );
    if (!res.ok) return [];
    const data = await res.json();
    const found = (data.models || [])
      .filter(m => m.name && Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
      .map(m => m.name.replace(/^models\//, ''));
    return [...new Set(found)].filter(m => !isRetiredGeminiModel(m));
  } catch {
    return [];
  }
}

// One-shot smoke test of a single model. Never throws for non-auth failures.
export async function testGeminiModel({ apiKey, model, fetcher = fetch, maxOutputTokens = 5, timeoutMs = 12000 }) {
  let res;
  try {
    res = await fetcher(
      geminiGenerateContentUrl(model),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say OK' }] }],
          generationConfig: { maxOutputTokens },
        }),
      },
      timeoutMs
    );
  } catch (err) {
    return {
      model, ok: false, skip: false,
      category: GEMINI_ERROR_CATEGORIES.NETWORK,
      error: err.message || 'network error',
    };
  }

  if (res.ok) return { model, ok: true };

  const d = await res.json().catch(() => ({}));
  const rawMsg = d?.error?.message || `HTTP ${res.status}`;
  const { category } = classifyGeminiError(res.status, rawMsg);
  const isAuth = category === GEMINI_ERROR_CATEGORIES.INVALID_API_KEY || category === GEMINI_ERROR_CATEGORIES.PERMISSION_DENIED;
  const isSkip =
    category === GEMINI_ERROR_CATEGORIES.RATE_LIMITED ||
    category === GEMINI_ERROR_CATEGORIES.QUOTA_EXCEEDED ||
    category === GEMINI_ERROR_CATEGORIES.MODEL_UNAVAILABLE;

  return { model, ok: false, skip: isSkip, hardAuth: isAuth, category, error: rawMsg, status: res.status };
}

// Single turn generateContent. Throws categorized errors.
export async function generateContent({
  apiKey, model, prompt, generationConfig = {},
  fetcher = fetch, timeoutMs = GEMINI_REQUEST_TIMEOUT_MS,
}) {
  let res;
  try {
    res = await fetcher(
      geminiGenerateContentUrl(model),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
            temperature: GEMINI_TEMPERATURE,
            ...generationConfig,
          },
        }),
      },
      timeoutMs
    );
  } catch (err) {
    const msg = String(err.message || '');
    if (/timed out|abort/i.test(msg)) {
      const e = toGeminiError(0, msg, model);
      e.category = GEMINI_ERROR_CATEGORIES.TIMEOUT;
      e.message = friendlyMessage(GEMINI_ERROR_CATEGORIES.TIMEOUT, msg, model);
      throw e;
    }
    const e = toGeminiError(0, msg, model);
    e.category = GEMINI_ERROR_CATEGORIES.NETWORK;
    e.message = msg;
    throw e;
  }

  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw toGeminiError(res.status, d?.error?.message || `HTTP ${res.status}`, model);
  }

  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
  if (!text.trim()) {
    const e = toGeminiError(0, 'Model returned an empty response.', model);
    e.category = GEMINI_ERROR_CATEGORIES.EMPTY_RESPONSE;
    throw e;
  }
  return text;
}

// Self-heal: when the configured model is retired, find a live working model
// (curated supported list first, then live model-list extras) and retry.
// Cached per requested model so follow-up calls skip discovery.
const healCache = new Map();

export async function healGeminiModel({ apiKey, requestedModel, fetcher = fetch }) {
  if (healCache.has(requestedModel)) return healCache.get(requestedModel);

  let live = [];
  try { live = await discoverGeminiModels({ apiKey, fetcher }); } catch { live = []; }

  const preferred = SUPPORTED_GEMINI_MODELS.filter(m => !isRetiredGeminiModel(m));
  const extras = live.filter(m => !preferred.includes(m) && !isRetiredGeminiModel(m));
  const candidates = [...extras, ...preferred].slice(0, 12);

  for (const candidate of candidates) {
    if (candidate === requestedModel) continue;
    const r = await testGeminiModel({ apiKey, model: candidate, fetcher });
    if (r.ok) {
      healCache.set(requestedModel, candidate);
      return candidate;
    }
  }
  return null;
}

export function clearGeminiHealCache() {
  healCache.clear();
}