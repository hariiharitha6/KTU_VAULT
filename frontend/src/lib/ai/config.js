// ============================================================
// ATLAS — CENTRALIZED AI CONFIGURATION   (single source of truth)
// Every AI feature reads model/API/switching decisions from here.
// Never hardcode Gemini model names or endpoints in components.
// ============================================================

export const AI_PROVIDER = 'gemini';

// Current stable Gemini API version for the public Generative Language API.
export const GEMINI_API_VERSION = 'v1beta';
export const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}`;

// Production default model — currently supported GA model, free-tier friendly,
// strong for RAG + long KTU model answers.
export const GEMINI_MODEL = 'gemini-2.5-flash';

// Priority order used by auto-detection/self-heal. Newest stable GA first,
// ordered so free AI-Studio keys always have a working option.
export const SUPPORTED_GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
];

// Models Google has retired / never made GA. These are NOT served on /v1beta
// for generateContent and must never be auto-selected or persisted.
export const RETIRED_GEMINI_MODELS = new Set([
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.5-flash-preview-05-06',
  'gemini-2.5-flash-preview-04-17',
  'gemini-2.5-pro-preview-06-05',
  'gemini-2.5-pro-preview-05-20',
  'gemini-2.5-pro-preview-03-25',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite-001',
  'gemini-1.5-flash-001',
  'gemini-1.5-pro-001',
]);

export const GEMINI_MAX_OUTPUT_TOKENS = 8192;
export const GEMINI_TEMPERATURE = 0.4;
export const GEMINI_REQUEST_TIMEOUT_MS = 60000;

export function geminiModelsUrl() {
  return `${GEMINI_BASE_URL}/models`;
}

export function geminiGenerateContentUrl(model) {
  return `${GEMINI_BASE_URL}/models/${encodeURIComponent(model)}:generateContent`;
}

// Experimental `-exp` suffixed models (and OpenRouter `:free` variants of them)
// are never GA — treat any such name as retired.
export function isRetiredGeminiModel(model) {
  const name = String(model || '').trim();
  if (!name) return false;
  if (RETIRED_GEMINI_MODELS.has(name)) return true;
  return /^[a-z0-9.\\-]+-exp(:free)?$/i.test(name);
}

export function isSupportedGeminiModel(model) {
  return SUPPORTED_GEMINI_MODELS.includes(String(model || '').trim());
}