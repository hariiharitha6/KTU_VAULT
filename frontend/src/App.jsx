  import React, {
  useState, useEffect, useRef, useCallback, useMemo
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Target, ChevronDown,
  Calendar, Trash2, AlertCircle, KeyRound,
  ArrowRight, Settings2,
  Shield, ChevronRight, Telescope, CheckCircle,
  XCircle, ExternalLink, Brain,
  Timer, Play, Pause,
  RotateCcw, ChevronUp, BookMarked,
  Flame, Clock, X, Check,
  ArrowLeft, Repeat, Eye, EyeOff, Hash, BarChart3,
  Layers, MessageCircle,
  Send, Bot, User, GraduationCap,
  Rocket, RefreshCw, Copy, Bookmark,
  Focus
} from 'lucide-react';
import { subjectDetails, SCHEME_RULES, deptNames, studyData } from './data/subjectData.js';
import DOMPurify from 'dompurify';
import {
  GEMINI_MODEL,
  SUPPORTED_GEMINI_MODELS,
  isRetiredGeminiModel,
} from './lib/ai/config.js';
import {
  GEMINI_ERROR_CATEGORIES,
  discoverGeminiModels,
  testGeminiModel,
  generateContent,
  healGeminiModel,
  clearGeminiHealCache,
} from './lib/ai/client.js';
import {
  buildAIHealthReport,
  describeModelStatus,
  formatHealthReportLine,
} from './lib/ai/diagnose.js';
// ============================================================
// POLYFILL — AggregateError (BUG 13)
// ============================================================
if (typeof AggregateError === 'undefined') {
  globalThis.AggregateError = class AggregateError extends Error {
    constructor(errors, message) {
      super(message);
      this.errors = errors;
      this.name = 'AggregateError';
    }
  };
}

// ============================================================
// SECTION 1 — CONSTANTS
// ============================================================

const STORAGE_KEY      = 'atlas_v2_session';
const BOOKMARKS_KEY    = 'atlas_v2_bookmarks';
const CONVERSATION_KEY = 'atlas_v2_conversation';

const FAMOUS_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Study hard, for the well is deep and our brains are shallow.", author: "Richard Baxter" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
];

const RAG_PHASES = [
  { label: "Loading your syllabus context...", icon: "📚" },
  { label: "Gathering past year questions...", icon: "📝" },
  { label: "Analyzing marking scheme patterns...", icon: "🎯" },
  { label: "Reading formula bank...", icon: "📐" },
  { label: "Cross-checking KTU exam pattern...", icon: "🔍" },
  { label: "Structuring the response for you...", icon: "✨" },
  { label: "Adding examiner-approved format...", icon: "✅" },
  { label: "Finalizing your answer...", icon: "🏁" },
];

const ANSWER_LOADING_PHASES = [
  { label: "Reading the question carefully...", icon: "📖" },
  { label: "Fetching syllabus context...", icon: "📚" },
  { label: "Checking similar past questions...", icon: "🔍" },
  { label: "Preparing structured answer...", icon: "✍️" },
  { label: "Adding relevant formulas...", icon: "📐" },
  { label: "Formatting for KTU marking...", icon: "🎯" },
  { label: "Almost ready...", icon: "✨" },
];

const VERIFY_PHASES = [
  { label: "Detecting API type...", icon: "🔍" },
  { label: "Testing connectivity...", icon: "📡" },
  { label: "Sending test request...", icon: "🚀" },
  { label: "Validating credentials...", icon: "🛡️" },
  { label: "Checking available models...", icon: "🤖" },
  { label: "Almost done...", icon: "✨" },
];

const FEATURES = [
  { icon: Brain,         title: "RAG-Powered",       desc: "Answers grounded strictly in KTU syllabus",         color: "#7c9eff" },
  { icon: Target,        title: "Target Strategist",  desc: "Input target score → get exact questions to study", color: "#86dfba" },
  { icon: BarChart3,     title: "Probability Engine", desc: "AI-scored question probability from PYQ analysis",  color: "#f0c987" },
  { icon: BookOpen,      title: "Model Answers",      desc: "Full-mark structured KTU-style answers",            color: "#a78bfa" },
  { icon: Layers,        title: "Part A & B Split",   desc: "Smart UX for short vs detailed answers",            color: "#e8a598" },
  { icon: Timer,         title: "Focus Timer",        desc: "Built-in Pomodoro for study sessions",              color: "#8ecae6" },
  { icon: Calendar,      title: "AI Scheduler",       desc: "Day-by-day timetable from your exam date",          color: "#86dfba" },
  { icon: GraduationCap, title: "CIE Tracker",        desc: "Know your safe zone from internal marks",           color: "#f0c987" },
  { icon: Shield,        title: "Pass Calculator",    desc: "2019 & 2024 scheme pass logic",                     color: "#e8a598" },
  { icon: Bot,           title: "AI Tutor",           desc: "Chat for doubts, grounded in your subject",         color: "#a78bfa" },
];

// ============================================================
// SECTION 2 — AI PROVIDERS CONFIG
// ============================================================

const AI_PROVIDERS = [
  // ═══ FEATURED ═══
  {
    id: 'gemini', name: 'Google Gemini', icon: '✦', color: '#4285f4',
    gradient: 'linear-gradient(135deg,rgba(66,133,244,0.15) 0%,rgba(52,168,83,0.1) 100%)',
    border: 'rgba(66,133,244,0.3)', badge: 'FREE', badgeColor: '#86dfba',
    badgeBg: 'rgba(134,223,186,0.15)',
    link: 'https://aistudio.google.com/app/apikey', linkLabel: 'Get Free Key →',
    featured: true,
    models: SUPPORTED_GEMINI_MODELS,
  },
  {
    id: 'openrouter', name: 'OpenRouter', icon: '🔀', color: '#a78bfa',
    gradient: 'linear-gradient(135deg,rgba(167,139,250,0.15) 0%,rgba(167,139,250,0.06) 100%)',
    border: 'rgba(167,139,250,0.3)', badge: 'FREE+ANY', badgeColor: '#c4b5fd',
    badgeBg: 'rgba(167,139,250,0.15)',
    link: 'https://openrouter.ai/keys', linkLabel: 'Get Free Key →',
    featured: true,
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      'google/gemini-2.5-flash:free',
      'google/gemini-2.5-flash',
      'deepseek/deepseek-chat:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'qwen/qwen-2.5-72b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
    ],
  },
  {
    id: 'groq', name: 'Groq AI', icon: '⚡', color: '#f97316',
    gradient: 'linear-gradient(135deg,rgba(249,115,22,0.15) 0%,rgba(249,115,22,0.06) 100%)',
    border: 'rgba(249,115,22,0.3)', badge: 'FREE', badgeColor: '#86dfba',
    badgeBg: 'rgba(134,223,186,0.15)',
    link: 'https://console.groq.com/keys', linkLabel: 'Get Free Key →',
    featured: true,
    baseUrl: 'https://api.groq.com/openai/v1',
    models: [
      'llama-3.3-70b-versatile', 'llama-3.1-8b-instant',
      'mixtral-8x7b-32768', 'gemma2-9b-it',
    ],
  },
  {
    id: 'nvidia', name: 'NVIDIA NIM', icon: '◆', color: '#76b900',
    gradient: 'linear-gradient(135deg,rgba(118,185,0,0.15) 0%,rgba(118,185,0,0.06) 100%)',
    border: 'rgba(118,185,0,0.3)', badge: 'FREE', badgeColor: '#86dfba',
    badgeBg: 'rgba(134,223,186,0.15)',
    link: 'https://build.nvidia.com/', linkLabel: 'Get Free Key →',
    featured: true,
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    models: [
      'meta/llama-3.3-70b-instruct',
      'meta/llama-3.1-70b-instruct',
      'meta/llama-3.1-8b-instruct',
      'mistralai/mixtral-8x7b-instruct-v0.1',
      'microsoft/phi-3-medium-4k-instruct',
    ],
  },
  // ═══ HIDDEN ═══
  {
    id: 'openai', name: 'OpenAI', icon: '⬡', color: '#10a37f',
    gradient: 'linear-gradient(135deg,rgba(16,163,127,0.12) 0%,rgba(16,163,127,0.06) 100%)',
    border: 'rgba(16,163,127,0.3)', badge: 'BILLING', badgeColor: '#e8a598',
    badgeBg: 'rgba(232,165,152,0.12)',
    link: 'https://platform.openai.com/api-keys', linkLabel: 'Get Key →',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  {
    id: 'claude', name: 'Anthropic Claude', icon: '◈', color: '#d97706',
    gradient: 'linear-gradient(135deg,rgba(217,119,6,0.12) 0%,rgba(217,119,6,0.06) 100%)',
    border: 'rgba(217,119,6,0.3)', badge: 'BILLING', badgeColor: '#e8a598',
    badgeBg: 'rgba(232,165,152,0.12)',
    link: 'https://console.anthropic.com/settings/keys', linkLabel: 'Get Key →',
    models: ['claude-3-5-haiku-20241022', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229'],
  },
  {
    id: 'deepseek',   name: 'DeepSeek',         icon: '🔷', color: '#4d6bfe',
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
  },
  {
    id: 'kimi',       name: 'Kimi (Moonshot)',   icon: '🌙', color: '#5b5bd6',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
  },
  {
    id: 'xai',        name: 'xAI Grok',          icon: '𝕏',  color: '#718096',
    baseUrl: 'https://api.x.ai/v1',
    models: ['grok-2-latest', 'grok-2-1212', 'grok-beta'],
  },
  {
    id: 'zai',        name: 'Z.AI (GLM)',         icon: '🇿', color: '#4285f4',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: ['glm-4-plus', 'glm-4-air', 'glm-4-flash'],
  },
  {
    id: 'mistral',    name: 'Mistral AI',         icon: '🌬️', color: '#ff7000',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-latest', 'mistral-small-latest', 'open-mistral-7b'],
  },
  {
    id: 'perplexity', name: 'Perplexity',         icon: '🔎', color: '#20808d',
    baseUrl: 'https://api.perplexity.ai',
    models: ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online'],
  },
  {
    id: 'together',   name: 'Together AI',        icon: '🤝', color: '#0f6fff',
    baseUrl: 'https://api.together.xyz/v1',
    models: ['meta-llama/Llama-3.3-70B-Instruct-Turbo', 'deepseek-ai/DeepSeek-V3'],
  },
  {
    id: 'cohere',     name: 'Cohere',             icon: '🎯', color: '#39594d',
    baseUrl: 'https://api.cohere.ai/compatibility/v1',
    models: ['command-r-plus', 'command-r', 'command'],
  },
  {
    id: 'fireworks',  name: 'Fireworks AI',       icon: '🎆', color: '#5019c5',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    models: [
      'accounts/fireworks/models/llama-v3p3-70b-instruct',
      'accounts/fireworks/models/deepseek-v3',
    ],
  },
  {
    id: 'cerebras',   name: 'Cerebras',           icon: '🧠', color: '#e30017',
    baseUrl: 'https://api.cerebras.ai/v1',
    models: ['llama3.3-70b', 'llama3.1-8b'],
  },
  {
    id: 'sambanova',  name: 'SambaNova',          icon: '🎷', color: '#ee3124',
    baseUrl: 'https://api.sambanova.ai/v1',
    models: ['Meta-Llama-3.3-70B-Instruct', 'Meta-Llama-3.1-70B-Instruct'],
  },
  {
    id: 'hyperbolic', name: 'Hyperbolic',         icon: '🌀', color: '#00d4ff',
    baseUrl: 'https://api.hyperbolic.xyz/v1',
    models: ['meta-llama/Meta-Llama-3.3-70B-Instruct', 'deepseek-ai/DeepSeek-V3'],
  },
  {
    id: 'anyscale',   name: 'Anyscale',           icon: '📊', color: '#0089ff',
    baseUrl: 'https://api.endpoints.anyscale.com/v1',
    models: ['meta-llama/Meta-Llama-3-70B-Instruct'],
  },
  {
    id: 'ollama',     name: 'Ollama (Local)',     icon: '🦙', color: '#4a5568',
    baseUrl: 'http://localhost:11434/v1',
    models: ['llama3.2', 'llama3.1', 'mistral', 'codellama'],
    noKey: true,
  },
  {
    id: 'lmstudio',   name: 'LM Studio (Local)', icon: '💻', color: '#7c9eff',
    baseUrl: 'http://localhost:1234/v1',
    models: [],
    noKey: true,
  },
  {
    id: 'custom',     name: 'Custom / Other',    icon: '🔗', color: '#6b7787',
    models: [],
  },
];

const SK_AMBIGUOUS_PROVIDERS = [
  'openai', 'deepseek', 'kimi', 'mistral', 'together', 'hyperbolic',
];

const UNKNOWN_KEY_PROBE_LIST = [
  'openrouter', 'deepseek', 'mistral', 'together', 'cohere',
  'zai', 'sambanova', 'hyperbolic', 'anyscale', 'cerebras',
];

// ============================================================
// SECTION 3 — SECURE STORAGE  (BUG 5 FIX)
// TextEncoder/TextDecoder + Uint8Array — safe for ALL Unicode keys
// ============================================================

const SecureStorage = {
  _obfKey: 'atlas-v2-xor-2024',

  _xorBytes(bytes, key) {
    const keyBytes = new TextEncoder().encode(key);
    return bytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
  },

  _toBase64(bytes) {
    let binary = '';
    bytes.forEach(b => { binary += String.fromCharCode(b); });
    return btoa(binary);
  },

  _fromBase64(b64) {
    const binary = atob(b64);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  },

  save(key, value) {
    try {
      const json       = JSON.stringify(value);
      const inputBytes = new TextEncoder().encode(json);
      const xored      = this._xorBytes(Array.from(inputBytes), this._obfKey);
      const encoded    = this._toBase64(xored);
      sessionStorage.setItem(key, encoded);
      return true;
    } catch (_) { return false; }
  },

  load(key) {
    try {
      const encoded   = sessionStorage.getItem(key);
      if (!encoded) return null;
      const xored     = Array.from(this._fromBase64(encoded));
      const jsonBytes = this._xorBytes(xored, this._obfKey);
      const json      = new TextDecoder().decode(new Uint8Array(jsonBytes));
      return JSON.parse(json);
    } catch (_) { return null; }
  },

  remove(key) {
    try { sessionStorage.removeItem(key); } catch (_) {}
  },

  clearAll() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(CONVERSATION_KEY);
    } catch (_) {}
  },
};

const BookmarkStorage = {
  load() {
    try {
      const raw = localStorage.getItem(BOOKMARKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  },
  save(bookmarks) {
    try { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks)); } catch (_) {}
  },
};

// ============================================================
// SECTION 4 — RATE LIMITER + withRetry  (BUG 4 FIX)
// withRetry used ONCE only inside makeCallAI — never nested
// ============================================================

class RateLimiter {
  constructor(maxRequests = 20, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs    = windowMs;
    this.requests    = new Map();
  }
  canMakeRequest(pid) {
    const now  = Date.now();
    const ts   = (this.requests.get(pid) || []).filter(t => now - t < this.windowMs);
    this.requests.set(pid, ts);
    return ts.length < this.maxRequests;
  }
  recordRequest(pid) {
    const ts = this.requests.get(pid) || [];
    ts.push(Date.now());
    this.requests.set(pid, ts);
  }
  timeUntilNextRequest(pid) {
    const ts = this.requests.get(pid) || [];
    if (ts.length < this.maxRequests) return 0;
    return Math.max(0, this.windowMs - (Date.now() - ts[0]));
  }
  clear(pid) {
    if (pid) this.requests.delete(pid);
    else this.requests.clear();
  }
}

const rateLimiter = new RateLimiter(30, 60000);

async function withRetry(fn, maxRetries = 2, baseDelayMs = 1000) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const msg = String(err.message || '').toLowerCase();
      if (
        msg.includes('invalid')   || msg.includes('unauth') ||
        msg.includes('forbidden') || msg.includes('401')    ||
        msg.includes('403')       || msg.includes('empty prompt')
      ) throw err;
      if (err?.isGemini && err.category === GEMINI_ERROR_CATEGORIES.MODEL_UNAVAILABLE) throw err;
      if (attempt === maxRetries) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 200;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastError;
}

// ============================================================
// SECTION 5 — API CLIENT
// ============================================================

class APIClient {
  constructor() { this.activeControllers = new Set(); }

  async request(url, options = {}, timeoutMs = 45000) {
    const controller = new AbortController();
    this.activeControllers.add(controller);
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      this.activeControllers.delete(controller);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      this.activeControllers.delete(controller);
      if (err.name === 'AbortError')
        throw new Error('Request timed out. Please check your internet connection.');
      const msg    = String(err.message || '').toLowerCase();
      const isCORS =
        msg.includes('failed to fetch')        ||
        msg.includes('networkerror')           ||
        msg.includes('load failed')            ||
        msg.includes('network request failed') ||
        msg.includes('cors');
      if (isCORS) {
        const CORS_MAP = {
          nvidia: 'NVIDIA', anthropic: 'Claude', cohere: 'Cohere',
          moonshot: 'Kimi', bigmodel: 'Z.AI', cerebras: 'Cerebras',
          sambanova: 'SambaNova', hyperbolic: 'Hyperbolic', anyscale: 'Anyscale',
        };
        const urlL  = url.toLowerCase();
        const hint  = Object.entries(CORS_MAP).find(([d]) => urlL.includes(d))?.[1];
        if (hint) throw new Error(
          `${hint} blocks direct browser access (CORS). ` +
          `Please use Gemini, Groq, or OpenRouter — they work in browsers.`
        );
        throw new Error(
          `Network error: This provider may block browser requests (CORS), ` +
          `or you may be offline. Try Gemini, Groq, or OpenRouter.`
        );
      }
      throw err;
    }
  }

  abortAll() {
    this.activeControllers.forEach(c => { try { c.abort(); } catch (_) {} });
    this.activeControllers.clear();
  }
}

const apiClient = new APIClient();

// ============================================================
// SECTION 6 — UNIVERSAL API VERIFIER
// BUG 1  FIX: Gemini tested in PARALLEL via Promise.allSettled
//             x-goog-api-key HEADER (not ?key= query param)
//             Auth 401/403 = hard fail; quota 429/529 = skip
// BUG 13 FIX: Promise.allSettled instead of Promise.any
// ============================================================

function detectProviderByPrefix(key) {
  const k = (key || '').trim();
  if (!k) return 'unknown';
  if (k.startsWith('nvapi-'))   return 'nvidia';
  if (k.startsWith('gsk_'))     return 'groq';
  if (k.startsWith('sk-or-'))   return 'openrouter';
  if (k.startsWith('sk-ant-'))  return 'claude';
  if (k.startsWith('sk-proj-')) return 'openai';
  if (k.startsWith('xai-'))     return 'xai';
  if (k.startsWith('pplx-'))    return 'perplexity';
  if (k.startsWith('fw_'))      return 'fireworks';
  if (k.startsWith('csk-'))     return 'cerebras';
  if (k.startsWith('esecret_')) return 'anyscale';
  if (k.startsWith('AIza'))     return 'gemini';
  if (k.startsWith('AQ.') || k.startsWith('AQ')) return 'gemini_express';
  if (k.startsWith('sk-'))      return 'sk_ambiguous';
  return 'unknown';
}

function maskApiKey(key, noKey = false) {
  if (noKey || !key || key.trim() === '') return '(no key required)';
  const k = key.trim();
  if (k.length < 12) return '••••••••';
  return `${k.slice(0, 6)}${'•'.repeat(8)}${k.slice(-4)}`;
}

// ── Centralized Gemini verification (BUG 1 core fix) ──
// Never returns a model that failed verification. Retired/unsupported models
// are filtered out up front, and the "speculative pick-first" fallback is gone.
async function verifyGeminiParallel(apiKey, onProgress, isExpress = false) {
  const label = isExpress ? 'Gemini Express' : 'Gemini';
  const fetcher = (url, opts, ms) => apiClient.request(url, opts, ms);

  let liveModels = [];
  if (onProgress) onProgress(`Fetching ${label} model list...`);
  try {
    liveModels = await discoverGeminiModels({ apiKey, fetcher });
  } catch { liveModels = []; }

  const preferred = SUPPORTED_GEMINI_MODELS.filter(m => !isRetiredGeminiModel(m));
  const extras    = liveModels.filter(m => !preferred.includes(m));
  const order     = [...preferred, ...extras].slice(0, 12);

  if (onProgress) onProgress(`Testing ${label} models in parallel...`);

  const testResults = await Promise.allSettled(
    order.map(model => testGeminiModel({ apiKey, model, fetcher }))
  );

  // Hard auth failure → fail fast
  for (const r of testResults) {
    if (r.status === 'rejected' && r.reason?.isGemini) throw r.reason;
    if (r.status === 'fulfilled' && r.value?.hardAuth) {
      throw new Error('Invalid Gemini key: API key rejected by Google. Verify the key at Google AI Studio.');
    }
  }

  const ok = [];
  const skip = [];
  const failed = [];
  for (const r of testResults) {
    if (r.status === 'rejected') { failed.push(r.reason?.message || 'test error'); continue; }
    const v = r.value;
    if (v.ok) ok.push(v.model);
    else if (v.skip) skip.push(v);
    else failed.push(v.error);
  }

  if (ok.length > 0) {
    return { provider: isExpress ? 'gemini_express' : 'gemini', model: ok[0], availableModels: order, detectedName: isExpress ? 'Google Gemini (Express)' : 'Google Gemini' };
  }

  const allTransient = skip.length > 0 && failed.length === 0 &&
    skip.every(v => v.category === GEMINI_ERROR_CATEGORIES.RATE_LIMITED || v.category === GEMINI_ERROR_CATEGORIES.QUOTA_EXCEEDED);

  if (allTransient) {
    throw new Error(`${label} key looks valid, but every supported model is currently rate-limited or out of quota. Wait a minute and retry.`);
  }

  const detail = failed[0] || 'No currently supported Gemini model responded.';
  throw new Error(`No working ${label} model found. ${detail}`);
}

async function probeProvider(apiKey, providerId, onProgress) {
  const provider = AI_PROVIDERS.find(p => p.id === providerId);
  if (!provider || !provider.baseUrl) return null;
  const testModel = provider.models?.[0];
  if (!testModel) return null;
  try {
    if (onProgress) onProgress(`Testing ${provider.name}...`);
    const res = await apiClient.request(
      `${provider.baseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: testModel, messages: [{ role: 'user', content: 'Hi' }], max_tokens: 5,
        }),
      },
      12000
    );
    if (res.ok) return {
      provider: providerId, model: testModel,
      availableModels: provider.models, detectedName: provider.name,
    };
  } catch (_) {}
  return null;
}

async function probeMultipleProviders(apiKey, providerIds, onProgress) {
  const results = await Promise.allSettled(
    providerIds.map(pid => probeProvider(apiKey, pid, onProgress))
  );
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) return r.value;
  }
  return null;
}

async function probeUnknownUrl(apiKey, baseUrl, onProgress) {
  const cleanUrl    = baseUrl.trim().replace(/\/+$/, '');
  const modelsPaths = [`${cleanUrl}/v1/models`, `${cleanUrl}/models`];
  const chatPaths   = [
    `${cleanUrl}/v1/chat/completions`, `${cleanUrl}/chat/completions`,
    `${cleanUrl}/v1/chat`,            `${cleanUrl}/chat`,
  ];
  let availableModels = [];

  for (const path of modelsPaths) {
    try {
      if (onProgress) onProgress(`Probing ${path}...`);
      const res = await apiClient.request(
        path, { headers: { Authorization: `Bearer ${apiKey}` } }, 10000
      );
      if (res.ok) {
        const data   = await res.json();
        const models = (data.data || data.models || data.result || [])
          .map(m => typeof m === 'string' ? m : (m.id || m.name || m.model))
          .filter(Boolean);
        if (models.length > 0) { availableModels = models.slice(0, 30); break; }
      }
    } catch (_) {}
  }

  if (!availableModels.length) throw new Error(
    `Could not fetch models from ${cleanUrl}. ` +
    `Please verify the URL supports an OpenAI-compatible /v1/models endpoint.`
  );

  const testModel     = availableModels[0];
  let workingChatPath = null;

  for (const path of chatPaths) {
    try {
      if (onProgress) onProgress(`Testing chat at ${path}...`);
      const res = await apiClient.request(
        path,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: testModel, messages: [{ role: 'user', content: 'Hi' }], max_tokens: 5,
          }),
        },
        15000
      );
      if (res.ok) {
        const data = await res.json();
        if (
          data.choices?.[0]?.message?.content !== undefined ||
          data.choices?.[0]?.text !== undefined
        ) { workingChatPath = path; break; }
      }
    } catch (_) {}
  }

  if (!workingChatPath) throw new Error(
    `Found models at ${cleanUrl} but chat completions endpoint doesn't match OpenAI schema.`
  );

  const modelStr   = availableModels.join(' ').toLowerCase();
  let detectedName = 'Custom LLM';
  if (modelStr.includes('deepseek'))     detectedName = 'DeepSeek';
  else if (modelStr.includes('llama'))   detectedName = 'Llama-Compatible';
  else if (modelStr.includes('qwen'))    detectedName = 'Qwen';
  else if (modelStr.includes('mistral')) detectedName = 'Mistral-Compatible';
  else if (modelStr.includes('gpt'))     detectedName = 'OpenAI-Compatible';
  else if (modelStr.includes('claude'))  detectedName = 'Claude-Compatible';

  return { provider: 'custom', model: testModel, availableModels, customBaseUrl: cleanUrl, detectedName };
}

async function universalVerify(apiKey, providerHint = null, customBaseUrl = '', onProgress = null) {
  const key      = (apiKey || '').trim();
  if (!key || key.length < 4) throw new Error('API key is too short.');
  const progress = msg => { if (onProgress) onProgress(msg); };

  if (providerHint === 'custom') {
    if (!customBaseUrl?.trim()) throw new Error('Please enter the API base URL for your custom provider.');
    progress('Probing custom URL...');
    return await probeUnknownUrl(key, customBaseUrl, progress);
  }

  if (providerHint && providerHint !== 'unknown' && providerHint !== 'sk_ambiguous') {
    return await verifySpecificProvider(key, providerHint, progress);
  }

  const detected = detectProviderByPrefix(key);

  if (detected === 'sk_ambiguous') {
    progress('Probing OpenAI-compatible providers...');
    const result = await probeMultipleProviders(key, SK_AMBIGUOUS_PROVIDERS, progress);
    if (result) return result;
    throw new Error('Could not verify this sk- key. Please select the provider manually below.');
  }

  if (detected === 'unknown') {
    progress('Probing common providers...');
    const result = await probeMultipleProviders(key, UNKNOWN_KEY_PROBE_LIST, progress);
    if (result) return result;
    throw new Error('Could not auto-detect this API key. Select "Custom / Other" and enter your API URL.');
  }

  return await verifySpecificProvider(key, detected, progress);
}

async function verifySpecificProvider(apiKey, providerId, onProgress) {
  const progress = msg => { if (onProgress) onProgress(msg); };

  if (providerId === 'gemini_express') return await verifyGeminiParallel(apiKey, progress, true);
  if (providerId === 'gemini')         return await verifyGeminiParallel(apiKey, progress, false);

  if (providerId === 'claude') {
    progress('Testing Claude...');
    const provider  = AI_PROVIDERS.find(p => p.id === 'claude');
    const prefModel = provider?.models?.[0] || 'claude-3-5-haiku-20241022';
    const tr = await apiClient.request(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: prefModel, max_tokens: 5,
          messages: [{ role: 'user', content: 'Say OK' }],
        }),
      },
      15000
    );
    if (!tr.ok) {
      const d = await tr.json().catch(() => ({}));
      throw new Error(d?.error?.message || `Claude auth failed (HTTP ${tr.status})`);
    }
    return { provider: 'claude', model: prefModel, availableModels: provider?.models || [], detectedName: 'Anthropic Claude' };
  }

  const provider = AI_PROVIDERS.find(p => p.id === providerId);
  if (!provider) throw new Error(`Unknown provider: ${providerId}`);

  if (provider.baseUrl) {
    let workingModel = null;
    let lastError    = '';
    for (const model of provider.models) {
      try {
        progress(`Testing ${model}...`);
        const res = await apiClient.request(
          `${provider.baseUrl}/chat/completions`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ model, messages: [{ role: 'user', content: 'Say OK' }], max_tokens: 5 }),
          },
          12000
        );
        if (res.ok) { workingModel = model; break; }
        const d = await res.json().catch(() => ({}));
        lastError = d?.error?.message || d?.detail || `HTTP ${res.status}`;
        if (String(lastError).toLowerCase().match(/invalid|unauth|forbidden/)) {
          throw new Error(`Invalid ${provider.name} key: ${lastError}`);
        }
      } catch (err) {
        if (err.message.startsWith('Invalid')) throw err;
        lastError = err.message;
      }
    }
    if (!workingModel) throw new Error(`All ${provider.name} models failed: ${lastError}`);
    return { provider: providerId, model: workingModel, availableModels: provider.models, detectedName: provider.name };
  }

  throw new Error(`Provider ${providerId} is not properly configured (missing baseUrl).`);
}
// ============================================================
// SECTION 7 — CONVERSATION MANAGER
// BUG 11 FIX: setContext checks BOTH subject AND scheme
// ============================================================

class ConversationManager {
  constructor() {
    this.messages     = [];
    this.systemPrompt = '';
    this.subject      = '';
    this.scheme       = '';
    this.listeners    = new Set();
    this.isMigrating  = false;
    this.load();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _notify() {
    this.listeners.forEach(l => { try { l(this.messages); } catch (_) {} });
  }

  // BUG 11 FIX: reset if EITHER subject OR scheme changes
  setContext(subject, scheme, systemPrompt = '') {
    if (this.subject !== subject || this.scheme !== scheme) {
      this.messages     = [];
      this.subject      = subject;
      this.scheme       = scheme;
      this.systemPrompt = systemPrompt;
      this.save();
      this._notify();
    }
  }

  addMessage(role, content) {
    const msg = {
      id:        `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role,
      content,
      timestamp: Date.now(),
    };
    this.messages.push(msg);
    this.save();
    this._notify();
    return msg;
  }

  updateLastAssistant(content) {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].role === 'assistant') {
        this.messages[i].content = content;
        this.save();
        this._notify();
        return;
      }
    }
  }

  getMessages()          { return [...this.messages]; }
  getRecentHistory(n=6)  { return this.messages.slice(-n); }

  clear() {
    this.messages = [];
    this.save();
    this._notify();
  }

  save() {
    try {
      SecureStorage.save(CONVERSATION_KEY, {
        messages: this.messages.slice(-30),
        subject:  this.subject,
        scheme:   this.scheme,
      });
    } catch (_) {}
  }

  load() {
    try {
      const data = SecureStorage.load(CONVERSATION_KEY);
      if (data) {
        this.messages = data.messages || [];
        this.subject  = data.subject  || '';
        this.scheme   = data.scheme   || '';
      }
    } catch (_) {}
  }

  setMigrating(state) {
    this.isMigrating = state;
    this._notify();
  }
}

const conversationManager = new ConversationManager();

// ============================================================
// SECTION 8 — INPUT SANITIZATION
// BUG 7 FIX: style and class removed from ALLOWED_ATTR
// ============================================================

function sanitizeUserInput(input) {
  if (!input) return '';
  return String(input)
    .replace(/\[INST\]|\[\/INST\]/gi, '')
    .replace(/<\|.*?\|>/g, '')
    .replace(/system\s*:/gi,    'system_')
    .replace(/assistant\s*:/gi, 'assistant_')
    .slice(0, 4000)
    .trim();
}

// BUG 7 FIX: ALLOWED_ATTR is empty — no style/class injection possible
function sanitizeHTML(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'code', 'br'],
    ALLOWED_ATTR: [],
  });
}

// ============================================================
// SECTION 9 — RAG ENGINE
// ============================================================

function buildRAGContext(subject, scheme) {
  const details = subjectDetails[subject] || {};
  const pyqs    = details.exactPyqs || {};

  const allPYQs = [
    ...(pyqs.partA_3Marks  || []).map(q =>
      typeof q === 'object'
        ? `[Part A - ${q.marks || 3}m - M${q.module || '?'}] ${q.q}`
        : `[Part A] ${q}`
    ),
    ...(pyqs.partB_Detailed || []).map(q =>
      typeof q === 'object'
        ? `[Part B - ${q.marks}m - M${q.module || '?'}] ${q.q}`
        : `[Part B] ${q}`
    ),
  ].join('\n');

  const rules      = SCHEME_RULES[scheme];
  const schemeInfo = rules
    ? `External: ${rules.externalMax} marks | Internal: ${rules.internalMax} marks | Pass: ${rules.minTotal}`
    : 'Standard KTU scheme';

  return `
═══════════════════════════════════════════════════
KTU RAG KNOWLEDGE BASE — STRICTLY USE THIS DATA
═══════════════════════════════════════════════════
SUBJECT: ${subject}
SCHEME: ${scheme} (${schemeInfo})
SYLLABUS: ${details.syllabus || 'Standard KTU syllabus'}
KEY FORMULAS:
${(details.formulas || []).map(f => `  • ${f}`).join('\n') || '  (No specific formulas listed)'}
EXAM INSIGHT: ${details.pyq || 'Follow standard KTU exam pattern'}

PAST YEAR QUESTIONS:
${allPYQs || '(No PYQ data available)'}
═══════════════════════════════════════════════════
`.trim();
}

// ============================================================
// SECTION 10 — CALL AI FACTORY
// BUG 4 FIX: withRetry wraps the ENTIRE dispatch ONCE here only.
//            Gemini uses x-goog-api-key HEADER (not ?key= param).
// ============================================================

function makeCallAI(provider, apiKey, model, customBaseUrl = '') {
  return async function callAI(prompt) {
    if (!prompt || !prompt.trim()) throw new Error('Empty prompt.');

    if (!rateLimiter.canMakeRequest(provider)) {
      const wait = Math.ceil(rateLimiter.timeUntilNextRequest(provider) / 1000);
      throw new Error(`Rate limit reached. Please wait ${wait} seconds before trying again.`);
    }
    rateLimiter.recordRequest(provider);

    // withRetry wraps entire dispatch — no nested withRetry anywhere
    return await withRetry(async () => {

      // ── Gemini + Gemini Express — centralized REST client ──
      // Self-heals retired/unsupported models: verifies a live model and retries once.
      if (provider === 'gemini' || provider === 'gemini_express') {
        const fetcher = (url, opts, ms) => apiClient.request(url, opts, ms);
        let text;
        try {
          text = await generateContent({ apiKey, model, prompt, fetcher });
        } catch (err) {
          if (err?.isGemini && err.category === GEMINI_ERROR_CATEGORIES.MODEL_UNAVAILABLE) {
            const healed = await healGeminiModel({ apiKey, requestedModel: model, fetcher });
            if (!healed) throw err;
            const saved = SecureStorage.load(STORAGE_KEY);
            if (saved && typeof saved === 'object' && saved.model === model) {
              saved.model = healed;
              SecureStorage.save(STORAGE_KEY, saved);
            }
            text = await generateContent({ apiKey, model: healed, prompt, fetcher });
          } else {
            throw err;
          }
        }
        return text;
      }

      // ── Claude ──
      if (provider === 'claude') {
        const res = await apiClient.request(
          'https://api.anthropic.com/v1/messages',
          {
            method: 'POST',
            headers: {
              'Content-Type':   'application/json',
              'x-api-key':      apiKey,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
              model,
              max_tokens: 8192,
              messages:   [{ role: 'user', content: prompt }],
            }),
          },
          60000
        );
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d?.error?.message || `Claude error ${res.status}`);
        }
        const d    = await res.json();
        const text = d.content?.[0]?.text || '';
        if (!text.trim()) throw new Error('Model returned an empty response.');
        return text;
      }

      // ── Custom LLM ──
      if (provider === 'custom') {
        const base     = (customBaseUrl || '').trim().replace(/\/+$/, '');
        const chatPath = base.endsWith('/chat/completions')
          ? base
          : base.endsWith('/v1')
            ? `${base}/chat/completions`
            : `${base}/v1/chat/completions`;

        const res = await apiClient.request(
          chatPath,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
              model,
              messages:    [{ role: 'user', content: prompt }],
              max_tokens:  8192,
              temperature: 0.4,
            }),
          },
          60000
        );
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d?.error?.message || `Custom LLM error ${res.status}`);
        }
        const d    = await res.json();
        const text = d.choices?.[0]?.message?.content || '';
        if (!text.trim()) throw new Error('Model returned an empty response.');
        return text;
      }

      // ── Any other OpenAI-compatible provider ──
      const providerConfig = AI_PROVIDERS.find(p => p.id === provider);
      if (providerConfig?.baseUrl) {
        const res = await apiClient.request(
          `${providerConfig.baseUrl}/chat/completions`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
              model,
              messages:    [{ role: 'user', content: prompt }],
              max_tokens:  8192,
              temperature: 0.4,
            }),
          },
          60000
        );
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d?.error?.message || d?.detail || `${providerConfig.name} error ${res.status}`);
        }
        const d    = await res.json();
        const text = d.choices?.[0]?.message?.content || '';
        if (!text.trim()) throw new Error('Model returned an empty response.');
        return text;
      }

      throw new Error('Unknown provider. Please reconfigure your API key.');
    }, 2, 1500);
  };
}

// ============================================================
// SECTION 11 — KTU HELPERS
// ============================================================

function freqToConfidence(freq) {
  if (freq >= 5) return 95;
  if (freq === 4) return 80;
  if (freq === 3) return 65;
  return 45;
}

function freqToBadge(freq) {
  const conf = freqToConfidence(freq);
  if (conf >= 80) return { label: 'HIGH', emoji: '🔥', color: '#86dfba', bg: 'rgba(134,223,186,0.12)', border: 'rgba(134,223,186,0.3)' };
  if (conf >= 65) return { label: 'MED',  emoji: '⚡', color: '#f0c987', bg: 'rgba(240,201,135,0.12)', border: 'rgba(240,201,135,0.3)' };
  return           { label: 'LOW',  emoji: '📌', color: '#9ba7b8', bg: 'rgba(155,167,184,0.1)',  border: 'rgba(155,167,184,0.2)'  };
}

function getSchemeRules(scheme) {
  const rules = SCHEME_RULES[scheme] || SCHEME_RULES['2024'];
  return {
    internalMax: rules.internalMax || 40,
    externalMax: rules.externalMax || 60,
    minInternal: rules.minInternal || 0,
    minExternal: rules.minExternal || 24,
    minTotal:    rules.minTotal    || 50,
    modules:     rules.modules     || 4,
    partA:       rules.partA       || { marksEach: 3,  totalMarks: 15 },
    partB:       rules.partB       || { marksEach: 9,  totalMarks: 45 },
    note:        rules.note        || '',
  };
}

function calcMinExternalNeeded(internalMarks, scheme) {
  const rules          = getSchemeRules(scheme);
  const internal       = parseInt(internalMarks) || 0;
  const neededForTotal = rules.minTotal - internal;
  const needed         = Math.max(rules.minExternal, neededForTotal);
  return Math.min(needed, rules.externalMax);
}

function getAdaptiveBuffer(avgConfidence) {
  if (avgConfidence >= 90) return 4;
  if (avgConfidence >= 80) return 8;
  if (avgConfidence >= 65) return 12;
  return 16;
}

function calculateTargetStrategy(questions, targetMark, scheme, isDrawing = false) {
  const target = parseInt(targetMark) || 0;
  const sorted = [...questions].sort((a, b) => (b.freq || 2) - (a.freq || 2));
  const mustStudyIds = new Set();
  let guaranteedMarks = 0;

  if (isDrawing) {
    const topQ   = sorted.slice(0, Math.ceil(sorted.length * 0.5));
    const avgConf = topQ.length > 0
      ? Math.round(topQ.reduce((s, q) => s + freqToConfidence(q.freq || 2), 0) / topQ.length)
      : 65;
    const buffer          = getAdaptiveBuffer(avgConf);
    const targetWithBuffer = target + buffer;
    for (const q of sorted) {
      if (guaranteedMarks >= targetWithBuffer) break;
      mustStudyIds.add(q.id);
      guaranteedMarks += q.marks;
    }
  } else {
    const partAQs = sorted.filter(q => q.partType === 'A');
    const partBQs = sorted.filter(q => q.partType === 'B');
    partAQs.forEach(q => { mustStudyIds.add(q.id); guaranteedMarks += q.marks; });
    const modules     = [...new Set(partBQs.map(q => q.module))].sort();
    const backupPartB = [];
    modules.forEach(mod => {
      const modQs = partBQs.filter(q => q.module === mod);
      if (!modQs.length) return;
      mustStudyIds.add(modQs[0].id);
      guaranteedMarks += modQs[0].marks;
      modQs.slice(1).forEach(q => backupPartB.push(q));
    });
    const mustList   = sorted.filter(q => mustStudyIds.has(q.id));
    const avgConf    = mustList.length > 0
      ? Math.round(mustList.reduce((s, q) => s + freqToConfidence(q.freq || 2), 0) / mustList.length)
      : 65;
    const buffer          = getAdaptiveBuffer(avgConf);
    const targetWithBuffer = target + buffer;
    const sortedBackup    = [...backupPartB].sort((a, b) => (b.freq || 2) - (a.freq || 2));
    for (const q of sortedBackup) {
      if (guaranteedMarks >= targetWithBuffer) break;
      mustStudyIds.add(q.id);
      guaranteedMarks += q.marks;
    }
  }

  const mustList = sorted.filter(q => mustStudyIds.has(q.id));
  const avgConf  = mustList.length > 0
    ? Math.round(mustList.reduce((s, q) => s + freqToConfidence(q.freq || 2), 0) / mustList.length)
    : 0;

  return { mustStudyIds, guaranteedMarks, target, canAchieve: guaranteedMarks >= target, totalMustStudy: mustStudyIds.size, avgConfidence: avgConf };
}

// ============================================================
// SECTION 12 — SUBJECT HELPERS
// ============================================================

function isCodingSubject(subject) {
  const kw = ['python','java','programming','oop','object oriented','programming in c','algorithmic','data structures','dsa','compiler','discrete'];
  return kw.some(k => (subject || '').toLowerCase().includes(k));
}

function isDrawingSubject(subject) {
  const kw = ['engineering graphics','engineering drawing','graphics','drawing','cad','drafting'];
  return kw.some(k => (subject || '').toLowerCase().includes(k));
}

function isDrawingQuestion(text) {
  const kw = ['draw','sketch','construct','project','isometric','orthographic','elevation','plan view','section','auxiliary view','illustrate','show the figure','represent'];
  return kw.some(k => (text || '').toLowerCase().includes(k));
}

// ============================================================
// SECTION 13 — SOUND  (BUG 16 FIX)
// Single shared AudioContext reused across calls
// ============================================================

let _sharedAudioCtx = null;

function getAudioContext() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!_sharedAudioCtx || _sharedAudioCtx.state === 'closed') {
      _sharedAudioCtx = new AudioCtx();
    }
    return _sharedAudioCtx;
  } catch (_) { return null; }
}

function playCompletionSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); return; }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.15 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 2.5);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 2.5);
    });
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  } catch (_) {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }
}

// ============================================================
// SECTION 14 — CUSTOM HOOKS
// BUG 1  FIX: debounce increased to 1200ms
// BUG 2  FIX: 'needs_provider' emitted for unknown/sk_ambiguous
// BUG 3  FIX: selectProvider wired through hook for all grids
// BUG 17 FIX: session restore checks PROVIDER_ADAPTERS existence
// ============================================================

function useAPIVerification() {
  const [apiKey,          setApiKey]          = useState('');
  const [manualProvider,  setManualProvider]  = useState(null);
  const [customBaseUrl,   setCustomBaseUrl]   = useState('');
  const [verifyStatus,    setVerifyStatus]    = useState('idle');
  const [verifyPhase,     setVerifyPhase]     = useState(0);
  const [verifyProgress,  setVerifyProgress]  = useState(0);
  const [verifyError,     setVerifyError]     = useState('');
  const [verifyLiveMsg,   setVerifyLiveMsg]   = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel,   setSelectedModel]   = useState('');
  const [verifiedConfig,  setVerifiedConfig]  = useState(null);
  const [detectedProvider,setDetectedProvider]= useState(null);

  const verifyTimerRef = useRef(null);
  const debounceRef    = useRef(null);
  const abortRef       = useRef(false);
  const runIdRef       = useRef(0);

  const _clearTimers = useCallback(() => {
    if (verifyTimerRef.current) { clearInterval(verifyTimerRef.current); verifyTimerRef.current = null; }
    if (debounceRef.current)    { clearTimeout(debounceRef.current);     debounceRef.current    = null; }
  }, []);

  const runVerification = useCallback(async (key, providerOverride, baseUrl) => {
    const trimmed = (key || '').trim();
    if (!trimmed || trimmed.length < 4) return;

    abortRef.current = true;
    _clearTimers();

    const myRunId    = ++runIdRef.current;
    abortRef.current = false;

    const autoDetected  = detectProviderByPrefix(trimmed);
    const providerToUse = providerOverride || autoDetected;

    // BUG 2 FIX: emit needs_provider for unknown/ambiguous keys
    if (!providerOverride && (autoDetected === 'unknown' || autoDetected === 'sk_ambiguous')) {
      setDetectedProvider(autoDetected);
      setVerifyStatus('needs_provider');
      return;
    }

    if (providerToUse === 'custom' && !(baseUrl || '').trim()) {
      setDetectedProvider('custom');
      setVerifyStatus('needs_url');
      return;
    }

    setDetectedProvider(providerToUse);
    setVerifyStatus('verifying');
    setVerifyPhase(0);
    setVerifyProgress(0);
    setVerifyError('');
    setVerifyLiveMsg('Detecting API type...');

    let progress = 0;
    verifyTimerRef.current = setInterval(() => {
      if (abortRef.current || runIdRef.current !== myRunId) return;
      progress = Math.min(progress + 12, 88);
      setVerifyProgress(progress);
      setVerifyPhase(Math.min(Math.floor((progress / 90) * (VERIFY_PHASES.length - 1)), VERIFY_PHASES.length - 1));
    }, 350);

    try {
      const result = await universalVerify(
        trimmed,
        providerToUse === 'unknown' ? null : providerToUse,
        baseUrl || '',
        msg => { if (!abortRef.current && runIdRef.current === myRunId) setVerifyLiveMsg(msg); }
      );
      if (abortRef.current || runIdRef.current !== myRunId) return;
      _clearTimers();
      setVerifyProgress(100);
      setVerifyPhase(VERIFY_PHASES.length - 1);
      setVerifyLiveMsg('API working ✅');
      setAvailableModels(result.availableModels || []);
      setSelectedModel(result.model || '');
      setVerifiedConfig(result);
      setVerifyStatus('success');
    } catch (err) {
      if (abortRef.current || runIdRef.current !== myRunId) return;
      _clearTimers();
      setVerifyStatus('error');
      setVerifyError(err.message || 'Verification failed. Please check your key.');
      setVerifyLiveMsg('');
    }
  }, [_clearTimers]);

  // BUG 1 FIX: debounce increased to 1200ms
  useEffect(() => {
    _clearTimers();
    const trimmed = (apiKey || '').trim();
    if (!trimmed || trimmed.length < 4) {
      abortRef.current = true;
      setVerifyStatus('idle');
      setDetectedProvider(null);
      setVerifiedConfig(null);
      setVerifyError('');
      setVerifyLiveMsg('');
      return;
    }
    debounceRef.current = setTimeout(() => {
      runVerification(apiKey, manualProvider, customBaseUrl);
    }, 1200); // increased from 800ms
    return _clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, manualProvider, customBaseUrl]);

  useEffect(() => () => { abortRef.current = true; _clearTimers(); }, [_clearTimers]);

  // BUG 3 FIX: selectProvider exposed and wired correctly
  const selectProvider = useCallback((pid) => {
    setManualProvider(pid);
    setVerifyStatus('idle');
    setVerifyError('');
    if (pid === 'custom') {
      setDetectedProvider('custom');
      if (!(customBaseUrl || '').trim()) { setVerifyStatus('needs_url'); return; }
    }
    const trimmed = (apiKey || '').trim();
    if (trimmed.length >= 4) runVerification(apiKey, pid, customBaseUrl);
  }, [apiKey, customBaseUrl, runVerification]);

  const submitCustomUrl = useCallback(() => {
    const trimmed = (apiKey || '').trim();
    if (trimmed.length >= 4 && (customBaseUrl || '').trim()) {
      runVerification(apiKey, 'custom', customBaseUrl);
    }
  }, [apiKey, customBaseUrl, runVerification]);

  const reset = useCallback(() => {
    abortRef.current = true;
    _clearTimers();
    runIdRef.current++;
    setApiKey('');
    setManualProvider(null);
    setCustomBaseUrl('');
    setVerifyStatus('idle');
    setVerifyPhase(0);
    setVerifyProgress(0);
    setVerifyError('');
    setVerifyLiveMsg('');
    setAvailableModels([]);
    setSelectedModel('');
    setVerifiedConfig(null);
    setDetectedProvider(null);
  }, [_clearTimers]);

  return {
    apiKey,           setApiKey,
    manualProvider,   selectProvider,
    customBaseUrl,    setCustomBaseUrl,
    submitCustomUrl,
    verifyStatus,     verifyPhase,
    verifyProgress,   verifyError,
    verifyLiveMsg,
    availableModels,  selectedModel,  setSelectedModel,
    verifiedConfig,   detectedProvider,
    runVerification,  reset,
  };
}

// Hook: Bookmarks
function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => BookmarkStorage.load());

  const isBookmarked = useCallback((id) => bookmarks.some(b => b.id === id), [bookmarks]);

  const toggleBookmark = useCallback((item) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === item.id);
      const next   = exists ? prev.filter(b => b.id !== item.id) : [...prev, { ...item, savedAt: Date.now() }];
      BookmarkStorage.save(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setBookmarks([]);
    BookmarkStorage.save([]);
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark, clearAll };
}

// Hook: Reading Progress
function useReadingProgress(containerRef) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef?.current ?? null;
    const handler = () => {
      if (!el) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
        return;
      }
      const total = el.scrollHeight - el.clientHeight;
      if (total <= 0) { setProgress(0); return; }
      setProgress(Math.min(100, Math.max(0, (el.scrollTop / total) * 100)));
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    if (el) el.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('scroll', handler);
      if (el) el.removeEventListener('scroll', handler);
    };
  }, [containerRef]);

  return progress;
}

// Hook: Copy to clipboard
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      if (timerRef.current) clearTimeout(timerRef.current);
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (_) { return false; }
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { copied, copy };
}
// ============================================================
// SECTION 15 — ATLAS LOGO
// ============================================================

function AtlasLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg" aria-label="ATLAS logo" role="img">
      <defs>
        <radialGradient id="atlasGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#7c9eff" />
          <stop offset="60%"  stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#7c9eff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c9eff" stopOpacity="0"   />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#glowGrad)" />
      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(124,158,255,0.4)" strokeWidth="1.5" />
      {[[50,18,72,35],[72,35,68,62],[68,62,42,72],[42,72,22,55],[22,55,30,28],[30,28,50,18]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7c9eff" strokeWidth="1" strokeOpacity="0.6" />
      ))}
      {[[50,18],[72,35],[68,62],[42,72],[22,55],[30,28]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#c4b5fd" fillOpacity="0.9" />
      ))}
      <rect x="38" y="44" width="24" height="10" rx="3" fill="url(#atlasGrad)" />
      <ellipse cx="62" cy="49" rx="5" ry="6" fill="#a78bfa" fillOpacity="0.8" />
      <rect x="33" y="46" width="8" height="6" rx="2" fill="#7c9eff" fillOpacity="0.9" />
      <line x1="50" y1="54" x2="42" y2="70" stroke="#7c9eff" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="50" y1="54" x2="58" y2="70" stroke="#7c9eff" strokeWidth="2" strokeOpacity="0.7" />
      <line x1="50" y1="54" x2="50" y2="70" stroke="#7c9eff" strokeWidth="2" strokeOpacity="0.7" />
      <circle cx="50" cy="49" r="3" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

// ============================================================
// SECTION 16 — READING PROGRESS BAR
// ============================================================

function ReadingProgressBar() {
  const progress = useReadingProgress(null);
  if (progress < 2) return null;
  return <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}

// ============================================================
// SECTION 17 — PROVIDER SWITCH TOAST
// ============================================================

function ProviderSwitchToast({ show, fromProvider, toProvider, onComplete }) {
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onCompleteRef.current?.(), 2500);
    return () => clearTimeout(t);
  }, [show]);

  const fromInfo = fromProvider ? AI_PROVIDERS.find(p => p.id === fromProvider) : null;
  const toInfo   = toProvider   ? AI_PROVIDERS.find(p => p.id === toProvider)   : null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0,   scale: 1    }}
          exit={{   opacity: 0, y: -20,  scale: 0.95 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9700] px-4"
          style={{ pointerEvents: 'none' }}
        >
          <div className="glass-panel rounded-2xl px-5 py-3 flex items-center space-x-3"
            style={{ border: '1px solid rgba(124,158,255,0.3)' }}>
            <motion.div animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw className="w-4 h-4" style={{ color: '#7c9eff' }} />
            </motion.div>
            <div className="text-sm">
              <span className="font-bold" style={{ color: '#e6ebf2' }}>Switching AI</span>
              {fromInfo && toInfo && (
                <span className="ml-2" style={{ color: '#9ba7b8' }}>
                  {fromInfo.icon} → {toInfo.icon} {toInfo.name}
                </span>
              )}
            </div>
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full" style={{ background: '#86dfba' }} />
          </div>
          <p className="text-xs text-center mt-2 font-medium" style={{ color: '#6b7787' }}>
            Your conversation stays intact ✓
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// SECTION 18 — PROVIDER SELECTOR
// BUG 3 FIX: all buttons call onSelect(p.id) with onClick
// ============================================================

function ProviderSelector({ onSelect, selected, customBaseUrl, setCustomBaseUrl, onSubmitCustomUrl }) {
  const shownProviders = AI_PROVIDERS.filter(p => p.featured || p.id === 'custom');

  return (
    <div className="mb-4">
      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#f0c987' }}>
        ⚠ Select your provider:
      </p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {shownProviders.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className="relative flex flex-col items-center p-3 rounded-2xl transition-all min-h-[64px]"
            style={{
              background: selected === p.id ? (p.gradient || 'rgba(124,158,255,0.15)') : 'rgba(255,255,255,0.02)',
              border: `1px solid ${selected === p.id ? (p.border || 'rgba(124,158,255,0.3)') : 'rgba(255,255,255,0.06)'}`,
              cursor: 'pointer',
            }}
            aria-pressed={selected === p.id}
          >
            {p.badge && (
              <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-black"
                style={{
                  background: p.badgeBg || 'rgba(134,223,186,0.15)',
                  color: p.badgeColor || '#86dfba',
                  border: `1px solid ${(p.badgeColor || '#86dfba')}33`,
                }}>
                {p.badge}
              </div>
            )}
            <span className="text-xl mb-1" style={{ color: selected === p.id ? p.color : '#6b7787' }}>
              {p.icon}
            </span>
            <span className="text-[10px] font-black text-center leading-tight"
              style={{ color: selected === p.id ? '#e6ebf2' : '#9ba7b8' }}>
              {p.name}
            </span>
          </button>
        ))}
      </div>

      {selected === 'custom' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <div className="p-4 rounded-2xl mb-3"
            style={{ background: 'rgba(107,119,135,0.06)', border: '1px solid rgba(107,119,135,0.2)' }}>
            <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: '#9ba7b8' }}>
              API Base URL
            </p>
            <p className="text-[11px] mb-3 leading-relaxed" style={{ color: '#9ba7b8' }}>
              Any OpenAI-compatible LLM API URL.{' '}
              Example:{' '}
              <span className="font-mono" style={{ color: '#7c9eff' }}>https://api.deepseek.com</span>
            </p>
            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="https://api.example.com/v1"
                value={customBaseUrl}
                onChange={e => setCustomBaseUrl(e.target.value)}
                className="flex-1 atlas-input rounded-xl px-3 py-2.5 text-sm font-medium"
                style={{ color: '#e6ebf2' }}
              />
              <motion.button
                type="button"
                onClick={onSubmitCustomUrl}
                disabled={!(customBaseUrl || '').trim()}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 min-h-[44px]"
                style={{
                  background: 'rgba(124,158,255,0.15)',
                  border: '1px solid rgba(124,158,255,0.3)',
                  color: '#7c9eff',
                }}
              >
                Verify
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// SECTION 19 — VERIFY BLOCK
// BUG 2 FIX: renders ProviderSelector when status === 'needs_provider'
// ============================================================

function VerifyBlock({ hook }) {
  const {
    verifyStatus, verifyPhase, verifyProgress, verifyError, verifyLiveMsg,
    availableModels, selectedModel, setSelectedModel, verifiedConfig,
    detectedProvider, manualProvider, selectProvider,
    customBaseUrl, setCustomBaseUrl, submitCustomUrl,
  } = hook;

  const detectedProv = detectedProvider ? AI_PROVIDERS.find(p => p.id === detectedProvider) : null;

  return (
    <AnimatePresence mode="wait">

      {/* BUG 2 FIX: show ProviderSelector for needs_provider */}
      {verifyStatus === 'needs_provider' && (
        <motion.div key="np"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
          <ProviderSelector
            onSelect={selectProvider}
            selected={manualProvider}
            customBaseUrl={customBaseUrl}
            setCustomBaseUrl={setCustomBaseUrl}
            onSubmitCustomUrl={submitCustomUrl}
          />
        </motion.div>
      )}

      {/* Verifying */}
      {verifyStatus === 'verifying' && (
        <motion.div key="v"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
          <div className="rounded-2xl p-4"
            style={{ background: 'rgba(124,158,255,0.06)', border: '1px solid rgba(124,158,255,0.2)' }}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <motion.div className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: 'transparent', borderTopColor: '#7c9eff' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-3 h-3" style={{ color: '#7c9eff' }} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black mb-0.5" style={{ color: '#e6ebf2' }}>Verifying API Key</p>
                <motion.p key={verifyLiveMsg || verifyPhase}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-[11px] font-mono truncate" style={{ color: '#7c9eff' }}>
                  {verifyLiveMsg || `${VERIFY_PHASES[verifyPhase]?.icon} ${VERIFY_PHASES[verifyPhase]?.label}`}
                </motion.p>
              </div>
              <span className="text-[11px] font-black flex-shrink-0" style={{ color: '#a78bfa' }}>
                {Math.round(verifyProgress)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,158,255,0.1)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#7c9eff,#a78bfa)' }}
                animate={{ width: `${verifyProgress}%` }}
                transition={{ duration: 0.4 }} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Success */}
      {verifyStatus === 'success' && verifiedConfig && (
        <motion.div key="s"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-2xl p-4 mb-3"
          style={{ background: 'rgba(134,223,186,0.06)', border: '1px solid rgba(134,223,186,0.25)' }}>
          <div className="flex items-center space-x-2 mb-3">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}>
              <CheckCircle className="w-5 h-5" style={{ color: '#86dfba' }} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black" style={{ color: '#86dfba' }}>Verified! Ready to launch.</p>
              <p className="text-[11px] truncate" style={{ color: '#9ba7b8' }}>
                {verifiedConfig.detectedName || detectedProv?.name || 'Provider'} · {verifiedConfig.model}
              </p>
              <p className="text-[10px] font-mono truncate" style={{ color: '#64748b' }}
                title={formatHealthReportLine(buildAIHealthReport(verifiedConfig))}>
                {formatHealthReportLine(buildAIHealthReport(verifiedConfig))}
              </p>
            </div>
            {detectedProv && <div className="text-xl flex-shrink-0">{detectedProv.icon}</div>}
          </div>
          {availableModels.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#9ba7b8' }}>
                Select Model
              </p>
              <div className="relative">
                <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}
                  className="w-full atlas-select text-sm font-bold rounded-xl px-3 py-2.5 pr-8"
                  style={{ color: '#e6ebf2' }}>
                  {availableModels.map(m => (
                    <option key={m} value={m} style={{ background: '#1a2028' }}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                  style={{ color: '#6b7787' }} />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Error */}
      {verifyStatus === 'error' && (
        <motion.div key="e"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-2xl p-4 mb-3"
          style={{ background: 'rgba(232,165,152,0.06)', border: '1px solid rgba(232,165,152,0.25)' }}>
          <div className="flex items-start space-x-2">
            <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#e8a598' }} />
            <div>
              <p className="text-xs font-black mb-1" style={{ color: '#e8a598' }}>Verification Failed</p>
              <p className="text-[12px] font-medium leading-relaxed"
                style={{ color: 'rgba(232,165,152,0.85)' }}>{verifyError}</p>
            </div>
          </div>
          <div className="mt-3">
            <ProviderSelector
              onSelect={hook.selectProvider}
              selected={hook.manualProvider}
              customBaseUrl={hook.customBaseUrl}
              setCustomBaseUrl={hook.setCustomBaseUrl}
              onSubmitCustomUrl={hook.submitCustomUrl}
            />
          </div>
        </motion.div>
      )}

      {/* Needs URL */}
      {verifyStatus === 'needs_url' && (
        <motion.div key="nu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="mb-3 p-3 rounded-2xl"
          style={{ background: 'rgba(107,119,135,0.06)', border: '1px solid rgba(107,119,135,0.2)' }}>
          <p className="text-[11px] font-bold" style={{ color: '#9ba7b8' }}>
            Enter your API base URL above and click Verify.
          </p>
        </motion.div>
      )}

    </AnimatePresence>
  );
}

// ============================================================
// SECTION 20 — QUOTE POPUP
// ============================================================

function QuotePopup({ onDismiss }) {
  const quoteRef = useRef(null);
  if (!quoteRef.current) {
    quoteRef.current = FAMOUS_QUOTES[Math.floor(Math.random() * FAMOUS_QUOTES.length)];
  }
  const quote        = quoteRef.current;
  const onDismissRef = useRef(onDismiss);
  useEffect(() => { onDismissRef.current = onDismiss; }, [onDismiss]);
  useEffect(() => {
    const t = setTimeout(() => onDismissRef.current?.(), 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div className="nudge-popup"
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0,   scale: 1    }}
      exit={{   opacity: 0, y: -20,  scale: 0.95 }}
      role="status" aria-live="polite">
      <div className="flex items-start justify-between space-x-3">
        <div className="flex items-start space-x-3">
          <span className="text-xl flex-shrink-0" aria-hidden="true">💫</span>
          <div>
            <p className="text-sm font-semibold leading-relaxed italic" style={{ color: '#e6ebf2' }}>
              "{quote.text}"
            </p>
            <p className="text-[11px] font-black mt-1" style={{ color: '#f0c987' }}>— {quote.author}</p>
          </div>
        </div>
        <button type="button" onClick={onDismiss}
          className="flex-shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg"
          style={{ color: '#6b7787' }} aria-label="Dismiss quote">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION 21 — FLOATING TIMER  (BUG 10 FIX)
// Single consolidated interval; doneTimerRef cleared on focusMins change
// ============================================================

function FloatingTimer({ focusMins, onFocusMinsChange }) {
  const [secondsLeft, setSecondsLeft] = useState(focusMins * 60);
  const [running,     setRunning]     = useState(false);
  const [showTimer,   setShowTimer]   = useState(false);
  const [showConfig,  setShowConfig]  = useState(false);
  const [isDone,      setIsDone]      = useState(false);

  const intervalRef  = useRef(null);
  const doneTimerRef = useRef(null);
  const focusMinsRef = useRef(focusMins);

  useEffect(() => { focusMinsRef.current = focusMins; }, [focusMins]);

  // BUG 10 FIX: clear BOTH interval AND doneTimerRef when focusMins changes
  useEffect(() => {
    if (intervalRef.current)  { clearInterval(intervalRef.current);  intervalRef.current  = null; }
    if (doneTimerRef.current) { clearTimeout(doneTimerRef.current);  doneTimerRef.current = null; }
    setSecondsLeft(focusMins * 60);
    setRunning(false);
    setIsDone(false);
  }, [focusMins]);

  // Single interval effect
  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setRunning(false);
          setIsDone(true);
          playCompletionSound();
          if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
          doneTimerRef.current = setTimeout(() => {
            setIsDone(false);
            setSecondsLeft(focusMinsRef.current * 60);
            doneTimerRef.current = null;
          }, 5000);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [running]);

  useEffect(() => () => {
    if (intervalRef.current)  clearInterval(intervalRef.current);
    if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
  }, []);

  const total   = focusMins * 60;
  const pct     = total > 0 ? ((total - secondsLeft) / total) * 100 : 0;
  const mins    = Math.floor(secondsLeft / 60);
  const secs    = secondsLeft % 60;
  const timeStr = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  const handleReset = useCallback(() => {
    if (intervalRef.current)  { clearInterval(intervalRef.current);  intervalRef.current  = null; }
    if (doneTimerRef.current) { clearTimeout(doneTimerRef.current);  doneTimerRef.current = null; }
    setRunning(false);
    setIsDone(false);
    setSecondsLeft(focusMinsRef.current * 60);
  }, []);

  const handleToggle = useCallback(() => {
    if (isDone) { handleReset(); return; }
    setRunning(p => !p);
  }, [isDone, handleReset]);

  const pillLabel = isDone ? '✓ Done' : `⏱ ${timeStr}`;

  const TimerContent = () => (
    <div className="p-4 md:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4" style={{ color: '#7c9eff' }} />
          <span className="text-xs font-black uppercase tracking-wider" style={{ color: '#e6ebf2' }}>
            Focus Timer
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button type="button" onClick={() => setShowConfig(p => !p)}
            className="p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
            style={{ color: '#6b7787' }} aria-label="Timer settings">
            <Settings2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => setShowTimer(false)}
            className="p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
            style={{ color: '#6b7787' }} aria-label="Close timer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90" aria-hidden="true">
            <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(124,158,255,0.08)" strokeWidth="6" />
            <motion.circle cx="45" cy="45" r="38" fill="none"
              stroke={isDone ? '#86dfba' : running ? '#7c9eff' : 'rgba(124,158,255,0.4)'}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 38}`}
              strokeDashoffset={`${2 * Math.PI * 38 * (1 - pct / 100)}`}
              transition={{ duration: 1, ease: 'linear' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isDone ? (
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <CheckCircle className="w-9 h-9" style={{ color: '#86dfba' }} />
              </motion.div>
            ) : (
              <>
                <span className="font-black text-lg leading-none" style={{ color: '#e6ebf2' }}
                  aria-live="polite" aria-atomic="true">{timeStr}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: '#7c9eff' }}>
                  {running ? 'FOCUS' : 'READY'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-3 mb-4">
        <motion.button type="button" onClick={handleToggle}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold min-h-[44px]"
          style={{
            background: isDone ? 'rgba(134,223,186,0.15)' : running ? 'rgba(232,165,152,0.15)' : 'rgba(124,158,255,0.15)',
            border: `1px solid ${isDone ? 'rgba(134,223,186,0.35)' : running ? 'rgba(232,165,152,0.35)' : 'rgba(124,158,255,0.35)'}`,
            color: isDone ? '#86dfba' : running ? '#e8a598' : '#7c9eff',
          }}>
          {isDone ? <><RotateCcw className="w-3.5 h-3.5" /><span>Reset</span></>
            : running ? <><Pause className="w-3.5 h-3.5" /><span>Pause</span></>
              : <><Play className="w-3.5 h-3.5" /><span>Start</span></>}
        </motion.button>
        <button type="button" onClick={handleReset}
          className="p-2.5 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7787' }}
          aria-label="Reset timer">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(124,158,255,0.1)' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: isDone ? 'linear-gradient(90deg,#86dfba,#c4e5d1)' : 'linear-gradient(90deg,#7c9eff,#a78bfa)' }}
          animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
      </div>

      <AnimatePresence>
        {showConfig && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="p-3 rounded-xl mt-2"
              style={{ background: 'rgba(124,158,255,0.06)', border: '1px solid rgba(124,158,255,0.12)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold" style={{ color: '#9ba7b8' }}>Duration</span>
                <div className="flex items-center space-x-2">
                  <input type="range" min="5" max="120" step="5" value={focusMins}
                    onChange={e => onFocusMinsChange(Number(e.target.value))}
                    className="w-24 h-1 accent-indigo-500" aria-label="Focus duration in minutes" />
                  <span className="text-[11px] font-black w-8" style={{ color: '#7c9eff' }}>{focusMins}m</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[15, 25, 30, 45, 60].map(m => (
                  <button key={m} type="button" onClick={() => onFocusMinsChange(m)}
                    className="px-2 py-1 rounded-lg text-[10px] font-black transition-all min-h-[32px]"
                    style={{
                      background: focusMins === m ? 'rgba(124,158,255,0.2)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${focusMins === m ? 'rgba(124,158,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      color: focusMins === m ? '#7c9eff' : '#6b7787',
                    }}>
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <div className="fixed bottom-4 left-4 z-[8000]">
        <motion.button type="button" onClick={() => setShowTimer(p => !p)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-3 py-2 rounded-full font-black text-xs"
          style={{
            background: isDone
              ? 'linear-gradient(135deg,rgba(134,223,186,0.2),rgba(134,223,186,0.1))'
              : running
                ? 'linear-gradient(135deg,rgba(124,158,255,0.25),rgba(167,139,250,0.2))'
                : 'rgba(26,32,40,0.9)',
            border: `1px solid ${isDone ? 'rgba(134,223,186,0.4)' : running ? 'rgba(124,158,255,0.5)' : 'rgba(124,158,255,0.25)'}`,
            backdropFilter: 'blur(12px)',
            color: isDone ? '#86dfba' : running ? '#7c9eff' : '#9ba7b8',
            minHeight: '44px',
            boxShadow: running ? '0 0 12px rgba(124,158,255,0.25)' : 'none',
          }}
          aria-label={`Focus timer: ${pillLabel}`}>
          <Timer className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">{pillLabel}</span>
        </motion.button>

        <AnimatePresence>
          {showTimer && (
            <motion.div
              initial={{ opacity: 0, y: 10,  scale: 0.95 }}
              animate={{ opacity: 1, y: 0,   scale: 1    }}
              exit={{   opacity: 0, y: 10,   scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-14 left-0 hidden sm:block w-64 rounded-3xl overflow-hidden shadow-2xl timer-float">
              <TimerContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showTimer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTimer(false)}
              className="fixed inset-0 z-[7990] sm:hidden"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              aria-hidden="true" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-[7999] sm:hidden rounded-t-3xl overflow-hidden"
              style={{
                background: '#1a2028',
                border: '1px solid rgba(124,158,255,0.3)',
                borderBottom: 'none',
                boxShadow: '0 -20px 60px rgba(124,158,255,0.15)',
              }}
              role="dialog" aria-label="Focus timer">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: '#2f3844' }} />
              </div>
              <TimerContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================
// SECTION 22 — SVG RENDERERS  (BUG 12 FIX)
// escapeSVGText applied to all AI text inserted into SVG nodes
// ============================================================

function escapeSVGText(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFlowchartSVG(raw) {
  const steps = String(raw || '').split('>').map(s => s.trim()).filter(Boolean).map(s => {
    const typeMatch = s.match(/\((.*?)\)$/);
    const type  = typeMatch ? typeMatch[1].toLowerCase() : 'process';
    const label = s.replace(/\(.*?\)$/, '').trim();
    return { label, type };
  });

  const SVG_W  = 300;
  const cx     = SVG_W / 2;
  const BOX_W  = 160, BOX_H  = 40;
  const DEC_W  = 80,  DEC_H  = 50;
  const IO_W   = 160, IO_H   = 40, IO_SKEW = 12;
  const ARROW_GAP = 40;

  const colors = {
    start:    { fill: 'rgba(134,223,186,0.18)', stroke: '#86dfba', text: '#86dfba' },
    end:      { fill: 'rgba(232,165,152,0.18)', stroke: '#e8a598', text: '#e8a598' },
    process:  { fill: 'rgba(124,158,255,0.18)', stroke: '#7c9eff', text: '#7c9eff' },
    decision: { fill: 'rgba(240,201,135,0.18)', stroke: '#f0c987', text: '#f0c987' },
    io:       { fill: 'rgba(167,139,250,0.18)', stroke: '#a78bfa', text: '#c4b5fd' },
  };

  const elems = [];
  let y = 20;

  steps.forEach((step, i) => {
    const c         = colors[step.type] || colors.process;
    const rawLabel  = step.label.length > 20 ? step.label.slice(0, 20) + '…' : step.label;
    const safeLabel = escapeSVGText(rawLabel); // BUG 12 FIX

    if (i > 0) {
      elems.push(
        <g key={`arrow-${i}`}>
          <line x1={cx} y1={y} x2={cx} y2={y + ARROW_GAP - 6}
            stroke="rgba(124,158,255,0.6)" strokeWidth="1.5" />
          <polygon
            points={`${cx-4},${y+ARROW_GAP-10} ${cx},${y+ARROW_GAP-3} ${cx+4},${y+ARROW_GAP-10}`}
            fill="rgba(124,158,255,0.7)" />
        </g>
      );
      y += ARROW_GAP;
    }

    if (step.type === 'start' || step.type === 'end') {
      elems.push(
        <g key={`step-${i}`}>
          <rect x={cx-BOX_W/2} y={y} width={BOX_W} height={BOX_H} rx={BOX_H/2} ry={BOX_H/2}
            fill={c.fill} stroke={c.stroke} strokeWidth="1.8" />
          <text x={cx} y={y+BOX_H/2} textAnchor="middle" dominantBaseline="middle"
            fill={c.text} fontSize="12" fontWeight="800" fontFamily="system-ui">{safeLabel}</text>
        </g>
      );
      y += BOX_H;
    } else if (step.type === 'decision') {
      const dMidY = y + DEC_H;
      const dBot  = y + DEC_H * 2;
      elems.push(
        <g key={`step-${i}`}>
          <polygon
            points={`${cx},${y} ${cx+DEC_W},${dMidY} ${cx},${dBot} ${cx-DEC_W},${dMidY}`}
            fill={c.fill} stroke={c.stroke} strokeWidth="1.8" strokeLinejoin="round" />
          <text x={cx} y={dMidY} textAnchor="middle" dominantBaseline="middle"
            fill={c.text} fontSize="11" fontWeight="800" fontFamily="system-ui">{safeLabel}</text>
          <text x={cx+DEC_W+6} y={dMidY} fill="#86dfba" fontSize="9" fontWeight="700">Y</text>
          <text x={cx+6} y={dBot+12}      fill="#e8a598" fontSize="9" fontWeight="700">N</text>
        </g>
      );
      y += DEC_H * 2;
    } else if (step.type === 'io') {
      const x1  = cx - IO_W/2;
      const x2  = cx + IO_W/2;
      const pts = `${x1+IO_SKEW},${y} ${x2+IO_SKEW},${y} ${x2-IO_SKEW},${y+IO_H} ${x1-IO_SKEW},${y+IO_H}`;
      elems.push(
        <g key={`step-${i}`}>
          <polygon points={pts} fill={c.fill} stroke={c.stroke} strokeWidth="1.8" strokeLinejoin="round" />
          <text x={cx} y={y+IO_H/2} textAnchor="middle" dominantBaseline="middle"
            fill={c.text} fontSize="11" fontWeight="700" fontFamily="system-ui">{safeLabel}</text>
        </g>
      );
      y += IO_H;
    } else {
      elems.push(
        <g key={`step-${i}`}>
          <rect x={cx-BOX_W/2} y={y} width={BOX_W} height={BOX_H} rx="6" ry="6"
            fill={c.fill} stroke={c.stroke} strokeWidth="1.8" />
          <text x={cx} y={y+BOX_H/2} textAnchor="middle" dominantBaseline="middle"
            fill={c.text} fontSize="11" fontWeight="700" fontFamily="system-ui">{safeLabel}</text>
        </g>
      );
      y += BOX_H;
    }
  });

  return (
    <div className="my-3 flex justify-center">
      <div className="rounded-2xl p-4"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(124,158,255,0.2)' }}>
        <p className="text-[10px] font-black uppercase tracking-widest text-center mb-3"
          style={{ color: '#7c9eff' }}>FLOWCHART</p>
        <svg width={SVG_W} height={y+20} viewBox={`0 0 ${SVG_W} ${y+20}`}
          xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%' }}
          role="img" aria-label="Flowchart diagram">
          {elems}
        </svg>
      </div>
    </div>
  );
}

function renderBlockDiagramSVG(raw) {
  const labels = String(raw || '').split('>').map(s => s.trim()).filter(Boolean);
  const BOX_W  = 90, BOX_H = 36, GAP = 28, startX = 10, y = 40;
  const SVG_W  = labels.length * (BOX_W + GAP) + 20;

  return (
    <div className="my-3 flex justify-center overflow-x-auto">
      <div className="rounded-2xl p-3"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(124,158,255,0.2)' }}>
        <p className="text-[10px] font-black uppercase tracking-widest text-center mb-2"
          style={{ color: '#7c9eff' }}>BLOCK DIAGRAM</p>
        <svg width={Math.max(SVG_W, 280)} height={BOX_H + 80}
          xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '100%' }}
          role="img" aria-label="Block diagram">
          {labels.map((label, i) => {
            const x    = startX + i * (BOX_W + GAP);
            const bx   = x + BOX_W / 2;
            const by   = y + BOX_H / 2;
            const raw2 = label.length > 11 ? label.slice(0, 11) + '…' : label;
            const safe = escapeSVGText(raw2); // BUG 12 FIX
            return (
              <g key={i}>
                {i > 0 && (
                  <g>
                    <line x1={x-GAP+4} y1={by} x2={x-6} y2={by}
                      stroke="rgba(124,158,255,0.5)" strokeWidth="1.5" />
                    <polygon points={`${x-10},${by-3} ${x-3},${by} ${x-10},${by+3}`}
                      fill="rgba(124,158,255,0.7)" />
                  </g>
                )}
                <rect x={x} y={y} width={BOX_W} height={BOX_H} rx="6"
                  fill="rgba(124,158,255,0.12)" stroke="rgba(124,158,255,0.4)" strokeWidth="1.5" />
                <text x={bx} y={by} textAnchor="middle" dominantBaseline="middle"
                  fill="#a78bfa" fontSize="10" fontWeight="700" fontFamily="system-ui">{safe}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function renderDrawingSVG(raw) {
  const parts    = String(raw || '').split('|').map(s => s.trim());
  const type     = (parts[0] || 'orthographic').toLowerCase();
  const dims     = parts[1] || '60,40,30';
  const desc     = parts[2] || '';
  const marksRaw = parts[3] || '';
  const dimVals  = dims.split(',').map(d => parseInt(d) || 40);
  const W = dimVals[0] || 60, H = dimVals[1] || 40, D = dimVals[2] || 30;

  const marksBreakdown = [];
  if (marksRaw) {
    marksRaw.split(',').forEach(m => {
      const kv = m.trim().split(':');
      if (kv.length === 2) marksBreakdown.push({ label: escapeSVGText(kv[0].trim()), marks: escapeSVGText(kv[1].trim()) });
    });
  }

  const STROKE = '#a78bfa', STROKE_DIM = '#7c9eff', FILL = 'rgba(124,158,255,0.07)';
  const TEXT_COLOR = '#e6ebf2', DIM_COLOR = '#a5b4fc';

  let svgContent = null, svgW = 500, svgH = 320;

  if (type === 'orthographic' || type === 'multiview') {
    const scale = Math.min(120 / Math.max(W, H, D), 3);
    const sw = Math.round(W * scale), sh = Math.round(H * scale), sd = Math.round(D * scale);
    const gap = 40, mL = 60, mT = 60;
    const fvX = mL, fvY = mT, svX = fvX + sw + gap, svY = mT, tvX = mL, tvY = fvY + sh + gap;
    svgW = svX + sd + 80; svgH = tvY + sd + 80;
    svgContent = (
      <>
        <rect x={fvX} y={fvY} width={sw} height={sh} fill={FILL} stroke={STROKE} strokeWidth="1.5" />
        <text x={fvX+sw/2} y={fvY-10} textAnchor="middle" fill={TEXT_COLOR} fontSize="12" fontWeight="700">FRONT VIEW</text>
        <line x1={fvX} y1={fvY+sh+18} x2={fvX+sw} y2={fvY+sh+18} stroke={STROKE_DIM} strokeWidth="1" />
        <text x={fvX+sw/2} y={fvY+sh+30} textAnchor="middle" fill={DIM_COLOR} fontSize="10" fontWeight="700">{W}</text>
        <line x1={fvX-18} y1={fvY} x2={fvX-18} y2={fvY+sh} stroke={STROKE_DIM} strokeWidth="1" />
        <text x={fvX-30} y={fvY+sh/2} textAnchor="middle" fill={DIM_COLOR} fontSize="10" fontWeight="700">{H}</text>
        <rect x={svX} y={svY} width={sd} height={sh} fill={FILL} stroke={STROKE} strokeWidth="1.5" />
        <text x={svX+sd/2} y={svY-10} textAnchor="middle" fill={TEXT_COLOR} fontSize="12" fontWeight="700">SIDE VIEW</text>
        <line x1={svX} y1={svY+sh+18} x2={svX+sd} y2={svY+sh+18} stroke={STROKE_DIM} strokeWidth="1" />
        <text x={svX+sd/2} y={svY+sh+30} textAnchor="middle" fill={DIM_COLOR} fontSize="10" fontWeight="700">{D}</text>
        <rect x={tvX} y={tvY} width={sw} height={sd} fill={FILL} stroke={STROKE} strokeWidth="1.5" />
        <text x={tvX+sw/2} y={tvY-10} textAnchor="middle" fill={TEXT_COLOR} fontSize="12" fontWeight="700">TOP VIEW</text>
        <line x1={tvX+sw+18} y1={tvY} x2={tvX+sw+18} y2={tvY+sd} stroke={STROKE_DIM} strokeWidth="1" />
        <text x={tvX+sw+34} y={tvY+sd/2} textAnchor="middle" fill={DIM_COLOR} fontSize="10" fontWeight="700">{D}</text>
        <line x1={fvX+sw} y1={fvY}    x2={svX}    y2={svY}    stroke="rgba(124,158,255,0.2)" strokeWidth="0.8" strokeDasharray="4,3" />
        <line x1={fvX+sw} y1={fvY+sh} x2={svX}    y2={svY+sh} stroke="rgba(124,158,255,0.2)" strokeWidth="0.8" strokeDasharray="4,3" />
        <line x1={fvX}    y1={fvY+sh} x2={tvX}    y2={tvY}    stroke="rgba(124,158,255,0.2)" strokeWidth="0.8" strokeDasharray="4,3" />
        <line x1={fvX+sw} y1={fvY+sh} x2={tvX+sw} y2={tvY}    stroke="rgba(124,158,255,0.2)" strokeWidth="0.8" strokeDasharray="4,3" />
      </>
    );
  } else if (type === 'isometric') {
    svgW = 320; svgH = 280;
    const isoC = 160, isoY = 80;
    const iW = Math.min(W*1.8,110), iH = Math.min(H*1.5,90), iD = Math.min(D*1.8,110);
    const topP  = [[isoC,isoY],[isoC+iW,isoY+iW*0.5],[isoC+iW-iD,isoY+(iW+iD)*0.5],[isoC-iD,isoY+iD*0.5]].map(p=>p.join(',')).join(' ');
    const leftP = [[isoC-iD,isoY+iD*0.5],[isoC,isoY],[isoC,isoY+iH],[isoC-iD,isoY+iD*0.5+iH]].map(p=>p.join(',')).join(' ');
    const rightP= [[isoC,isoY],[isoC+iW,isoY+iW*0.5],[isoC+iW,isoY+iW*0.5+iH],[isoC,isoY+iH]].map(p=>p.join(',')).join(' ');
    svgContent = (
      <>
        <polygon points={topP}   fill="rgba(124,158,255,0.12)" stroke={STROKE} strokeWidth="1.5" />
        <polygon points={leftP}  fill="rgba(124,158,255,0.07)" stroke={STROKE} strokeWidth="1.5" />
        <polygon points={rightP} fill="rgba(167,139,250,0.09)" stroke={STROKE} strokeWidth="1.5" />
        <text x={isoC+iW/2+8}  y={isoY+iW*0.25-8}       fill={DIM_COLOR} fontSize="11" fontWeight="700">{W}</text>
        <text x={isoC-iD/2-20} y={isoY+iD*0.25+4}       fill={DIM_COLOR} fontSize="11" fontWeight="700">{D}</text>
        <text x={isoC+iW+6}    y={isoY+iW*0.5+iH/2}     fill={DIM_COLOR} fontSize="11" fontWeight="700">{H}</text>
        <text x={svgW/2} y={svgH-16} textAnchor="middle" fill={TEXT_COLOR} fontSize="12" fontWeight="700">ISOMETRIC VIEW</text>
      </>
    );
  } else {
    svgW = 300; svgH = 220;
    svgContent = (
      <>
        <rect x={60} y={50} width={180} height={120} fill={FILL} stroke={STROKE} strokeWidth="1.5" rx="4" />
        <line x1={60} y1={50} x2={240} y2={170} stroke={STROKE} strokeWidth="1" strokeDasharray="4,3" />
        <line x1={240} y1={50} x2={60} y2={170} stroke={STROKE} strokeWidth="1" strokeDasharray="4,3" />
        <text x={150} y={200} textAnchor="middle" fill={TEXT_COLOR} fontSize="12" fontWeight="700">FIGURE</text>
        <line x1={60} y1={185} x2={240} y2={185} stroke={STROKE_DIM} strokeWidth="1" />
        <text x={150} y={198} textAnchor="middle" fill={DIM_COLOR} fontSize="10" fontWeight="700">{W}</text>
      </>
    );
  }

  return (
    <div className="my-4">
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(124,158,255,0.25)' }}>
        <div className="px-4 py-2.5 flex items-center justify-between"
          style={{ background: 'rgba(124,158,255,0.1)', borderBottom: '1px solid rgba(124,158,255,0.2)' }}>
          <div className="flex items-center space-x-2">
            <span style={{ color: '#7c9eff' }} aria-hidden="true">📐</span>
            <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#a78bfa' }}>
              Engineering Drawing
            </span>
          </div>
          {desc && <span className="text-[10px] font-medium truncate max-w-[160px]" style={{ color: '#6b7787' }}>{desc}</span>}
        </div>
        <div className="flex justify-center p-4 overflow-x-auto">
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}
            style={{ maxWidth: '100%' }} xmlns="http://www.w3.org/2000/svg"
            role="img" aria-label={`Engineering drawing: ${desc || type}`}>
            {svgContent}
          </svg>
        </div>
        {marksBreakdown.length > 0 && (
          <div className="px-4 pb-4">
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(124,158,255,0.2)' }}>
              <div className="px-3 py-1.5"
                style={{ background: 'rgba(124,158,255,0.08)', borderBottom: '1px solid rgba(124,158,255,0.15)' }}>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#7c9eff' }}>
                  Mark Scheme
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(124,158,255,0.1)' }}>
                {marksBreakdown.map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2">
                    <span className="text-[12px] font-medium" style={{ color: '#e6ebf2' }}>{m.label}</span>
                    <span className="text-[12px] font-black" style={{ color: '#a78bfa' }}>{m.marks}m</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ============================================================
// SECTION 23 — INLINE FORMATTER (BUG 6 FIX — XSS-safe)
// HTML entities escaped in code blocks before rendering
// ============================================================

function escapeHTML(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInline(text) {
  const raw = String(text || '')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/`(.+?)`/g, (_, code) => `<code>${escapeHTML(code)}</code>`);
  return sanitizeHTML(raw);
}

function contentToMarkdown(content) {
  return String(content || '')
    .replace(/\[FLOWCHART:.*?\]/gs,    '[Flowchart diagram]')
    .replace(/\[BLOCKDIAGRAM:.*?\]/gs, '[Block diagram]')
    .replace(/\[DRAWING:.*?\]/gs,      '[Engineering drawing]');
}

// ============================================================
// SECTION 24 — AI RESULT RENDERER (BUG 6 FIX)
// Code block content HTML-entity-escaped before dangerouslySetInnerHTML
// ============================================================

function AIResultRenderer({ content, questionData = null, onBookmark = null, isBookmarked = false }) {
  const { copied, copy } = useCopyToClipboard();
  const [showActions, setShowActions] = useState(false);
  const isTouchDevice = useRef(
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );

  if (!content) return null;

  const handleCopy = () => copy(contentToMarkdown(content));

  const lines    = String(content).split('\n');
  const rendered = [];
  let key         = 0;
  let inCodeBlock = false;
  let codeLines   = [];
  let codeLang    = '';

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const t    = line.trim();

    if (t.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang    = t.slice(3).trim();
        codeLines   = [];
      } else {
        inCodeBlock = false;
        // BUG 6 FIX: entity-escape ALL code lines
        const escapedCode = codeLines.map(escapeHTML).join('\n');
        rendered.push(
          <div key={key++} className="my-3 rounded-xl overflow-hidden"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(124,158,255,0.2)' }}>
            <div className="flex items-center justify-between px-3 py-1.5"
              style={{ background: 'rgba(124,158,255,0.08)', borderBottom: '1px solid rgba(124,158,255,0.15)' }}>
              <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#7c9eff' }}>
                {codeLang || 'CODE'}
              </span>
              <span className="text-[10px]" style={{ color: '#6b7787' }}>{codeLines.length} lines</span>
            </div>
            <pre className="p-3 text-[12px] font-mono overflow-x-auto leading-relaxed"
              style={{ color: '#86dfba' }}
              dangerouslySetInnerHTML={{ __html: escapedCode }} />
          </div>
        );
        codeLines = [];
        codeLang  = '';
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(line); continue; }

    if (!t) { rendered.push(<div key={key++} className="h-2" />); continue; }

    if (t.startsWith('[FLOWCHART:') && t.endsWith(']')) {
      rendered.push(<React.Fragment key={key++}>{renderFlowchartSVG(t.slice(11, -1).trim())}</React.Fragment>);
      continue;
    }
    if (t.startsWith('[BLOCKDIAGRAM:') && t.endsWith(']')) {
      rendered.push(<React.Fragment key={key++}>{renderBlockDiagramSVG(t.slice(14, -1).trim())}</React.Fragment>);
      continue;
    }
    if (t.startsWith('[DRAWING:') && t.endsWith(']')) {
      rendered.push(<React.Fragment key={key++}>{renderDrawingSVG(t.slice(9, -1).trim())}</React.Fragment>);
      continue;
    }

    if (t.startsWith('# ')) {
      rendered.push(
        <h2 key={key++} className="text-xl font-black mt-4 mb-2"
          style={{ background: 'linear-gradient(135deg,#7c9eff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t.slice(2)}
        </h2>
      );
      continue;
    }
    if (t.startsWith('## ')) {
      rendered.push(
        <div key={key++} className="flex items-center space-x-2 mt-4 mb-1.5">
          <div className="w-1 h-1 rounded-full" style={{ background: '#7c9eff' }} />
          <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: '#7c9eff' }}>{t.slice(3)}</h3>
        </div>
      );
      continue;
    }
    if (t.startsWith('### ')) {
      rendered.push(<h4 key={key++} className="text-sm font-bold mt-3 mb-1" style={{ color: '#c4b5fd' }}>{t.slice(4)}</h4>);
      continue;
    }

    if (t.startsWith('- ') || t.startsWith('* ')) {
      rendered.push(
        <div key={key++} className="flex items-start space-x-2 py-0.5">
          <div className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'rgba(124,158,255,0.7)' }} />
          <p className="text-sm leading-relaxed" style={{ color: '#e6ebf2' }}
            dangerouslySetInnerHTML={{ __html: formatInline(t.slice(2)) }} />
        </div>
      );
      continue;
    }

    if (/^\d+\.\s/.test(t)) {
      const num  = t.match(/^(\d+)\./)?.[1] ?? '';
      const text = t.replace(/^\d+\.\s/, '');
      rendered.push(
        <div key={key++} className="flex items-start space-x-2 py-0.5">
          <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center"
            style={{ background: 'rgba(124,158,255,0.15)', border: '1px solid rgba(124,158,255,0.3)', color: '#7c9eff' }}>
            {num}
          </span>
          <p className="text-sm leading-relaxed" style={{ color: '#e6ebf2' }}
            dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
        </div>
      );
      continue;
    }

    if (t === '---') {
      rendered.push(<div key={key++} className="h-px my-3"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(124,158,255,0.2),transparent)' }} />);
      continue;
    }

    if (t.startsWith('|') && t.endsWith('|')) {
      const cells = t.slice(1, -1).split('|').map(c => c.trim());
      if (cells.every(c => /^[-: ]+$/.test(c))) continue;
      rendered.push(
        <div key={key++} className="flex gap-2 py-1 text-sm border-b" style={{ borderColor: 'rgba(124,158,255,0.1)' }}>
          {cells.map((cell, ci) => (
            <div key={ci} className="flex-1 min-w-0" style={{ color: '#e6ebf2' }}
              dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
          ))}
        </div>
      );
      continue;
    }

    rendered.push(
      <p key={key++} className="text-sm leading-relaxed py-0.5" style={{ color: '#e6ebf2' }}
        dangerouslySetInnerHTML={{ __html: formatInline(t) }} />
    );
  }

  const actionsVisible = showActions || copied || isTouchDevice.current;

  return (
    <div className="relative"
      onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div className="space-y-0.5">{rendered}</div>
      <AnimatePresence>
        {actionsVisible && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 pt-3 flex items-center gap-2 flex-wrap no-print"
            style={{ borderTop: '1px dashed rgba(124,158,255,0.15)' }}>
            <button type="button" onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
              style={{
                background: copied ? 'rgba(134,223,186,0.15)' : 'rgba(124,158,255,0.08)',
                border: `1px solid ${copied ? 'rgba(134,223,186,0.3)' : 'rgba(124,158,255,0.2)'}`,
                color: copied ? '#86dfba' : '#7c9eff',
              }}
              aria-label="Copy answer as notes">
              {copied ? <><Check className="w-3 h-3" /><span>Copied!</span></> : <><Copy className="w-3 h-3" /><span>Copy as Notes</span></>}
            </button>
            {onBookmark && questionData && (
              <button type="button" onClick={() => onBookmark(questionData)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                style={{
                  background: isBookmarked ? 'rgba(240,201,135,0.15)' : 'rgba(124,158,255,0.08)',
                  border: `1px solid ${isBookmarked ? 'rgba(240,201,135,0.3)' : 'rgba(124,158,255,0.2)'}`,
                  color: isBookmarked ? '#f0c987' : '#7c9eff',
                }}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}>
                <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// SECTION 25 — ANSWER LOADING INLINE
// ============================================================

function AnswerLoadingInline() {
  const [phase,    setPhase]    = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progRef  = useRef(0);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      progRef.current = Math.min(progRef.current + 1.4, 92);
      setProgress(Math.round(progRef.current));
      setPhase(Math.min(Math.floor((progRef.current / 100) * (ANSWER_LOADING_PHASES.length - 1)), ANSWER_LOADING_PHASES.length - 1));
    }, 180);
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, []);

  const current = ANSWER_LOADING_PHASES[phase];

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3">
      <div className="rounded-2xl p-4"
        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(124,158,255,0.2)' }}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative w-10 h-10 flex-shrink-0">
            <motion.div className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: 'transparent', borderTopColor: '#7c9eff', borderRightColor: 'rgba(124,158,255,0.2)' }}
              animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-4 h-4" style={{ color: '#7c9eff' }} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black mb-0.5" style={{ color: '#e6ebf2' }}>Preparing your answer</p>
            <motion.p key={phase} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
              className="text-[11px] font-medium leading-relaxed truncate" style={{ color: '#7c9eff' }}>
              {current.icon} {current.label}
            </motion.p>
          </div>
          <span className="text-[11px] font-black flex-shrink-0" style={{ color: '#a78bfa' }}
            aria-live="polite" aria-atomic="true">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,158,255,0.1)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#7c9eff,#a78bfa,#c4b5fd)' }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION 26 — CHATBOT  (BUG 8 FIX)
// lastContextQuestionRef prevents duplicate AI requests
// ============================================================

function Chatbot({ isOpen, onClose, subject, scheme, callAI, initialContext }) {
  const [messages,  setMessages]  = useState(() => conversationManager.getMessages());
  const [input,     setInput]     = useState('');
  const [isTyping,  setIsTyping]  = useState(false);

  const messagesEndRef         = useRef(null);
  const inputRef               = useRef(null);
  const abortRef               = useRef(false);
  const hasInitRef             = useRef(false);
  const lastContextQuestionRef = useRef(null); // BUG 8 FIX

  const isCoding  = useMemo(() => isCodingSubject(subject  || ''), [subject]);
  const isDrawing = useMemo(() => isDrawingSubject(subject || ''), [subject]);

  useEffect(() => {
    const unsub = conversationManager.subscribe(msgs => setMessages([...msgs]));
    return unsub;
  }, []);

  useEffect(() => {
    if (isOpen && subject) conversationManager.setContext(subject, scheme);
  }, [isOpen, subject, scheme]);

  const buildPrompt = useCallback((userMsg) => {
    const ragCtx  = buildRAGContext(subject, scheme);
    const history = conversationManager.getRecentHistory(6);
    const recentHistory = history.map(m => `${m.role === 'user' ? 'STUDENT' : 'TUTOR'}: ${m.content}`).join('\n\n');
    const marks   = userMsg.match(/(\d+)\s*mark/i)?.[1];
    const isCodeQ = isCoding || /code|program|write|implement|algorithm/i.test(userMsg);

    return `${ragCtx}

YOU ARE: A KTU exam tutor for "${subject}" (${scheme} scheme).

RESPONSE RULES:
${isDrawing
      ? `- Drawing subject. Explain construction steps clearly. Max 6 bullet points.`
      : isCodeQ
        ? `- Coding question. Give ONLY complete working code with brief intro and 2-3 bullet points.`
        : marks
          ? `- Worth ${marks} marks. Write answer worth exactly ${marks} marks.`
          : `- SHORT, CLEAR answer. Max 5-6 lines. Bullet points. Exam-focused.`}

CONVERSATION HISTORY:
${recentHistory}

STUDENT: ${sanitizeUserInput(userMsg)}
TUTOR:`;
  }, [subject, scheme, isCoding, isDrawing]);

  const sendToAI = useCallback(async (content) => {
    if (!callAI) return;
    abortRef.current = false;
    setIsTyping(true);
    try {
      const response = await callAI(buildPrompt(content));
      if (abortRef.current) return;
      conversationManager.addMessage('assistant', response);
    } catch (err) {
      if (abortRef.current) return;
      conversationManager.addMessage('assistant', `⚠ ${err.message || 'Something went wrong. Please try again.'}`);
    } finally {
      if (!abortRef.current) setIsTyping(false);
    }
  }, [callAI, buildPrompt]);

  // Initial greeting
  useEffect(() => {
    if (!isOpen) return;
    if (hasInitRef.current) return;
    if (conversationManager.getMessages().length > 0) { hasInitRef.current = true; return; }
    hasInitRef.current = true;
    conversationManager.addMessage('assistant',
      `Hi! I'm your **${subject?.split('-')[0]?.trim() || 'subject'}** tutor.\n\n` +
      `${isDrawing ? "Ask me about any drawing concept — I'll explain construction steps clearly."
        : isCoding ? "Ask me any coding question — I'll give you clean KTU-style code."
          : "Ask me anything about this subject — I'll keep it short and clear."}\n\nWhat's your doubt? 🎓`
    );
  }, [isOpen, subject, isCoding, isDrawing]);

  // BUG 8 FIX: track last sent question to prevent duplicate requests
  useEffect(() => {
    if (
      !isOpen ||
      !initialContext?.question ||
      initialContext.question === lastContextQuestionRef.current ||
      isTyping
    ) return;
    if (conversationManager.getMessages().length === 0) return;

    lastContextQuestionRef.current = initialContext.question; // set BEFORE sending
    const content = `Explain this question: **${initialContext.question}**`;
    conversationManager.addMessage('user', content);
    sendToAI(content);
  }, [isOpen, initialContext, isTyping, sendToAI]);

  useEffect(() => {
    if (isOpen) return;
    abortRef.current = true;
    hasInitRef.current = false;
    lastContextQuestionRef.current = null;
    setInput('');
    setIsTyping(false);
  }, [isOpen]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (isOpen) { const t = setTimeout(() => inputRef.current?.focus(), 300); return () => clearTimeout(t); }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const content = sanitizeUserInput(input.trim());
    if (!content || isTyping) return;
    conversationManager.addMessage('user', content);
    setInput('');
    await sendToAI(content);
  }, [input, isTyping, sendToAI]);

  const handleClearChat = useCallback(() => {
    conversationManager.clear();
    hasInitRef.current = false;
    lastContextQuestionRef.current = null;
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  if (!isOpen) return null;

  const chatUI = (
    <>
      <div className="flex items-center justify-between px-4 md:px-5 py-3.5 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,rgba(124,158,255,0.15),rgba(167,139,250,0.1))', borderBottom: '1px solid rgba(124,158,255,0.2)' }}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl" style={{ background: 'rgba(124,158,255,0.2)' }}>
            <Bot className="w-4 h-4" style={{ color: '#7c9eff' }} />
          </div>
          <div>
            <p className="text-sm font-black" style={{ color: '#e6ebf2' }}>AI Tutor</p>
            <p className="text-[11px] font-medium" style={{ color: '#7c9eff' }}>
              {subject?.split('-')[0]?.trim() || 'Subject'} · {isDrawing ? 'Drawing mode' : isCoding ? 'Code mode' : 'Concept mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center space-x-1 px-2 py-1 rounded-full"
            style={{ background: 'rgba(134,223,186,0.1)', border: '1px solid rgba(134,223,186,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#86dfba' }} />
            <span className="text-[10px] font-bold" style={{ color: '#86dfba' }}>LIVE</span>
          </motion.div>
          <button type="button" onClick={handleClearChat}
            className="p-2 rounded-xl min-h-[36px] min-w-[36px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#9ba7b8' }}
            aria-label="Clear conversation" title="Clear conversation">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={onClose}
            className="p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#9ba7b8' }} aria-label="Close chatbot">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 chat-messages">
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                style={{ background: 'rgba(124,158,255,0.2)', border: '1px solid rgba(124,158,255,0.3)' }}>
                <Bot className="w-3.5 h-3.5" style={{ color: '#7c9eff' }} />
              </div>
            )}
            <div className="rounded-2xl px-4 py-3"
              style={{
                maxWidth: '85%', wordBreak: 'break-word', overflowWrap: 'break-word',
                ...(msg.role === 'user'
                  ? { background: 'linear-gradient(135deg,#7c9eff,#a78bfa)', borderTopRightRadius: 4 }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderTopLeftRadius: 4 }),
              }}>
              {msg.role === 'assistant'
                ? <div className="text-sm"><AIResultRenderer content={msg.content} /></div>
                : <p className="text-sm font-medium" style={{ color: '#ffffff' }}>{msg.content}</p>}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ml-2 mt-0.5"
                style={{ background: 'rgba(124,158,255,0.15)', border: '1px solid rgba(124,158,255,0.2)' }}>
                <User className="w-3.5 h-3.5" style={{ color: '#c4b5fd' }} />
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mr-2"
              style={{ background: 'rgba(124,158,255,0.2)' }}>
              <Bot className="w-3.5 h-3.5" style={{ color: '#7c9eff' }} />
            </div>
            <div className="px-4 py-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              aria-label="AI is typing">
              <div className="flex space-x-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: '#7c9eff' }}
                    animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-end space-x-2">
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={isDrawing ? 'Ask about any drawing...' : isCoding ? 'Ask for code or algorithm...' : 'Ask your doubt...'}
            rows={2} maxLength={2000}
            className="flex-1 atlas-input rounded-2xl px-3 py-2.5 text-sm font-medium resize-none"
            style={{ minHeight: '44px', maxHeight: '100px', color: '#e6ebf2' }} aria-label="Chat input" />
          <motion.button type="button" onClick={handleSend} disabled={!input.trim() || isTyping}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-2xl flex-shrink-0 disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7c9eff,#a78bfa)' }} aria-label="Send message">
            <Send className="w-4 h-4" style={{ color: '#ffffff' }} />
          </motion.button>
        </div>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="chatbot-mobile"
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed inset-0 z-[9999] flex flex-col sm:hidden"
            style={{ background: '#0f1419' }} role="dialog" aria-label="AI Tutor chat">
            {chatUI}
          </motion.div>
          <motion.div key="chatbot-desktop"
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 z-[9999] hidden sm:flex flex-col rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: '#1a2028', border: '1px solid rgba(124,158,255,0.3)', width: 'min(420px, calc(100vw - 32px))', height: '580px' }}
            role="dialog" aria-label="AI Tutor chat">
            {chatUI}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// SECTION 27 — QUESTION CARD  (BUG 9 FIX)
// answerRef used instead of answer state to avoid stale closures
// ============================================================

function QuestionCard({ question, isStudied, onToggle, onAskChatbot, subject, scheme, callAI, isBookmarked, onBookmark }) {
  const [expanded, setExpanded] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // BUG 9 FIX: answer stored in ref, answerKey forces re-render
  const answerRef = useRef('');
  const [answerKey, setAnswerKey] = useState(0);
  const abortRef = useRef(false);

  const isCoding  = useMemo(() => isCodingSubject(subject),  [subject]);
  const isDrawing = useMemo(() => isDrawingSubject(subject), [subject]);
  const isDrawQ   = useMemo(() => isDrawing && isDrawingQuestion(question.text), [isDrawing, question.text]);

  useEffect(() => () => { abortRef.current = true; }, []);

  // BUG 9 FIX: no answer in deps — reads from ref
  const fetchAnswer = useCallback(async () => {
    if (expanded && answerRef.current) { setExpanded(false); return; }
    if (!expanded && answerRef.current) { setExpanded(true); return; }
    if (!callAI) { setError('AI not connected. Please check your API key.'); return; }

    setLoading(true);
    setError('');
    abortRef.current = false;

    const ragContext = buildRAGContext(subject, scheme);
    let prompt;

    if (isDrawQ) {
      prompt = `${ragContext}

YOU ARE: A KTU Engineering Graphics answer generator for "${subject}" (${scheme} scheme).
QUESTION: ${sanitizeUserInput(question.text)}
MARKS: ${question.marks} marks

OUTPUT ONLY a single [DRAWING:] marker line. Nothing else. No explanation. No steps.

Analyze the question and output EXACTLY this format on ONE line:
[DRAWING: type | W,H,D | description | ViewName1:marks,ViewName2:marks]

Type options: orthographic, isometric, section, auxiliary
Choose dimensions matching this specific question realistically.
Marks breakdown must add up to ${question.marks}.

Example outputs:
[DRAWING: orthographic | 80,60,40 | Rectangular block | Front View:5,Top View:5,Side View:5]
[DRAWING: isometric | 60,50,40 | L-shaped object | Isometric View:12,Dimensions:3]

Output the [DRAWING:] line now:`;
    } else {
      const isCodeQ        = isCoding || /code|program|write|implement|algorithm/i.test(question.text);
      const needsFlowchart = /flowchart|flow chart|flow diagram|algorithm.*diagram|draw.*algorithm/i.test(question.text);
      const needsBlockDiag = /block diagram|architecture diagram|system diagram/i.test(question.text);
      const needsDiagram   = /draw|diagram|sketch|illustrate|represent/i.test(question.text) && !needsFlowchart && !needsBlockDiag;

      let diagramInstruction = '';
      if (needsFlowchart) {
        diagramInstruction = `\nFLOWCHART IS MANDATORY. Include on its OWN line:\n[FLOWCHART: Start(start) > ReadInput(io) > ProcessData(process) > IsValid?(decision) > OutputResult(io) > End(end)]\nRules: Start with [FLOWCHART:, end with ]. Steps separated by >. Types: start/end/process/decision/io. 5-8 steps. Names under 18 chars.`;
      } else if (needsBlockDiag) {
        diagramInstruction = `\nBLOCK DIAGRAM IS MANDATORY. Include on its OWN line:\n[BLOCKDIAGRAM: Block1 > Block2 > Block3 > Block4]\nRules: 3-6 blocks, names under 12 chars.`;
      } else if (needsDiagram) {
        diagramInstruction = `\nIf a diagram helps score marks, include ONE of:\n[FLOWCHART: Start(start) > Step1(process) > End(end)]\n[BLOCKDIAGRAM: Block1 > Block2 > Block3]`;
      }

      prompt = `${ragContext}

YOU ARE: A KTU examination answer writer for "${subject}" (${scheme} scheme).
QUESTION: ${sanitizeUserInput(question.text)}
MARKS: ${question.marks} marks
PART: ${question.partType === 'A' ? 'Part A (Short Answer)' : 'Part B (Detailed Answer)'}
MODULE: ${question.module}

${isCodeQ
        ? `CODING RULES:\n- Write COMPLETE working code\n- Use proper code block with language tag\n- Brief comments on key lines\n- After code: 2-3 bullet points for key concepts`
        : question.partType === 'A'
          ? `PART A RULES (${question.marks} marks):\n- Concise direct answer\n- Definition + explanation\n- Bullet points preferred\n- Exactly ${question.marks} marks worth of content`
          : `PART B RULES (${question.marks} marks):\n- Complete detailed answer worth FULL ${question.marks} marks\n- Structure: Definition → Theory → Steps/Derivation → Example → Summary\n- All steps clearly shown\n- End with: "Key points for full marks: ..."`}

${diagramInstruction}

Write the complete KTU model answer now:`;
    }

    try {
      const ans = await callAI(prompt);
      if (abortRef.current) return;
      answerRef.current = ans;
      setAnswerKey(k => k + 1);
      setExpanded(true);
    } catch (err) {
      if (abortRef.current) return;
      setError(err.message || 'Failed to generate answer. Please try again.');
    } finally {
      if (!abortRef.current) setLoading(false);
    }
  }, [expanded, callAI, subject, scheme, question, isDrawQ, isCoding]);

  const handleRetry = useCallback(() => {
    answerRef.current = '';
    setAnswerKey(0);
    setError('');
    setExpanded(false);
    setTimeout(() => fetchAnswer(), 0);
  }, [fetchAnswer]);

  const conf   = freqToConfidence(question.freq || 2);
  const badge  = freqToBadge(question.freq || 2);
  const answer = answerRef.current;

  const bookmarkData = {
    id: question.id, text: question.text, marks: question.marks,
    module: question.module, subject, scheme, freq: question.freq,
  };

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isStudied ? 0.65 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className={`question-card ${isStudied ? 'studied' : ''}`}
      style={isBookmarked ? { borderColor: 'rgba(240,201,135,0.35)', boxShadow: '0 0 0 1px rgba(240,201,135,0.15)' } : undefined}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            {question.module && <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#94a3b8' }}>M{question.module}</span>}
            {isDrawQ && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.12)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.25)' }}>📐 DRAWING</span>}
            {isBookmarked && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(240,201,135,0.12)', color: '#f0c987', border: '1px solid rgba(240,201,135,0.25)' }}><Bookmark className="w-2.5 h-2.5 fill-current" />SAVED</span>}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1"
              style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
              <span>{badge.emoji}</span><span>{conf}%</span>
            </span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(124,158,255,0.12)', color: '#a5b4fc', border: '1px solid rgba(124,158,255,0.25)' }}>
              {question.marks}m
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <button type="button"
            onClick={e => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
            className={`atlas-checkbox mt-0.5 flex-shrink-0 ${isStudied ? 'checked' : ''}`}
            aria-label={isStudied ? 'Mark as not studied' : 'Mark as studied'}>
            <AnimatePresence>
              {isStudied && (
                <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                  <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: '#ffffff' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-relaxed"
              style={{ color: isStudied ? '#64748b' : '#e2e8f0', textDecoration: isStudied ? 'line-through' : 'none' }}>
              {question.text}
            </p>
            {isStudied && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block mt-1 atlas-tag atlas-tag-green">
                ✓ Studied
              </motion.span>
            )}

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <motion.button type="button" onClick={fetchAnswer} disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center space-x-1.5 text-[11px] font-bold px-3 py-2 rounded-xl min-h-[36px]"
                style={{
                  background: expanded ? 'rgba(124,158,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(124,158,255,0.25)', color: '#a5b4fc',
                }}>
                {loading ? <Brain className="w-3 h-3" /> : expanded ? <ChevronUp className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{loading ? 'Preparing...' : expanded ? 'Hide Answer' : isDrawQ ? 'Show KTU Drawing Figure' : 'Show KTU Model Answer'}</span>
              </motion.button>
              <button type="button" onClick={() => onBookmark(bookmarkData)}
                className="p-2 rounded-xl min-h-[36px] min-w-[36px] flex items-center justify-center"
                style={{
                  background: isBookmarked ? 'rgba(240,201,135,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isBookmarked ? 'rgba(240,201,135,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  color: isBookmarked ? '#f0c987' : '#64748b',
                }}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}>
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <AnimatePresence>{loading && <AnswerLoadingInline />}</AnimatePresence>

            <AnimatePresence>
              {expanded && answer && (
                <motion.div key={answerKey}
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-3">
                  <div className="rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(124,158,255,0.2)' }}>
                    <div className="px-4 py-2.5 flex items-center justify-between"
                      style={{ background: 'rgba(124,158,255,0.08)', borderBottom: '1px solid rgba(124,158,255,0.15)' }}>
                      <div className="flex items-center space-x-2">
                        {isDrawQ ? (
                          <><span style={{ color: '#a78bfa' }}>📐</span><span className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#c4b5fd' }}>KTU Drawing Figure</span></>
                        ) : (
                          <><BookOpen className="w-3.5 h-3.5" style={{ color: '#7c9eff' }} /><span className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#a5b4fc' }}>KTU Model Answer</span></>
                        )}
                        {isCoding && !isDrawQ && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(134,223,186,0.1)', color: '#86dfba', border: '1px solid rgba(134,223,186,0.2)' }}>CODE</span>
                        )}
                      </div>
                      <span className="text-[10px]" style={{ color: '#64748b' }}>{question.marks}m · {scheme}</span>
                    </div>
                    <div className="p-4 overflow-x-hidden">
                      <AIResultRenderer content={answer} questionData={bookmarkData} onBookmark={onBookmark} isBookmarked={isBookmarked} />
                    </div>
                    {!isDrawQ && (
                      <div className="px-4 pb-3 no-print">
                        <motion.button type="button"
                          onClick={() => onAskChatbot({ question: question.text, answer })}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold min-h-[44px]"
                          style={{ background: 'linear-gradient(135deg,rgba(124,158,255,0.12),rgba(167,139,250,0.08))', border: '1px solid rgba(124,158,255,0.25)', color: '#a5b4fc' }}>
                          <MessageCircle className="w-3.5 h-3.5" /><span>Still confused? Ask AI Tutor to clarify</span><ArrowRight className="w-3 h-3" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="mt-3 p-3 rounded-xl"
                  style={{ background: 'rgba(232,165,152,0.08)', border: '1px solid rgba(232,165,152,0.25)' }}>
                  <p className="text-[12px] font-medium" style={{ color: '#e8a598' }}>{error}</p>
                  <button type="button" onClick={handleRetry}
                    className="mt-1.5 text-[11px] font-bold underline min-h-[32px]" style={{ color: '#a5b4fc' }}>
                    ↻ Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
// ============================================================
// SECTION 28 — SCORE TRACKER
// ENHANCED: Shows minimum required external prominently when
// internal < 26 (danger zone), enforces minimum target
// ============================================================

function ScoreTracker({ questions, studiedIds, internalMarks, scheme, isDrawing }) {
  const rules        = getSchemeRules(scheme);
  const totalStudied = studiedIds.size;
  const totalQs      = questions.length;
  const coveragePct  = totalQs > 0 ? Math.round((totalStudied / totalQs) * 100) : 0;
  const internal     = parseInt(internalMarks) || 0;
  const minExtNeeded = internalMarks !== ''
    ? calcMinExternalNeeded(internalMarks, scheme)
    : rules.minExternal;
  const safeZone = internalMarks !== ''
    ? (internal + rules.minExternal) >= rules.minTotal
    : null;

  const partAQs      = isDrawing ? [] : questions.filter(q => q.partType === 'A');
  const partBQs      = isDrawing ? [] : questions.filter(q => q.partType === 'B');
  const partAStudied = partAQs.filter(q => studiedIds.has(q.id)).length;
  const partBStudied = partBQs.filter(q => studiedIds.has(q.id)).length;

  const guaranteedMarks = useMemo(() => {
    if (isDrawing) {
      return [...questions]
        .sort((a, b) => (b.freq || 2) - (a.freq || 2))
        .slice(0, Math.ceil(questions.length * 0.6))
        .reduce((s, q) => s + q.marks, 0);
    }
    const partAMarks = questions.filter(q => q.partType === 'A').reduce((s, q) => s + q.marks, 0);
    const modules    = [...new Set(questions.filter(q => q.partType === 'B').map(q => q.module))];
    const partBG     = modules.reduce((sum, mod) => {
      const best = questions.filter(q => q.partType === 'B' && q.module === mod)
        .sort((a, b) => (b.freq || 2) - (a.freq || 2))[0];
      return sum + (best?.marks || 0);
    }, 0);
    return partAMarks + partBG;
  }, [questions, isDrawing]);

  const partATotal = questions.filter(q => q.partType === 'A').reduce((s, q) => s + q.marks, 0);

  // Determine if internal marks are dangerously low (need more than base min external)
  const isDangerInternal = internalMarks !== '' && minExtNeeded > rules.minExternal;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-4 md:p-5 mb-4">
      <div className="flex items-center space-x-2 mb-4 flex-wrap gap-2">
        <BarChart3 className="w-4 h-4" style={{ color: '#7c9eff' }} />
        <span className="text-sm font-black" style={{ color: '#e2e8f0' }}>Score Tracker</span>
        {safeZone !== null && (
          <span className="ml-auto atlas-tag"
            style={{
              background: safeZone ? 'rgba(134,223,186,0.1)' : 'rgba(232,165,152,0.1)',
              border: `1px solid ${safeZone ? 'rgba(134,223,186,0.3)' : 'rgba(232,165,152,0.3)'}`,
              color: safeZone ? '#86dfba' : '#e8a598',
            }}>
            {safeZone ? '✓ Safe Zone' : '⚠ Danger Zone'}
          </span>
        )}
      </div>

      {/* Pass rules */}
      <div className="mb-4 p-3 rounded-xl"
        style={{ background: 'rgba(124,158,255,0.06)', border: '1px solid rgba(124,158,255,0.15)' }}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ color: '#7c9eff' }}>{scheme} Pass Rules</p>
        <div className="space-y-1">
          <p className="text-[11px]" style={{ color: '#94a3b8' }}>
            • Min external: <span className="font-black" style={{ color: '#e8a598' }}>{rules.minExternal}/{rules.externalMax}</span>
          </p>
          <p className="text-[11px]" style={{ color: '#94a3b8' }}>
            • Min total: <span className="font-black" style={{ color: '#e8a598' }}>{rules.minTotal}/{rules.internalMax + rules.externalMax}</span>
          </p>
          {rules.minInternal > 0 && (
            <p className="text-[11px]" style={{ color: '#94a3b8' }}>
              • Min internal: <span className="font-black" style={{ color: '#e8a598' }}>{rules.minInternal}/{rules.internalMax}</span>
            </p>
          )}
          {internalMarks !== '' && (
            <p className="text-[11px] font-black mt-1.5 pt-1.5"
              style={{ color: safeZone ? '#86dfba' : '#e8a598', borderTop: '1px solid rgba(124,158,255,0.1)' }}>
              → With internal {internalMarks}, you need <span style={{ color: '#f0c987' }}>≥ {minExtNeeded}</span> in exam
            </p>
          )}
        </div>
      </div>

      {/* ENHANCED: Prominent warning when internal is low */}
      {isDangerInternal && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-xl"
          style={{ background: 'rgba(232,165,152,0.1)', border: '1px solid rgba(232,165,152,0.3)' }}>
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#e8a598' }} />
            <div>
              <p className="text-xs font-black mb-1" style={{ color: '#e8a598' }}>
                ⚠ Low Internal Marks — Higher Exam Target Required
              </p>
              <p className="text-[12px] font-medium leading-relaxed" style={{ color: 'rgba(232,165,152,0.9)' }}>
                Your internal marks ({internal}/{rules.internalMax}) are below the safe zone.
                You need <span className="font-black" style={{ color: '#f0c987' }}>at least {minExtNeeded} marks</span> in the semester exam
                (not just {rules.minExternal}) to reach the minimum total of {rules.minTotal}.
              </p>
              <p className="text-[11px] font-black mt-2" style={{ color: '#f0c987' }}>
                → Your target must be ≥ {minExtNeeded} marks
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Guaranteed marks */}
      <div className="mb-4 p-3 rounded-xl"
        style={{ background: 'rgba(134,223,186,0.05)', border: '1px solid rgba(134,223,186,0.15)' }}>
        <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#86dfba' }}>
          🎯 Studying All Questions Guarantees
        </p>
        {isDrawing ? (
          <div className="text-center">
            <div className="text-xl font-black" style={{ color: '#86dfba' }}>{guaranteedMarks}+</div>
            <div className="text-[10px]" style={{ color: '#64748b' }}>Estimated Marks</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-sm font-black" style={{ color: '#e2e8f0' }}>{partATotal}</div>
              <div className="text-[9px]" style={{ color: '#64748b' }}>Part A</div>
            </div>
            <div>
              <div className="text-sm font-black" style={{ color: '#e2e8f0' }}>{guaranteedMarks - partATotal}</div>
              <div className="text-[9px]" style={{ color: '#64748b' }}>Part B</div>
            </div>
            <div>
              <div className="text-sm font-black" style={{ color: '#86dfba' }}>{guaranteedMarks}</div>
              <div className="text-[9px]" style={{ color: '#64748b' }}>Total</div>
            </div>
          </div>
        )}
      </div>

      {/* Part A/B progress */}
      {!isDrawing && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: 'Part A', studied: partAStudied, total: partAQs.length, color: '#a5b4fc', rgb: '124,158,255' },
            { label: 'Part B', studied: partBStudied, total: partBQs.length, color: '#c4b5fd', rgb: '167,139,250' },
          ].map(p => (
            <div key={p.label} className="p-3 rounded-xl text-center"
              style={{ background: `rgba(${p.rgb},0.07)`, border: `1px solid rgba(${p.rgb},0.15)` }}>
              <div className="text-lg font-black" style={{ color: p.color }}>{p.studied}/{p.total}</div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: '#64748b' }}>{p.label}</div>
              <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: `rgba(${p.rgb},0.1)` }}>
                <motion.div className="h-full rounded-full" style={{ background: p.color }}
                  animate={{ width: `${p.total > 0 ? (p.studied / p.total) * 100 : 0}%` }}
                  transition={{ duration: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overall coverage */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-[11px] font-bold" style={{ color: '#94a3b8' }}>Overall Coverage</span>
          <span className="text-[11px] font-black" style={{ color: '#7c9eff' }}>{coveragePct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(124,158,255,0.1)' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#7c9eff,#86dfba)' }}
            animate={{ width: `${coveragePct}%` }} transition={{ duration: 0.8 }} />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION 29 — CIE TRACKER PANEL  (z-[8500])
// ============================================================

function CIETrackerPanel({ onClose, scheme }) {
  const rules = getSchemeRules(scheme);
  const [ceMarks, setCeMarks] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const analyze = useCallback(() => {
    const ce       = parseInt(ceMarks) || 0;
    const minExt   = calcMinExternalNeeded(ce, scheme);
    const safeZone = (ce + rules.minExternal) >= rules.minTotal;
    setAnalysis({ ce, minExt, safeZone });
  }, [ceMarks, scheme, rules]);

  const progressPct = ceMarks ? Math.min(100, Math.round((parseInt(ceMarks) / rules.internalMax) * 100)) : 0;
  const quickFills  = [
    Math.round(rules.internalMax * 0.5), Math.round(rules.internalMax * 0.65),
    Math.round(rules.internalMax * 0.8), rules.internalMax,
  ];

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      className="fixed right-0 top-0 h-full w-full max-w-sm z-[8500] overflow-y-auto"
      style={{ background: '#0a0b12', border: '1px solid rgba(124,158,255,0.2)' }}
      role="dialog" aria-label="CIE Tracker">
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" style={{ color: '#7c9eff' }} />
            <span className="font-black" style={{ color: '#e2e8f0' }}>CIE Tracker</span>
          </div>
          <button type="button" onClick={onClose}
            className="p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-4 p-4 rounded-2xl"
          style={{ background: 'rgba(124,158,255,0.06)', border: '1px solid rgba(124,158,255,0.15)' }}>
          <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: '#7c9eff' }}>
            {scheme} Pass Rules
          </p>
          <div className="space-y-1.5">
            {[
              { label: 'Internal Max', value: rules.internalMax, color: '#e2e8f0' },
              { label: 'External Max', value: rules.externalMax, color: '#e2e8f0' },
              { label: 'Min External', value: rules.minExternal, color: '#e8a598' },
              { label: 'Min Total',    value: rules.minTotal,    color: '#e8a598' },
            ].map(r => (
              <p key={r.label} className="text-[12px]" style={{ color: '#94a3b8' }}>
                • {r.label}: <span className="font-black" style={{ color: r.color }}>{r.value}</span>
              </p>
            ))}
            {rules.minInternal > 0 ? (
              <p className="text-[12px]" style={{ color: '#94a3b8' }}>
                • Min Internal: <span className="font-black" style={{ color: '#e8a598' }}>{rules.minInternal}</span>
              </p>
            ) : (
              <p className="text-[12px] font-medium" style={{ color: '#86dfba' }}>• No minimum internal mark required</p>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: '#94a3b8' }}>
            Your CE / Internal Marks (out of {rules.internalMax})
          </label>
          <input type="number" min="0" max={rules.internalMax} placeholder={`0–${rules.internalMax}`}
            value={ceMarks} onChange={e => { setCeMarks(e.target.value); setAnalysis(null); }}
            className="w-full atlas-input rounded-2xl px-4 py-3 text-sm font-medium" style={{ color: '#e2e8f0' }} />
        </div>

        <div className="flex gap-2 mb-5">
          {quickFills.map(v => (
            <button key={v} type="button"
              onClick={() => { setCeMarks(String(v)); setAnalysis(null); }}
              className="flex-1 py-2 rounded-xl text-[11px] font-black transition-all min-h-[40px]"
              style={{
                background: ceMarks === String(v) ? 'rgba(124,158,255,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${ceMarks === String(v) ? 'rgba(124,158,255,0.5)' : 'rgba(255,255,255,0.07)'}`,
                color: ceMarks === String(v) ? '#a5b4fc' : '#64748b',
              }}>
              {v}
            </button>
          ))}
        </div>

        {ceMarks && (
          <div className="mb-4 p-3 rounded-xl"
            style={{ background: 'rgba(124,158,255,0.05)', border: '1px solid rgba(124,158,255,0.12)' }}>
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] font-bold" style={{ color: '#64748b' }}>Internal progress</span>
              <span className="text-[10px] font-black" style={{ color: '#7c9eff' }}>{progressPct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,158,255,0.1)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: progressPct >= 65 ? 'linear-gradient(90deg,#86dfba,#c4e5d1)' : 'linear-gradient(90deg,#e8a598,#f0c987)' }}
                animate={{ width: `${Math.min(progressPct, 100)}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        )}

        <motion.button type="button" onClick={analyze} disabled={!ceMarks}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full btn-primary rounded-2xl py-3 font-bold text-sm mb-6 disabled:opacity-40 min-h-[44px]"
          style={{ color: '#ffffff' }}>
          Analyze Pass Status
        </motion.button>

        <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="p-4 rounded-2xl"
                style={{
                  background: analysis.safeZone ? 'rgba(134,223,186,0.07)' : 'rgba(232,165,152,0.07)',
                  border: `1px solid ${analysis.safeZone ? 'rgba(134,223,186,0.25)' : 'rgba(232,165,152,0.25)'}`,
                }}>
                <div className="flex items-center space-x-2 mb-2">
                  {analysis.safeZone
                    ? <CheckCircle className="w-5 h-5" style={{ color: '#86dfba' }} />
                    : <AlertCircle className="w-5 h-5" style={{ color: '#e8a598' }} />}
                  <span className="font-black text-sm" style={{ color: analysis.safeZone ? '#86dfba' : '#e8a598' }}>
                    {analysis.safeZone ? '✓ Safe Zone' : '⚠ Danger Zone'}
                  </span>
                </div>
                <p className="text-[12px] font-medium leading-relaxed"
                  style={{ color: analysis.safeZone ? 'rgba(134,223,186,0.85)' : 'rgba(232,165,152,0.85)' }}>
                  {analysis.safeZone
                    ? `With internal ${analysis.ce}, you only need ${rules.minExternal} in the semester exam. Total: ${analysis.ce + rules.minExternal} ≥ ${rules.minTotal} ✓`
                    : `With internal ${analysis.ce}, you need ${analysis.minExt} in the semester exam (not just ${rules.minExternal}) to reach total ≥ ${rules.minTotal}.`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Your Internal',      value: `${analysis.ce}/${rules.internalMax}`,    color: '#a5b4fc' },
                  { label: 'Min Semester Needed', value: `${analysis.minExt}/${rules.externalMax}`, color: analysis.safeZone ? '#86dfba' : '#e8a598' },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[10px]" style={{ color: '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION 30 — SCHEDULER PANEL  (z-[8500])
// ============================================================

function SchedulerPanel({ onClose, callAI, scheme }) {
  const [form, setForm] = useState({
    examDate: '', subjects: '', dailyHours: '6',
    breakDuration: '15', weakSubjects: '', preferences: '',
  });
  const [schedule, setSchedule] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [phase,    setPhase]    = useState(0);
  const [progress, setProgress] = useState(0);

  const ragRef   = useRef(null);
  const abortRef = useRef(false);
  const progRef  = useRef(0);

  const cleanup = useCallback(() => {
    if (ragRef.current) { clearInterval(ragRef.current); ragRef.current = null; }
  }, []);

  useEffect(() => () => { abortRef.current = true; cleanup(); }, [cleanup]);

  const generate = useCallback(async () => {
    if (!callAI) { setError('AI not connected.'); return; }
    abortRef.current = false;
    setLoading(true); setError(''); setPhase(0); setProgress(0); progRef.current = 0;
    cleanup();

    ragRef.current = setInterval(() => {
      if (abortRef.current) return;
      progRef.current = Math.min(progRef.current + 0.5, 92);
      setProgress(Math.round(progRef.current));
      setPhase(Math.min(Math.floor((progRef.current / 100) * (RAG_PHASES.length - 1)), RAG_PHASES.length - 1));
    }, 150);

    const today    = new Date();
    const examD    = new Date(form.examDate);
    const daysLeft = Math.max(1, Math.ceil((examD - today) / 86400000));

    const prompt = `Create a detailed KTU exam study schedule.
Exam Date: ${form.examDate} (${daysLeft} days left)
Subjects: ${sanitizeUserInput(form.subjects)}
Daily Study Hours: ${form.dailyHours}h
Break Duration: ${form.breakDuration}min
Weak Subjects: ${sanitizeUserInput(form.weakSubjects) || 'None'}
Preferences: ${sanitizeUserInput(form.preferences) || 'None'}
KTU Scheme: ${scheme}

Generate:
## Overview
## Time Allocation Table
| Subject | Days | Daily Hours | Priority |
## Day-by-Day Schedule
## Last 3 Days Strategy
## Daily Routine Template
Keep it practical and KTU exam focused.`;

    try {
      const res = await callAI(prompt);
      if (abortRef.current) return;
      cleanup(); setProgress(100); setSchedule(res);
    } catch (err) {
      if (abortRef.current) return;
      cleanup(); setError(err.message || 'Failed to generate schedule.');
    } finally {
      if (!abortRef.current) setLoading(false);
    }
  }, [callAI, form, scheme, cleanup]);

  const currentPhase = RAG_PHASES[Math.min(phase, RAG_PHASES.length - 1)];

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      className="fixed right-0 top-0 h-full w-full sm:max-w-lg z-[8500] overflow-y-auto"
      style={{ background: '#0a0b12', border: '1px solid rgba(124,158,255,0.2)' }}
      role="dialog" aria-label="Study Scheduler">
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" style={{ color: '#7c9eff' }} />
            <span className="font-black" style={{ color: '#e2e8f0' }}>Study Scheduler</span>
          </div>
          <button type="button" onClick={onClose}
            className="p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!schedule ? (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: '#94a3b8' }}>📅 Exam Date *</label>
              <input type="date" value={form.examDate} onChange={e => setForm(p => ({ ...p, examDate: e.target.value }))}
                className="w-full atlas-input rounded-2xl px-4 py-3 text-sm font-medium" style={{ color: '#e2e8f0' }} />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: '#94a3b8' }}>📚 Subjects *</label>
              <textarea value={form.subjects} onChange={e => setForm(p => ({ ...p, subjects: e.target.value }))}
                placeholder="e.g. Data Structures, DBMS, Operating Systems" rows={2} maxLength={500}
                className="w-full atlas-input rounded-2xl px-4 py-3 text-sm font-medium resize-none" style={{ color: '#e2e8f0' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '⏰ Daily Hours', key: 'dailyHours', opts: ['4','5','6','7','8','10','12'], suffix: 'h' },
                { label: '☕ Break', key: 'breakDuration', opts: ['5','10','15','20','30'], suffix: 'min' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: '#94a3b8' }}>{f.label}</label>
                  <div className="relative">
                    <select value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full atlas-select rounded-2xl px-3 py-3 text-sm font-bold pr-8 min-h-[44px]" style={{ color: '#e2e8f0' }}>
                      {f.opts.map(o => <option key={o} value={o} style={{ background: '#0a0b12' }}>{o}{f.suffix}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#64748b' }} />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: '#94a3b8' }}>😰 Weak Subjects</label>
              <input value={form.weakSubjects} onChange={e => setForm(p => ({ ...p, weakSubjects: e.target.value }))}
                placeholder="Gets more time allocated" maxLength={200}
                className="w-full atlas-input rounded-2xl px-4 py-3 text-sm font-medium" style={{ color: '#e2e8f0' }} />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: '#94a3b8' }}>✨ Preferences</label>
              <input value={form.preferences} onChange={e => setForm(p => ({ ...p, preferences: e.target.value }))}
                placeholder="e.g. No study after 10pm" maxLength={200}
                className="w-full atlas-input rounded-2xl px-4 py-3 text-sm font-medium" style={{ color: '#e2e8f0' }} />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-xl"
                style={{ background: 'rgba(232,165,152,0.08)', border: '1px solid rgba(232,165,152,0.25)' }}>
                <p className="text-[12px] font-medium" style={{ color: '#e8a598' }}>{error}</p>
                <button type="button" onClick={() => { setError(''); generate(); }}
                  className="mt-1.5 text-[11px] font-bold underline min-h-[32px]" style={{ color: '#a5b4fc' }}>↻ Retry</button>
              </motion.div>
            )}

            {loading ? (
              <div className="rounded-2xl p-5"
                style={{ background: 'rgba(124,158,255,0.06)', border: '1px solid rgba(124,158,255,0.2)' }}>
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Brain className="w-5 h-5" style={{ color: '#7c9eff' }} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.p key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-[11px] font-medium truncate" style={{ color: '#7c9eff' }}>
                      {currentPhase.icon} {currentPhase.label}
                    </motion.p>
                  </div>
                  <span className="text-[11px] font-black" style={{ color: '#a78bfa' }}>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,158,255,0.1)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg,#7c9eff,#a78bfa)' }}
                    animate={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <motion.button type="button" onClick={generate}
                disabled={!form.examDate || !form.subjects.trim()}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full btn-primary rounded-2xl py-4 font-bold flex items-center justify-center space-x-2 disabled:opacity-40 min-h-[44px]"
                style={{ color: '#ffffff' }}>
                <Calendar className="w-5 h-5" /><span>Generate My Schedule</span>
              </motion.button>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black" style={{ color: '#86dfba' }}>✓ Schedule Ready!</span>
              <button type="button" onClick={() => { setSchedule(''); setError(''); progRef.current = 0; }}
                className="text-[11px] font-bold underline min-h-[44px] flex items-center" style={{ color: '#a5b4fc' }}>
                Regenerate
              </button>
            </div>
            <div className="glass-panel rounded-2xl p-4 md:p-5 overflow-x-auto">
              <AIResultRenderer content={schedule} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION 31 — TARGET STRATEGIST PANEL  (z-[8500])
// ============================================================

function TargetStrategistPanel({ onClose, questions, scheme, internalMarks, isDrawing }) {
  const rules = getSchemeRules(scheme);
  const [targetMark, setTargetMark] = useState('');
  const [result,     setResult]     = useState(null);

  // Calculate the real minimum target considering internal marks
  const effectiveMinTarget = useMemo(() => {
    if (internalMarks !== '' && internalMarks !== undefined) {
      return calcMinExternalNeeded(internalMarks, scheme);
    }
    return rules.minExternal;
  }, [internalMarks, scheme, rules]);

  const presets = useMemo(() => {
    const base = [
      effectiveMinTarget,
      Math.round(rules.externalMax * 0.5),
      Math.round(rules.externalMax * 0.7),
      rules.externalMax,
    ];
    // Deduplicate and sort
    return [...new Set(base)].sort((a, b) => a - b);
  }, [rules, effectiveMinTarget]);

  const calculate = useCallback(() => {
    const raw    = targetMark.toString().trim();
    const target = parseInt(raw);
    if (!raw || isNaN(target)) { setResult({ error: 'Please enter a valid target mark.' }); return; }
    if (target > rules.externalMax) { setResult({ error: `Maximum external mark is ${rules.externalMax}.` }); return; }
    if (target < effectiveMinTarget) {
      setResult({
        error: `Your minimum target must be ${effectiveMinTarget} marks. ` +
          (effectiveMinTarget > rules.minExternal
            ? `With internal ${internalMarks}, you need at least ${effectiveMinTarget} in the exam to reach total ≥ ${rules.minTotal}.`
            : `The minimum to pass is ${rules.minExternal}.`),
      });
      return;
    }

    const internal = parseInt(internalMarks) || 0;
    if (internalMarks !== '' && (internal + target) < rules.minTotal) {
      const needed = calcMinExternalNeeded(internal, scheme);
      setResult({
        error: `Target ${target} + internal ${internal} = ${internal + target}, below minimum total ${rules.minTotal}. You need at least ${needed} to pass.`,
      });
      return;
    }

    const strategy = calculateTargetStrategy(questions, target, scheme, isDrawing);
    setResult({ ...strategy, ok: true });
  }, [targetMark, rules, internalMarks, questions, scheme, isDrawing, effectiveMinTarget]);

  const handleKeyDown = useCallback((e) => { if (e.key === 'Enter') calculate(); }, [calculate]);

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      className="fixed right-0 top-0 h-full w-full max-w-sm z-[8500] overflow-y-auto"
      style={{ background: '#0a0b12', border: '1px solid rgba(124,158,255,0.2)' }}
      role="dialog" aria-label="Target Strategist">
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5" style={{ color: '#7c9eff' }} />
            <span className="font-black" style={{ color: '#e2e8f0' }}>Target Strategist</span>
          </div>
          <button type="button" onClick={onClose}
            className="p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-xl"
          style={{ background: 'rgba(124,158,255,0.06)', border: '1px solid rgba(124,158,255,0.15)' }}>
          <p className="text-[12px] leading-relaxed" style={{ color: '#94a3b8' }}>
            Enter your target → ATLAS calculates the{' '}
            <span className="font-black" style={{ color: '#7c9eff' }}>exact questions</span>{' '}
            you need to study with an{' '}
            <span className="font-black" style={{ color: '#f0c987' }}>adaptive safety buffer</span>.
          </p>
          {effectiveMinTarget > rules.minExternal && (
            <p className="text-[11px] font-black mt-2 pt-2"
              style={{ color: '#e8a598', borderTop: '1px solid rgba(124,158,255,0.1)' }}>
              ⚠ With internal {internalMarks}, minimum target is {effectiveMinTarget} (not {rules.minExternal})
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: '#94a3b8' }}>
            Target External Marks (min {effectiveMinTarget}, max {rules.externalMax})
          </label>
          <input type="number" min={effectiveMinTarget} max={rules.externalMax}
            placeholder={`${effectiveMinTarget}–${rules.externalMax}`}
            value={targetMark} onChange={e => { setTargetMark(e.target.value); setResult(null); }}
            onKeyDown={handleKeyDown}
            className="w-full atlas-input rounded-2xl px-4 py-3 text-sm font-medium"
            style={{ color: '#e2e8f0' }} aria-label="Target marks" />
        </div>

        <div className="flex gap-2 mb-5">
          {presets.map(t => (
            <button key={t} type="button"
              onClick={() => { setTargetMark(String(t)); setResult(null); }}
              className="flex-1 py-2 rounded-xl text-[11px] font-black transition-all min-h-[40px]"
              style={{
                background: targetMark === String(t) ? 'rgba(124,158,255,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${targetMark === String(t) ? 'rgba(124,158,255,0.5)' : 'rgba(255,255,255,0.07)'}`,
                color: targetMark === String(t) ? '#a5b4fc' : '#64748b',
              }}>
              {t}
            </button>
          ))}
        </div>

        <motion.button type="button" onClick={calculate}
          disabled={!targetMark.toString().trim()}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full btn-primary rounded-2xl py-3 font-bold text-sm mb-5 disabled:opacity-40 flex items-center justify-center space-x-2 min-h-[44px]"
          style={{ color: '#ffffff' }}>
          <Target className="w-4 h-4" /><span>Calculate Strategy</span>
        </motion.button>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} className="space-y-3">
              {result.error ? (
                <div className="p-4 rounded-2xl"
                  style={{ background: 'rgba(232,165,152,0.08)', border: '1px solid rgba(232,165,152,0.25)' }}>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#e8a598' }} />
                    <p className="text-sm font-bold leading-relaxed" style={{ color: '#e8a598' }}>{result.error}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl"
                    style={{
                      background: result.canAchieve ? 'rgba(134,223,186,0.07)' : 'rgba(232,165,152,0.07)',
                      border: `1px solid ${result.canAchieve ? 'rgba(134,223,186,0.25)' : 'rgba(232,165,152,0.25)'}`,
                    }}>
                    <div className="flex items-center space-x-2 mb-2">
                      {result.canAchieve
                        ? <CheckCircle className="w-5 h-5" style={{ color: '#86dfba' }} />
                        : <AlertCircle className="w-5 h-5" style={{ color: '#e8a598' }} />}
                      <span className="font-black text-sm" style={{ color: result.canAchieve ? '#86dfba' : '#e8a598' }}>
                        {result.canAchieve ? '✓ Achievable!' : '⚠ Stretch Goal'}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed"
                      style={{ color: result.canAchieve ? 'rgba(134,223,186,0.85)' : 'rgba(232,165,152,0.85)' }}>
                      Study <span className="font-black">{result.totalMustStudy} questions</span> →
                      Guaranteed <span className="font-black">{result.guaranteedMarks}</span> marks
                      (target {result.target} + safety buffer).
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { l: 'Target', v: result.target, c: '#a5b4fc' },
                      { l: 'Guaranteed', v: result.guaranteedMarks, c: '#86dfba' },
                      { l: 'Questions', v: result.totalMustStudy, c: '#f0c987' },
                    ].map((s, i) => (
                      <div key={i} className="p-3 rounded-xl text-center"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="text-lg font-black" style={{ color: s.c }}>{s.v}</div>
                        <div className="text-[10px]" style={{ color: '#64748b' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl"
                    style={{ background: 'rgba(124,158,255,0.05)', border: '1px solid rgba(124,158,255,0.12)' }}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] font-bold" style={{ color: '#64748b' }}>Avg Question Confidence</span>
                      <span className="text-[10px] font-black" style={{ color: '#7c9eff' }}>{result.avgConfidence}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,158,255,0.1)' }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg,#7c9eff,#86dfba)' }}
                        animate={{ width: `${result.avgConfidence}%` }} transition={{ duration: 0.8 }} />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl"
                    style={{ background: 'rgba(134,223,186,0.05)', border: '1px solid rgba(134,223,186,0.2)' }}>
                    <p className="text-[11px] leading-relaxed font-medium" style={{ color: 'rgba(134,223,186,0.85)' }}>
                      👈 Close this panel — the study screen now shows{' '}
                      <span className="font-black" style={{ color: '#86dfba' }}>ONLY the {result.totalMustStudy} questions you need</span>{' '}
                      to reach your target.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION 32 — BOOKMARKS PANEL  (BUG 15 FIX: z-[8700])
// ============================================================

function BookmarksPanel({ onClose, bookmarks, onRemove, onClearAll }) {
  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      className="fixed right-0 top-0 h-full w-full max-w-sm z-[8700] overflow-y-auto"
      style={{ background: '#0a0b12', border: '1px solid rgba(240,201,135,0.2)' }}
      role="dialog" aria-label="Bookmarks">
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5" style={{ color: '#f0c987' }} />
            <span className="font-black" style={{ color: '#e2e8f0' }}>Bookmarks ({bookmarks.length})</span>
          </div>
          <button type="button" onClick={onClose}
            className="p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }} aria-label="Close bookmarks">
            <X className="w-4 h-4" />
          </button>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-12 h-12 mx-auto mb-4" style={{ color: '#334155' }} />
            <p className="font-bold mb-2" style={{ color: '#94a3b8' }}>No bookmarks yet</p>
            <p className="text-[12px]" style={{ color: '#64748b' }}>Tap the bookmark icon on any question to save it here.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              <AnimatePresence initial={false}>
                {bookmarks.map(b => (
                  <motion.div key={b.id} layout
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }} transition={{ duration: 0.2 }}
                    className="p-3 rounded-xl"
                    style={{ background: 'rgba(240,201,135,0.05)', border: '1px solid rgba(240,201,135,0.15)' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="atlas-tag atlas-tag-amber">{b.marks}m</span>
                          {b.module && <span className="atlas-tag atlas-tag-indigo">M{b.module}</span>}
                          <span className="text-[9px]" style={{ color: '#64748b' }}>{(b.subject || '').split('-')[0]?.trim()}</span>
                        </div>
                        <p className="text-[12px] leading-relaxed" style={{ color: '#e2e8f0' }}>{b.text}</p>
                      </div>
                      <button type="button" onClick={() => onRemove(b)}
                        className="flex-shrink-0 p-1.5 rounded-lg min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors hover:bg-white/5"
                        style={{ color: '#64748b' }} aria-label={`Remove bookmark: ${b.text.slice(0, 30)}`}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button type="button" onClick={onClearAll}
              className="w-full py-2.5 rounded-xl text-[12px] font-bold min-h-[44px]"
              style={{ background: 'rgba(232,165,152,0.06)', border: '1px solid rgba(232,165,152,0.2)', color: 'rgba(232,165,152,0.85)' }}>
              Clear All Bookmarks
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION 33 — RECONNECT SCREEN
// ============================================================

function ReconnectScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#04050a' }} role="main" aria-label="Reconnecting to ATLAS">
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" /><div className="aurora-orb aurora-orb-3" />
      </div>
      <div className="noise-overlay" aria-hidden="true" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center">
        <motion.div className="mb-8" initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}>
          <div className="relative">
            <motion.div className="absolute inset-0 rounded-3xl"
              style={{ background: 'radial-gradient(circle,rgba(124,158,255,0.4),transparent 70%)' }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }} />
            <div className="relative p-6 rounded-3xl"
              style={{ background: 'linear-gradient(135deg,#7c9eff,#a78bfa,#c4b5fd)', boxShadow: '0 0 60px rgba(124,158,255,0.4)' }}>
              <Telescope className="w-14 h-14" style={{ color: '#ffffff' }} aria-hidden="true" />
            </div>
          </div>
        </motion.div>
        <h1 className="text-5xl font-black tracking-tighter mb-2"
          style={{ color: '#e2e8f0', textShadow: '0 0 40px rgba(124,158,255,0.5)' }}>ATLAS</h1>
        <div className="flex items-center space-x-2 mt-4">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center space-x-2 px-4 py-2 rounded-full"
            style={{ background: 'rgba(124,158,255,0.1)', border: '1px solid rgba(124,158,255,0.25)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw className="w-3.5 h-3.5" style={{ color: '#7c9eff' }} />
            </motion.div>
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#7c9eff' }}>Reconnecting...</span>
          </motion.div>
        </div>
        <p className="text-[12px] font-medium mt-4" style={{ color: '#64748b' }}>Restoring your session</p>
      </motion.div>
    </div>
  );
}
// ============================================================
// SECTION 34 — WELCOME SCREEN
// ============================================================

function WelcomeScreen({ onContinue }) {
  const [activeFeature, setActiveFeature] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveFeature(p => (p + 1) % FEATURES.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ background: '#04050a' }}>
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" /><div className="aurora-orb aurora-orb-4" />
      </div>
      <div className="noise-overlay" aria-hidden="true" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-6">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-center mb-8 md:mb-12">
            <motion.div className="flex justify-center mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}>
              <AtlasLogo size={72} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-2"
                style={{ color: '#e2e8f0', textShadow: '0 0 80px rgba(124,158,255,0.5)' }}>ATLAS</h1>
              <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-4">
                <div className="h-px w-10 md:w-16" style={{ background: 'linear-gradient(to right,transparent,#7c9eff)' }} />
                <span className="text-[11px] md:text-xs font-black tracking-[0.15em] md:tracking-[0.25em] uppercase" style={{ color: '#7c9eff' }}>
                  KTU Vault Pro · RAG Edition
                </span>
                <div className="h-px w-10 md:w-16" style={{ background: 'linear-gradient(to left,transparent,#7c9eff)' }} />
              </div>
              <p className="text-base md:text-lg font-medium max-w-sm md:max-w-md mx-auto leading-relaxed px-4" style={{ color: '#94a3b8' }}>
                The KTU exam prep tool that actually thinks.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="flex items-center justify-center space-x-4 md:space-x-6 mt-6 md:mt-8">
              {[{ value: '40+', label: 'Subjects' },{ value: '500+', label: 'PYQs' },{ value: '10', label: 'AI Features' },{ value: '15+', label: 'Providers' }].map((s,i) => (
                <div key={i} className="text-center">
                  <div className="text-xl md:text-2xl font-black" style={{ color: '#e2e8f0' }}>{s.value}</div>
                  <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="w-full max-w-5xl mx-auto mb-8 md:mb-10 px-4">
            <p className="text-center text-[11px] font-black uppercase tracking-[0.2em] mb-4 md:mb-5" style={{ color: '#64748b' }}>
              Powered by 10 AI-Native Features
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
              {FEATURES.map((f, i) => (
                <motion.button key={i} type="button" onClick={() => setActiveFeature(i)}
                  animate={{ scale: activeFeature === i ? 1.05 : 1, opacity: activeFeature === i ? 1 : 0.6 }}
                  className="p-3 md:p-4 rounded-2xl text-center transition-all"
                  style={{
                    background: activeFeature === i ? 'rgba(124,158,255,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${activeFeature === i ? f.color + '40' : 'rgba(255,255,255,0.05)'}`,
                  }}
                  aria-pressed={activeFeature === i} aria-label={f.title}>
                  <f.icon className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1.5 md:mb-2"
                    style={{ color: activeFeature === i ? f.color : '#334155' }} />
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider leading-tight"
                    style={{ color: activeFeature === i ? '#e2e8f0' : '#334155' }}>
                    {f.title.split(' ').slice(0, 2).join(' ')}
                  </p>
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={activeFeature} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} className="mt-4 p-3 md:p-4 rounded-2xl text-center"
                style={{ background: 'rgba(124,158,255,0.04)', border: `1px solid ${FEATURES[activeFeature].color}25` }}>
                <p className="text-sm font-bold mb-1" style={{ color: '#e2e8f0' }}>{FEATURES[activeFeature].title}</p>
                <p className="text-[12px] md:text-[13px] font-medium" style={{ color: '#94a3b8' }}>{FEATURES[activeFeature].desc}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="flex flex-col items-center space-y-4 px-4 w-full">
            <motion.button type="button" onClick={onContinue}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(124,158,255,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary rounded-2xl py-3.5 md:py-4 px-8 md:px-10 font-black text-base md:text-lg flex items-center space-x-3 w-full max-w-xs justify-center"
              style={{ color: '#ffffff', boxShadow: '0 0 30px rgba(124,158,255,0.35)' }}>
              <Rocket className="w-5 h-5" /><span>Launch ATLAS</span>
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
            <p className="text-[11px] font-medium text-center" style={{ color: '#64748b' }}>
              Free · Bring your own API key · Session-only storage · Key never logged
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 35 — BOOT SCREEN
// BUG 3 FIX: provider grid buttons call selectProvider(p.id)
// BUG 14 FIX: links only shown when p.link && p.linkLabel
// ============================================================

function BootScreen({ onBoot, initialError = '' }) {
  const hook = useAPIVerification();
  const { apiKey, setApiKey, verifyStatus, verifiedConfig, selectedModel, detectedProvider, selectProvider, manualProvider } = hook;
  const [showKey, setShowKey] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (initialError) hook.reset(); }, [initialError]);

  const handleBoot = useCallback(() => {
    if (verifyStatus === 'success' && verifiedConfig) {
      const cfg = {
        provider: verifiedConfig.provider, apiKey: apiKey.trim(),
        model: selectedModel || verifiedConfig.model,
        customBaseUrl: verifiedConfig.customBaseUrl || '', detectedName: verifiedConfig.detectedName || '',
      };
      SecureStorage.save(STORAGE_KEY, cfg);
      onBoot(cfg);
    }
  }, [verifyStatus, verifiedConfig, apiKey, selectedModel, onBoot]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: '#04050a' }}>
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" /><div className="aurora-orb aurora-orb-3" />
      </div>
      <div className="noise-overlay" aria-hidden="true" />
      <motion.div initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }} className="relative w-full max-w-md z-10">
        <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
            style={{ background: 'linear-gradient(to right,transparent,rgba(124,158,255,0.6),transparent)' }} />
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-xl scale-150" style={{ background: 'rgba(124,158,255,0.2)' }} />
                <div className="relative p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg,#7c9eff,#a78bfa)' }}>
                  <KeyRound className="w-7 h-7 md:w-8 md:h-8" style={{ color: '#ffffff' }} />
                </div>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-black mb-1" style={{ color: '#e2e8f0' }}>Connect Your AI</h2>
            <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Paste your API key to activate ATLAS</p>
            {initialError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 rounded-xl text-left"
                style={{ background: 'rgba(232,165,152,0.08)', border: '1px solid rgba(232,165,152,0.25)' }}>
                <p className="text-[12px] font-medium" style={{ color: '#e8a598' }}>⚠ {initialError}</p>
              </motion.div>
            )}
          </div>

          {/* BUG 3 FIX: provider grid buttons are clickable */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {AI_PROVIDERS.filter(p => p.featured).map(p => {
              const isActive = detectedProvider === p.id || manualProvider === p.id;
              return (
                <button key={p.id} type="button" onClick={() => selectProvider(p.id)}
                  className="relative flex flex-col items-center p-3 rounded-2xl transition-all min-h-[72px]"
                  style={{
                    background: isActive ? p.gradient : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? p.border : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer',
                  }}
                  aria-pressed={isActive} aria-label={`Select ${p.name}`}>
                  <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black"
                    style={{ background: p.badgeBg, color: p.badgeColor, border: `1px solid ${p.badgeColor}33` }}>
                    {p.badge}
                  </div>
                  <span className="text-xl mb-1" style={{ color: isActive ? p.color : '#334155' }}>{p.icon}</span>
                  <span className="text-[10px] font-black text-center leading-tight"
                    style={{ color: isActive ? '#e2e8f0' : '#94a3b8' }}>{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* BUG 14 FIX: only show links where both link AND linkLabel exist */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {AI_PROVIDERS.filter(p => p.featured && p.link && p.linkLabel).map(p => (
              <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-1 text-[11px] font-bold px-2 py-1 rounded-lg hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: p.color }}>
                <span>{p.icon}</span><span>{p.linkLabel}</span><ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>

          <div className="relative mb-4">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#64748b' }} />
            <input type={showKey ? 'text' : 'password'} placeholder="Paste API key — auto-detected & verified"
              value={apiKey} onChange={e => setApiKey(e.target.value)} autoComplete="off" spellCheck="false"
              className="w-full atlas-input rounded-2xl pl-11 pr-12 py-3.5 text-sm placeholder-slate-700 font-medium"
              style={{ color: '#e2e8f0' }} aria-label="API key input" />
            {apiKey && (
              <button type="button" onClick={() => setShowKey(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg min-h-[32px] min-w-[32px] flex items-center justify-center"
                style={{ color: '#64748b' }} aria-label={showKey ? 'Hide API key' : 'Show API key'}>
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <VerifyBlock hook={hook} />

          <motion.button type="button" onClick={handleBoot} disabled={verifyStatus !== 'success'}
            whileHover={{ scale: verifyStatus === 'success' ? 1.02 : 1 }} whileTap={{ scale: 0.97 }}
            className="w-full btn-primary rounded-2xl py-3.5 md:py-4 px-6 flex items-center justify-center space-x-2.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px]"
            style={{ color: '#ffffff' }}>
            {verifyStatus === 'verifying' ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}><Shield className="w-5 h-5" /></motion.div><span>Verifying...</span></>
            ) : verifyStatus === 'success' ? (
              <><Rocket className="w-5 h-5" /><span>Enter ATLAS</span><motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}><ArrowRight className="w-5 h-5" /></motion.div></>
            ) : (
              <><KeyRound className="w-5 h-5" /><span>Paste API Key to Continue</span></>
            )}
          </motion.button>
          <p className="text-center text-[11px] mt-3" style={{ color: '#64748b' }}>
            🔒 Session-only storage · Cleared on tab close · Never logged
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// SECTION 36 — CHANGE API PANEL  (BUG 15 FIX: z-[9000])
// BUG 3 FIX: provider grid clickable
// BUG 14 FIX: links only for providers with linkLabel
// ============================================================

function ChangeAPIPanel({ onClose, currentConfig, onUpdate }) {
  const hook = useAPIVerification();
  const { apiKey, setApiKey, verifyStatus, verifiedConfig, selectedModel, detectedProvider, selectProvider, manualProvider } = hook;
  const [showKey, setShowKey] = useState(false);
  const currentProv = currentConfig?.provider ? AI_PROVIDERS.find(p => p.id === currentConfig.provider) : null;

  const handleApply = useCallback(() => {
    if (verifyStatus === 'success' && verifiedConfig) {
      const cfg = {
        provider: verifiedConfig.provider, apiKey: apiKey.trim(),
        model: selectedModel || verifiedConfig.model,
        customBaseUrl: verifiedConfig.customBaseUrl || '', detectedName: verifiedConfig.detectedName || '',
      };
      SecureStorage.save(STORAGE_KEY, cfg);
      onUpdate(cfg);
      onClose();
    }
  }, [verifyStatus, verifiedConfig, apiKey, selectedModel, onUpdate, onClose]);

  const handleLogout = useCallback(() => {
    SecureStorage.clearAll(); conversationManager.clear(); apiClient.abortAll();
    onUpdate(null); onClose();
  }, [onUpdate, onClose]);

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}
      className="fixed right-0 top-0 h-full w-full max-w-sm z-[9000] overflow-y-auto"
      style={{ background: '#0a0b12', border: '1px solid rgba(124,158,255,0.2)' }}
      role="dialog" aria-label="Change AI Provider">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-5 h-5" style={{ color: '#7c9eff' }} />
            <span className="font-black" style={{ color: '#e2e8f0' }}>Change AI Provider</span>
          </div>
          <button type="button" onClick={onClose}
            className="p-2 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {currentProv && (
          <div className="mb-5 p-4 rounded-2xl"
            style={{ background: 'rgba(124,158,255,0.06)', border: '1px solid rgba(124,158,255,0.15)' }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#7c9eff' }}>Currently Active</p>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{currentProv.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black" style={{ color: '#e2e8f0' }}>{currentConfig?.detectedName || currentProv.name}</p>
                <p className="text-[11px] truncate" style={{ color: '#94a3b8' }}>{currentConfig?.model}</p>
                <p className="text-[10px] mt-0.5 font-mono" style={{ color: '#64748b' }}>
                  {maskApiKey(currentConfig?.apiKey || '', currentProv.noKey)}
                </p>
              </div>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#86dfba', boxShadow: '0 0 6px #86dfba' }} />
            </div>
          </div>
        )}

        <div className="mb-4 p-3 rounded-xl"
          style={{ background: 'rgba(134,223,186,0.05)', border: '1px solid rgba(134,223,186,0.15)' }}>
          <p className="text-[11px] leading-relaxed" style={{ color: '#86dfba' }}>
            ✨ Your conversation &amp; bookmarks stay intact when switching providers.
          </p>
        </div>

        {/* BUG 3 FIX: clickable provider grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {AI_PROVIDERS.filter(p => p.featured || p.id === 'custom').map(p => {
            const isActive = detectedProvider === p.id || manualProvider === p.id;
            return (
              <button key={p.id} type="button" onClick={() => selectProvider(p.id)}
                className="relative flex flex-col items-center p-3 rounded-2xl transition-all min-h-[64px]"
                style={{
                  background: isActive ? (p.gradient || 'rgba(124,158,255,0.15)') : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? (p.border || 'rgba(124,158,255,0.3)') : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer',
                }}
                aria-pressed={isActive} aria-label={`Select ${p.name}`}>
                {p.badge && (
                  <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black"
                    style={{ background: p.badgeBg || 'rgba(134,223,186,0.15)', color: p.badgeColor || '#86dfba', border: `1px solid ${(p.badgeColor || '#86dfba')}33` }}>
                    {p.badge}
                  </div>
                )}
                <span className="text-lg mb-1" style={{ color: isActive ? p.color : '#334155' }}>{p.icon}</span>
                <span className="text-[10px] font-black text-center" style={{ color: isActive ? '#e2e8f0' : '#94a3b8' }}>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* BUG 14 FIX */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {AI_PROVIDERS.filter(p => p.featured && p.link && p.linkLabel).map(p => (
            <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center space-x-1 text-[11px] font-bold px-2 py-1 rounded-lg hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: p.color }}>
              <span>{p.icon}</span><span>{p.linkLabel}</span><ExternalLink className="w-2.5 h-2.5" />
            </a>
          ))}
        </div>

        <div className="relative mb-4">
          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#64748b' }} />
          <input type={showKey ? 'text' : 'password'} placeholder="Paste new API key"
            value={apiKey} onChange={e => setApiKey(e.target.value)} autoComplete="off" spellCheck="false"
            className="w-full atlas-input rounded-2xl pl-11 pr-12 py-3.5 text-sm placeholder-slate-700 font-medium"
            style={{ color: '#e2e8f0' }} aria-label="New API key" />
          {apiKey && (
            <button type="button" onClick={() => setShowKey(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg min-h-[32px] min-w-[32px] flex items-center justify-center"
              style={{ color: '#64748b' }} aria-label={showKey ? 'Hide API key' : 'Show API key'}>
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        <VerifyBlock hook={hook} />

        <motion.button type="button" onClick={handleApply} disabled={verifyStatus !== 'success'}
          whileHover={{ scale: verifyStatus === 'success' ? 1.02 : 1 }} whileTap={{ scale: 0.97 }}
          className="w-full btn-primary rounded-2xl py-3 font-bold text-sm mb-3 disabled:opacity-40 flex items-center justify-center space-x-2 min-h-[44px]"
          style={{ color: '#ffffff' }}>
          <Check className="w-4 h-4" /><span>Apply New Provider</span>
        </motion.button>

        <button type="button" onClick={handleLogout}
          className="w-full py-2.5 rounded-2xl text-sm font-bold min-h-[44px]"
          style={{ background: 'rgba(232,165,152,0.06)', border: '1px solid rgba(232,165,152,0.2)', color: 'rgba(232,165,152,0.85)' }}>
          🔓 Clear Session &amp; Logout
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================
// SECTION 37 — DASHBOARD SCREEN
// BUG 18 FIX: upstream changes reset downstream selections
// ENHANCED: target mark enforces minimum from calcMinExternalNeeded
// ============================================================

const isComingSoon = s => (s || '').toLowerCase().includes('coming soon');

function DashboardScreen({ onStartStudy, aiConfig, onChangeAPI, onShowBookmarks, bookmarksCount }) {
  const [step,          setStep]          = useState(0);
  const [scheme,        setScheme]        = useState('2024');
  const [dept,          setDept]          = useState('');
  const [semester,      setSemester]      = useState('');
  const [subject,       setSubject]       = useState('');
  const [examType,      setExamType]      = useState('semester');
  const [internalMarks, setInternalMarks] = useState('');
  const [targetMark,    setTargetMark]    = useState('');

  const depts     = useMemo(() => Object.keys(studyData[scheme] || {}), [scheme]);
  const semesters = useMemo(() => Object.keys(studyData[scheme]?.[dept] || {}), [scheme, dept]);
  const subjects  = useMemo(() => studyData[scheme]?.[dept]?.[semester] || [], [scheme, dept, semester]);
  const rules     = useMemo(() => getSchemeRules(scheme), [scheme]);

  const providerInfo = aiConfig ? AI_PROVIDERS.find(p => p.id === aiConfig.provider) : null;

  const steps = useMemo(() => [
    { id: 0, label: 'Scheme', icon: Shield },
    { id: 1, label: 'Dept', icon: GraduationCap },
    { id: 2, label: 'Semester', icon: BookOpen },
    { id: 3, label: 'Subject', icon: Layers },
    { id: 4, label: 'Exam', icon: Target },
  ], []);

  // Calculate effective minimum target
  const effectiveMinTarget = useMemo(() => {
    if (examType !== 'semester' || internalMarks === '') return rules.minExternal;
    return calcMinExternalNeeded(internalMarks, scheme);
  }, [examType, internalMarks, scheme, rules]);

  const hasRequiredMarks = examType === 'semester'
    ? (internalMarks !== '' && targetMark !== '' && parseInt(targetMark) >= effectiveMinTarget)
    : (targetMark !== '');

  const canProceed = subject && !isComingSoon(subject) && hasRequiredMarks;

  const canGoToStep = useCallback((targetStep) => {
    if (targetStep <= step) return true;
    if (targetStep === 1 && scheme) return true;
    if (targetStep === 2 && scheme && dept) return true;
    if (targetStep === 3 && scheme && dept && semester) return true;
    if (targetStep === 4 && subject && !isComingSoon(subject)) return true;
    return false;
  }, [step, scheme, dept, semester, subject]);

  const goToStep = useCallback((t) => { if (canGoToStep(t)) setStep(t); }, [canGoToStep]);

  // BUG 18 FIX: upstream changes reset downstream
  const handleSchemeSelect = useCallback((s) => {
    setScheme(s); setDept(''); setSemester(''); setSubject('');
    setInternalMarks(''); setTargetMark(''); setStep(1);
  }, []);

  const handleDeptSelect = useCallback((d) => {
    setDept(d); setSemester(''); setSubject('');
    setInternalMarks(''); setTargetMark(''); setStep(2);
  }, []);

  const handleSemesterSelect = useCallback((s) => {
    setSemester(s); setSubject('');
    setInternalMarks(''); setTargetMark(''); setStep(3);
  }, []);

  const handleSubjectSelect = useCallback((s) => {
    if (isComingSoon(s)) return;
    setSubject(s); setStep(4);
  }, []);

  const handleLaunch = useCallback(() => {
    if (!canProceed) return;
    onStartStudy({ scheme, dept, semester, subject, examType, internalMarks: examType === 'semester' ? internalMarks : '', targetMark });
  }, [canProceed, onStartStudy, scheme, dept, semester, subject, examType, internalMarks, targetMark]);

  const targetPresets = useMemo(() => {
    const base = [
      effectiveMinTarget,
      Math.round(rules.externalMax * 0.5),
      Math.round(rules.externalMax * 0.7),
      rules.externalMax,
    ];
    return [...new Set(base)].sort((a, b) => a - b);
  }, [rules, effectiveMinTarget]);

  // Auto-clear target ONLY when internal marks change (not while typing target)
  // Uses ref to track previous effectiveMinTarget to avoid clearing during typing
  const prevMinTargetRef = useRef(effectiveMinTarget);
  useEffect(() => {
    if (prevMinTargetRef.current !== effectiveMinTarget) {
      prevMinTargetRef.current = effectiveMinTarget;
      if (targetMark !== '' && parseInt(targetMark) < effectiveMinTarget) {
        setTargetMark('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveMinTarget]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#04050a' }}>
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" /><div className="aurora-orb aurora-orb-3" />
      </div>
      <div className="noise-overlay" aria-hidden="true" />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top nav */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4"
          style={{ background: 'rgba(4,5,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl" style={{ background: 'linear-gradient(135deg,#7c9eff,#a78bfa)' }}>
              <Telescope className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <span className="font-black text-base md:text-lg" style={{ color: '#e2e8f0' }}>ATLAS</span>
              <span className="text-xs font-bold ml-2 hidden sm:inline" style={{ color: '#64748b' }}>KTU Vault Pro</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {bookmarksCount > 0 && (
              <motion.button type="button" onClick={onShowBookmarks} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full min-h-[40px]"
                style={{ background: 'rgba(240,201,135,0.08)', border: '1px solid rgba(240,201,135,0.2)' }}
                aria-label={`${bookmarksCount} bookmarks`}>
                <Bookmark className="w-3.5 h-3.5" style={{ color: '#f0c987' }} />
                <span className="text-[11px] font-black" style={{ color: '#f0c987' }}>{bookmarksCount}</span>
              </motion.button>
            )}
            {providerInfo && (
              <motion.button type="button" onClick={onChangeAPI} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full min-h-[40px]"
                style={{ background: 'rgba(124,158,255,0.08)', border: '1px solid rgba(124,158,255,0.2)' }}
                aria-label="Change AI provider">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#86dfba', boxShadow: '0 0 6px #86dfba' }} />
                <span className="text-sm">{providerInfo.icon}</span>
                <span className="text-[11px] font-black hidden sm:block" style={{ color: '#7c9eff' }}>{providerInfo.name}</span>
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-black mb-2" style={{ color: '#e2e8f0' }}>
              What are you{' '}
              <span style={{ background: 'linear-gradient(135deg,#7c9eff,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>studying today?</span>
            </h1>
            <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>Select your subject in 5 steps — ATLAS does the rest</p>
          </motion.div>

          {/* Step indicators */}
          <div className="flex items-center space-x-1 md:space-x-2 mb-6 md:mb-8 overflow-x-auto pb-1 max-w-full" role="tablist">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <button type="button" role="tab" aria-selected={step === s.id}
                  onClick={() => goToStep(s.id)} disabled={!canGoToStep(s.id)}
                  className="flex items-center space-x-1 md:space-x-1.5 px-2 md:px-3 py-1.5 rounded-xl transition-all flex-shrink-0 min-h-[44px] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: step === s.id ? 'rgba(124,158,255,0.2)' : i < step ? 'rgba(134,223,186,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${step === s.id ? 'rgba(124,158,255,0.5)' : i < step ? 'rgba(134,223,186,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  {i < step ? <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" style={{ color: '#86dfba' }} />
                    : <s.icon className="w-3 h-3 md:w-3.5 md:h-3.5" style={{ color: step === s.id ? '#a5b4fc' : '#334155' }} />}
                  <span className="text-[10px] md:text-[11px] font-black"
                    style={{ color: step === s.id ? '#a5b4fc' : i < step ? '#86dfba' : '#334155' }}>{s.label}</span>
                </button>
                {i < steps.length - 1 && <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#334155' }} />}
              </React.Fragment>
            ))}
          </div>

          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="scheme" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <div className="text-center mb-6">
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Step 1 of 5</p>
                    <h2 className="text-xl md:text-2xl font-black" style={{ color: '#e2e8f0' }}>Select Your Scheme</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['2024','2019'].map(s => (
                      <motion.button key={s} type="button" onClick={() => handleSchemeSelect(s)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="p-6 md:p-8 rounded-3xl text-center transition-all min-h-[120px]"
                        style={{
                          background: scheme === s ? 'linear-gradient(135deg,rgba(124,158,255,0.2),rgba(167,139,250,0.15))' : 'rgba(255,255,255,0.03)',
                          border: `2px solid ${scheme === s ? 'rgba(124,158,255,0.5)' : 'rgba(255,255,255,0.07)'}`,
                          boxShadow: scheme === s ? '0 0 30px rgba(124,158,255,0.2)' : 'none',
                        }} aria-pressed={scheme === s}>
                        <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: scheme === s ? '#a5b4fc' : '#334155' }}>{s}</div>
                        <div className="text-sm font-bold" style={{ color: scheme === s ? '#7c9eff' : '#94a3b8' }}>KTU Scheme</div>
                        <div className="text-[11px] mt-2 font-medium" style={{ color: scheme === s ? '#a78bfa' : '#334155' }}>
                          {SCHEME_RULES[s]?.note?.slice(0,60) || (s === '2024' ? 'Ext: 60 · Pass: 50 total' : 'Ext: 100 · Pass: 75 total')}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="dept" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <div className="text-center mb-6">
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Step 2 of 5</p>
                    <h2 className="text-xl md:text-2xl font-black" style={{ color: '#e2e8f0' }}>Select Department</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {depts.map(d => (
                      <motion.button key={d} type="button" onClick={() => handleDeptSelect(d)}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="p-4 md:p-5 rounded-2xl text-left transition-all min-h-[80px]"
                        style={{
                          background: dept === d ? 'linear-gradient(135deg,rgba(124,158,255,0.2),rgba(167,139,250,0.1))' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${dept === d ? 'rgba(124,158,255,0.5)' : 'rgba(255,255,255,0.07)'}`,
                        }} aria-pressed={dept === d}>
                        <GraduationCap className="w-5 h-5 mb-2" style={{ color: dept === d ? '#a5b4fc' : '#334155' }} />
                        <div className="text-sm font-black" style={{ color: dept === d ? '#a5b4fc' : '#94a3b8' }}>{d}</div>
                        <div className="text-[11px] font-medium mt-0.5" style={{ color: dept === d ? '#a78bfa' : '#334155' }}>{deptNames[d] || d}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="sem" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <div className="text-center mb-6">
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Step 3 of 5</p>
                    <h2 className="text-xl md:text-2xl font-black" style={{ color: '#e2e8f0' }}>Select Semester</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {semesters.map(s => (
                      <motion.button key={s} type="button" onClick={() => handleSemesterSelect(s)}
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="p-4 md:p-5 rounded-2xl text-center transition-all min-h-[80px]"
                        style={{
                          background: semester === s ? 'rgba(124,158,255,0.2)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${semester === s ? 'rgba(124,158,255,0.5)' : 'rgba(255,255,255,0.07)'}`,
                        }} aria-pressed={semester === s}>
                        <div className="text-xl md:text-2xl font-black mb-1" style={{ color: semester === s ? '#a5b4fc' : '#334155' }}>{s.replace('S','')}</div>
                        <div className="text-[11px] font-bold" style={{ color: semester === s ? '#a78bfa' : '#334155' }}>{s}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="subject" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <div className="text-center mb-6">
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Step 4 of 5</p>
                    <h2 className="text-xl md:text-2xl font-black" style={{ color: '#e2e8f0' }}>Select Subject</h2>
                  </div>
                  <div className="space-y-2 max-h-72 md:max-h-80 overflow-y-auto">
                    {subjects.map(s => {
                      const cs = isComingSoon(s); const det = subjectDetails[s] || {}; const isDraw = isDrawingSubject(s);
                      return (
                        <motion.button key={s} type="button" onClick={() => handleSubjectSelect(s)} disabled={cs}
                          whileHover={{ scale: cs ? 1 : 1.01 }} whileTap={{ scale: cs ? 1 : 0.99 }}
                          className="w-full text-left px-4 md:px-5 py-3 md:py-4 rounded-2xl transition-all min-h-[60px]"
                          style={{
                            background: subject === s ? 'linear-gradient(135deg,rgba(124,158,255,0.2),rgba(167,139,250,0.1))' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${subject === s ? 'rgba(124,158,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                            cursor: cs ? 'not-allowed' : 'pointer', opacity: cs ? 0.4 : 1,
                          }} aria-pressed={subject === s} aria-disabled={cs}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black truncate" style={{ color: subject === s ? '#c4b5fd' : '#94a3b8' }}>{s}</p>
                              {det.pyq && !cs && <p className="text-[10px] mt-0.5 truncate" style={{ color: '#64748b' }}>{det.pyq.slice(0,55)}...</p>}
                            </div>
                            <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                              {cs && <span className="text-[10px] font-black" style={{ color: '#334155' }}>🔒 SOON</span>}
                              {isDraw && !cs && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.1)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.2)' }}>📐</span>}
                              {det.isNumerical && !cs && <span className="atlas-tag atlas-tag-amber">NUM</span>}
                              {subject === s && <CheckCircle className="w-4 h-4" style={{ color: '#7c9eff' }} />}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div key="exam" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <div className="text-center mb-6">
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Step 5 of 5</p>
                    <h2 className="text-xl md:text-2xl font-black" style={{ color: '#e2e8f0' }}>Exam Type &amp; Target</h2>
                    {subject && <p className="text-[12px] font-bold mt-1" style={{ color: '#7c9eff' }}>{subject.split('-')[0].trim()}</p>}
                  </div>
                  <div className="space-y-4 md:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[{ id: 'semester', label: '📋 Semester Exam', desc: 'ESE / End Sem · KTU official' },
                        { id: 'internal', label: '📝 Internal Exam', desc: 'Series / CIE · Teacher set' }].map(et => (
                        <button key={et.id} type="button" onClick={() => setExamType(et.id)}
                          className="p-4 md:p-5 rounded-2xl text-left transition-all min-h-[80px]"
                          style={{
                            background: examType === et.id ? 'rgba(124,158,255,0.15)' : 'rgba(255,255,255,0.02)',
                            border: `2px solid ${examType === et.id ? 'rgba(124,158,255,0.5)' : 'rgba(255,255,255,0.06)'}`,
                          }} aria-pressed={examType === et.id}>
                          <p className="text-sm font-black mb-1" style={{ color: examType === et.id ? '#a5b4fc' : '#94a3b8' }}>{et.label}</p>
                          <p className="text-[11px]" style={{ color: examType === et.id ? '#a78bfa' : '#334155' }}>{et.desc}</p>
                        </button>
                      ))}
                    </div>

                    {examType === 'internal' && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl"
                        style={{ background: 'rgba(240,201,135,0.07)', border: '1px solid rgba(240,201,135,0.25)' }}>
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#f0c987' }} />
                          <div>
                            <p className="text-xs font-black mb-1" style={{ color: '#f0c987' }}>Internal Exam Notice</p>
                            <p className="text-[12px] font-medium leading-relaxed" style={{ color: 'rgba(240,201,135,0.85)' }}>
                              Internal exams are set by your professor. Use ATLAS as a concept guide.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {examType === 'semester' && (
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: '#94a3b8' }}>
                          Your Internal / CE Marks <span style={{ color: '#e8a598' }}>*</span>
                        </label>
                        <input type="number" placeholder={`0–${rules.internalMax}`} min="0" max={rules.internalMax}
                          value={internalMarks} onChange={e => setInternalMarks(e.target.value)}
                          className="w-full atlas-input rounded-2xl px-4 py-3 text-sm font-medium" style={{ color: '#e2e8f0' }} />
                        {internalMarks !== '' && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-[11px] font-bold mt-1.5 ml-1"
                            style={{ color: (parseInt(internalMarks) + rules.minExternal) >= rules.minTotal ? '#86dfba' : '#e8a598' }}>
                            {(parseInt(internalMarks) + rules.minExternal) >= rules.minTotal
                              ? `✓ Safe zone! You only need ${rules.minExternal} in semester.`
                              : `⚠ Need ${calcMinExternalNeeded(internalMarks, scheme)} in semester exam (not just ${rules.minExternal}).`}
                          </motion.p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-black uppercase tracking-widest block mb-2" style={{ color: '#94a3b8' }}>
                        {examType === 'semester'
                          ? <>Target External Marks <span style={{ color: '#e8a598' }}>*</span> (min {effectiveMinTarget}, max {rules.externalMax})</>
                          : <>Target Marks <span style={{ color: '#e8a598' }}>*</span></>}
                      </label>
                      <input type="number"
                        placeholder={examType === 'semester' ? `${effectiveMinTarget}–${rules.externalMax}` : 'Enter target'}
                        min={examType === 'semester' ? effectiveMinTarget : undefined}
                        max={examType === 'semester' ? rules.externalMax : undefined}
                        value={targetMark} onChange={e => setTargetMark(e.target.value)}
                        className="w-full atlas-input rounded-2xl px-4 py-3 text-sm font-medium" style={{ color: '#e2e8f0' }} />
                      {examType === 'semester' && targetMark !== '' && parseInt(targetMark) < effectiveMinTarget && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-[11px] font-bold mt-1.5 ml-1" style={{ color: '#e8a598' }}>
                          ⚠ Target must be at least {effectiveMinTarget} to pass with internal {internalMarks || 0}
                        </motion.p>
                      )}
                      {examType === 'semester' && (
                        <div className="flex gap-2 mt-2">
                          {targetPresets.map(t => (
                            <button key={t} type="button" onClick={() => setTargetMark(String(t))}
                              className="flex-1 py-1.5 rounded-xl text-[11px] font-black transition-all min-h-[40px]"
                              style={{
                                background: targetMark === String(t) ? 'rgba(124,158,255,0.2)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${targetMark === String(t) ? 'rgba(124,158,255,0.5)' : 'rgba(255,255,255,0.07)'}`,
                                color: targetMark === String(t) ? '#a5b4fc' : '#64748b',
                              }}>{t}</button>
                          ))}
                        </div>
                      )}
                    </div>

                    {!hasRequiredMarks && subject && !isComingSoon(subject) && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-2xl"
                        style={{ background: 'rgba(232,165,152,0.08)', border: '1px solid rgba(232,165,152,0.25)' }}>
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#e8a598' }} />
                          <p className="text-[12px] font-bold" style={{ color: '#e8a598' }}>
                            {examType === 'semester'
                              ? (internalMarks !== '' && targetMark !== '' && parseInt(targetMark) < effectiveMinTarget)
                                ? `Target must be at least ${effectiveMinTarget} marks to pass.`
                                : 'Both Internal Marks and Target Marks are required to proceed.'
                              : 'Target Marks is required to proceed.'}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <motion.button type="button" onClick={handleLaunch} disabled={!canProceed}
                      whileHover={{ scale: canProceed ? 1.02 : 1 }} whileTap={{ scale: 0.97 }}
                      className="w-full btn-primary rounded-2xl py-4 px-6 flex items-center justify-center space-x-3 font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed min-h-[56px]"
                      style={{ color: '#ffffff' }}>
                      <BookOpen className="w-5 h-5" />
                      <span>Start Studying{subject ? ` — ${subject.split('-')[0].trim()}` : ''}</span>
                      <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step > 0 && (
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={() => setStep(p => p - 1)}
              className="mt-6 flex items-center space-x-2 text-sm font-bold min-h-[44px]" style={{ color: '#64748b' }}>
              <ArrowLeft className="w-4 h-4" /><span>Back</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECTION 38 — STUDY SCREEN
// ============================================================

function StudyScreen({ config, callAI, aiConfig, onBack, onRevision, onChangeAPI, onShowBookmarks, bookmarksCount, bookmarksHook }) {
  const { scheme, subject, examType, internalMarks, targetMark } = config;

  const allQuestions = useMemo(() => {
    const details = subjectDetails[subject] || {};
    const pyqs    = details.exactPyqs || {};
    const isDraw  = isDrawingSubject(subject);
    const r       = getSchemeRules(scheme);
    if (isDraw) {
      return [
        ...(pyqs.partA_3Marks || []).map((q,i) => ({ id:`A-${i}`, text:typeof q==='object'?q.q:q, marks:typeof q==='object'?(q.marks||15):15, module:typeof q==='object'?(q.module||1):1, freq:typeof q==='object'?(q.freq||2):2, partType:'A' })),
        ...(pyqs.partB_Detailed || []).map((q,i) => ({ id:`B-${i}`, text:typeof q==='object'?q.q:q, marks:typeof q==='object'?(q.marks||15):15, module:typeof q==='object'?(q.module||1):1, freq:typeof q==='object'?(q.freq||2):2, partType:'B' })),
      ].sort((a,b)=>(b.freq||2)-(a.freq||2));
    }
    const dBm = r.partB?.marksEach || (scheme==='2024'?9:14);
    const partA = (pyqs.partA_3Marks||[]).map((q,i)=>({ id:`A-${i}`, text:typeof q==='object'?q.q:q, marks:typeof q==='object'?(q.marks||3):3, module:typeof q==='object'?(q.module||1):1, freq:typeof q==='object'?(q.freq||2):2, partType:'A' })).sort((a,b)=>(b.freq||2)-(a.freq||2));
    const partB = (pyqs.partB_Detailed||[]).map((q,i)=>({ id:`B-${i}`, text:typeof q==='object'?q.q:q, marks:typeof q==='object'?(q.marks||dBm):dBm, module:typeof q==='object'?(q.module||1):1, freq:typeof q==='object'?(q.freq||2):2, partType:'B' })).sort((a,b)=>(b.freq||2)-(a.freq||2));
    return [...partA,...partB];
  }, [subject, scheme]);

  const isDrawing = useMemo(() => isDrawingSubject(subject), [subject]);
  const [runtimeTargetMark] = useState(targetMark || '');
  const [studiedIds, setStudiedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('A');
  const [selectedModules, setSelectedModules] = useState([]);
  const [focusMins, setFocusMins] = useState(25);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [showCIE, setShowCIE] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const scrollPosRef = useRef(0);

  const targetStrategy = useMemo(() => {
    if (!runtimeTargetMark) return null;
    return calculateTargetStrategy(allQuestions, runtimeTargetMark, scheme, isDrawing);
  }, [allQuestions, runtimeTargetMark, scheme, isDrawing]);

  const isTargetMode = !!targetStrategy;
  const modules = useMemo(() => [...new Set(allQuestions.map(q => q.module))].sort(), [allQuestions]);

  const visibleQuestions = useMemo(() => {
    let qs;
    if (isTargetMode) qs = allQuestions.filter(q => targetStrategy.mustStudyIds.has(q.id));
    else if (isDrawing) qs = [...allQuestions];
    else qs = allQuestions.filter(q => q.partType === activeTab);
    if (selectedModules.length > 0) qs = qs.filter(q => selectedModules.includes(q.module));
    return [...qs].sort((a,b)=>(b.freq||2)-(a.freq||2));
  }, [allQuestions, activeTab, selectedModules, isDrawing, isTargetMode, targetStrategy]);

  const studiedQuestions = useMemo(() => allQuestions.filter(q => studiedIds.has(q.id)), [allQuestions, studiedIds]);
  const toggleStudied = useCallback(id => { setStudiedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }, []);

  const handleFocusToggle = useCallback(() => {
    if (!focusMode) scrollPosRef.current = window.scrollY;
    setFocusMode(p => !p);
    if (focusMode) requestAnimationFrame(() => window.scrollTo(0, scrollPosRef.current));
  }, [focusMode]);

  const providerInfo = aiConfig ? AI_PROVIDERS.find(p => p.id === aiConfig.provider) : null;
  const details = subjectDetails[subject] || {};
  const partAQs = allQuestions.filter(q => q.partType === 'A');
  const partBQs = allQuestions.filter(q => q.partType === 'B');
  const studiedA = partAQs.filter(q => studiedIds.has(q.id)).length;
  const studiedB = partBQs.filter(q => studiedIds.has(q.id)).length;

  return (
    <div className={`min-h-screen relative overflow-x-hidden ${focusMode ? 'focus-mode' : ''}`} style={{ background: '#04050a' }}>
      <div className="aurora-bg" aria-hidden="true"><div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" /><div className="aurora-orb aurora-orb-3" /></div>
      <div className="noise-overlay" aria-hidden="true" />
      <ReadingProgressBar />
      <AnimatePresence>{showChatbot && <Chatbot isOpen={showChatbot} onClose={() => { setShowChatbot(false); setChatContext(null); }} subject={subject} scheme={scheme} callAI={callAI} initialContext={chatContext} />}</AnimatePresence>
      <AnimatePresence>{showCIE && <CIETrackerPanel onClose={() => setShowCIE(false)} scheme={scheme} />}</AnimatePresence>
      <AnimatePresence>{showScheduler && <SchedulerPanel onClose={() => setShowScheduler(false)} callAI={callAI} scheme={scheme} />}</AnimatePresence>
      <AnimatePresence>{showTarget && <TargetStrategistPanel onClose={() => setShowTarget(false)} questions={allQuestions} scheme={scheme} internalMarks={internalMarks} isDrawing={isDrawing} />}</AnimatePresence>
      <FloatingTimer focusMins={focusMins} onFocusMinsChange={setFocusMins} />

      <div className="relative z-10 max-w-4xl mx-auto px-3 md:px-4 pb-32">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 py-2 md:py-3" style={{ background: 'rgba(4,5,10,0.92)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button type="button" onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold min-h-[44px]" style={{ color: '#94a3b8' }} aria-label="Back to dashboard">
              <ArrowLeft className="w-4 h-4" /><span className="hidden sm:block">Dashboard</span>
            </button>
            <div className="flex items-center space-x-1.5 flex-wrap gap-1">
              {[
                { icon: Target, label: 'Target', onClick: () => setShowTarget(true), color: '#a5b4fc', active: isTargetMode },
                { icon: GraduationCap, label: 'CIE', onClick: () => setShowCIE(true), color: '#86dfba' },
                { icon: Calendar, label: 'Plan', onClick: () => setShowScheduler(true), color: '#f0c987' },
                { icon: MessageCircle, label: 'Tutor', onClick: () => setShowChatbot(true), color: '#c4b5fd' },
                { icon: Focus, label: 'Focus', onClick: handleFocusToggle, color: focusMode ? '#86dfba' : '#94a3b8', active: focusMode },
              ].map(btn => (
                <motion.button key={btn.label} type="button" onClick={btn.onClick}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1 md:space-x-1.5 px-2 md:px-2.5 py-1.5 rounded-xl text-[11px] md:text-[12px] font-bold min-h-[40px]"
                  style={{ background: btn.active ? 'rgba(124,158,255,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${btn.active ? 'rgba(124,158,255,0.35)' : 'rgba(255,255,255,0.08)'}`, color: btn.color }}
                  aria-label={btn.label} aria-pressed={!!btn.active}>
                  <btn.icon className="w-3.5 h-3.5" /><span className="hidden sm:block">{btn.label}</span>
                </motion.button>
              ))}
              {bookmarksCount > 0 && (
                <motion.button type="button" onClick={onShowBookmarks} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl min-h-[40px]"
                  style={{ background: 'rgba(240,201,135,0.08)', border: '1px solid rgba(240,201,135,0.2)' }}>
                  <Bookmark className="w-3.5 h-3.5" style={{ color: '#f0c987' }} />
                  <span className="text-[11px] font-black" style={{ color: '#f0c987' }}>{bookmarksCount}</span>
                </motion.button>
              )}
              {providerInfo && (
                <motion.button type="button" onClick={onChangeAPI} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full min-h-[40px]"
                  style={{ background: 'rgba(124,158,255,0.08)', border: '1px solid rgba(124,158,255,0.2)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#86dfba', boxShadow: '0 0 6px #86dfba' }} />
                  <span className="text-sm">{providerInfo.icon}</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4 mt-2">
          <div className="glass-panel rounded-3xl p-4 md:p-5 relative overflow-hidden">
            <div className="accent-bar-left" />
            <div className="pl-3 md:pl-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-xl font-black mb-1 truncate" style={{ color: '#e2e8f0' }}>{subject.split('-').slice(1).join('-').trim() || subject}</h2>
                  <p className="text-[12px] font-bold" style={{ color: '#94a3b8' }}>{subject.split('-')[0].trim()}</p>
                  <div className="flex items-center space-x-2 mt-2 flex-wrap gap-1.5">
                    <span className="atlas-tag atlas-tag-indigo">{scheme}</span>
                    <span className="atlas-tag" style={{ background: examType==='internal'?'rgba(240,201,135,0.1)':'rgba(134,223,186,0.1)', border: examType==='internal'?'1px solid rgba(240,201,135,0.3)':'1px solid rgba(134,223,186,0.3)', color: examType==='internal'?'#f0c987':'#86dfba' }}>
                      {examType==='internal'?'Internal':'Semester'}
                    </span>
                    {isDrawing && <span className="atlas-tag" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#c4b5fd' }}>📐 Drawing</span>}
                    {runtimeTargetMark && <span className="atlas-tag atlas-tag-amber">🎯 Target: {runtimeTargetMark}</span>}
                    {isTargetMode && <span className="atlas-tag atlas-tag-green">★ {targetStrategy.totalMustStudy} Questions</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl md:text-2xl font-black" style={{ color: '#e2e8f0' }}>
                    {studiedIds.size}/{isTargetMode ? targetStrategy.totalMustStudy : allQuestions.length}
                  </div>
                  <div className="text-[10px] font-bold uppercase" style={{ color: '#64748b' }}>Done</div>
                  {studiedIds.size >= 1 && (
                    <motion.button type="button" onClick={() => onRevision(studiedQuestions)}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="mt-2 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold btn-primary min-h-[40px]" style={{ color: '#ffffff' }}>
                      <BookMarked className="w-3 h-3" /><span>Revise ({studiedIds.size})</span>
                    </motion.button>
                  )}
                </div>
              </div>
              {details.pyq && !focusMode && (
                <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(240,201,135,0.06)', border: '1px solid rgba(240,201,135,0.15)' }}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#f0c987' }}>💡 Exam Insight</p>
                  <p className="text-[12px] font-medium leading-relaxed" style={{ color: '#94a3b8' }}>{details.pyq}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {!focusMode && <ScoreTracker questions={allQuestions} studiedIds={studiedIds} internalMarks={internalMarks} scheme={scheme} isDrawing={isDrawing} />}

        {isTargetMode && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-2xl p-4"
            style={{ background: 'rgba(134,223,186,0.07)', border: '1px solid rgba(134,223,186,0.25)' }}>
            <p className="text-xs font-black mb-1" style={{ color: '#86dfba' }}>🎯 Target Mode Active — Showing ONLY the {targetStrategy.totalMustStudy} questions needed to score {runtimeTargetMark} marks</p>
            <p className="text-[11px] leading-relaxed" style={{ color: '#94a3b8' }}>
              Guaranteed <span className="font-black" style={{ color: '#f0c987' }}>{targetStrategy.guaranteedMarks} marks</span> · Avg confidence: <span className="font-black" style={{ color: '#7c9eff' }}>{targetStrategy.avgConfidence}%</span>
            </p>
          </motion.div>
        )}

        {details.formulas?.length > 0 && !focusMode && (
          <div className="glass-panel rounded-2xl p-4 mb-4">
            <div className="flex items-center space-x-2 mb-3"><Hash className="w-4 h-4" style={{ color: '#a78bfa' }} /><span className="text-sm font-black" style={{ color: '#e2e8f0' }}>Key Formulas</span></div>
            <div className="flex flex-wrap gap-2">{details.formulas.map((f,i) => <div key={i} className="formula-box text-xs md:text-sm">{f}</div>)}</div>
          </div>
        )}

        {modules.length > 1 && (
          <div className="mb-4 overflow-x-auto pb-1">
            <div className="flex flex-nowrap gap-2 min-w-max md:flex-wrap md:min-w-0" role="group">
              <button type="button" onClick={() => setSelectedModules([])}
                className="px-3 py-1.5 rounded-xl text-[11px] font-black transition-all min-h-[40px]"
                style={{ background: selectedModules.length===0?'rgba(124,158,255,0.2)':'rgba(255,255,255,0.03)', border:`1px solid ${selectedModules.length===0?'rgba(124,158,255,0.5)':'rgba(255,255,255,0.07)'}`, color: selectedModules.length===0?'#a5b4fc':'#64748b' }}
                aria-pressed={selectedModules.length===0}>All</button>
              {modules.map(m => (
                <button key={m} type="button" onClick={() => setSelectedModules(p => p.includes(m)?p.filter(x=>x!==m):[...p,m])}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-black transition-all min-h-[40px]"
                  style={{ background: selectedModules.includes(m)?'rgba(124,158,255,0.2)':'rgba(255,255,255,0.03)', border:`1px solid ${selectedModules.includes(m)?'rgba(124,158,255,0.5)':'rgba(255,255,255,0.07)'}`, color: selectedModules.includes(m)?'#a5b4fc':'#64748b' }}
                  aria-pressed={selectedModules.includes(m)}>M{m}</button>
              ))}
            </div>
          </div>
        )}

        {!isDrawing && !isTargetMode && (
          <div className="flex space-x-2 mb-4" role="tablist">
            {[{ id:'A', label:'Part A', sub:`${studiedA}/${partAQs.length} studied` },{ id:'B', label:'Part B', sub:`${studiedB}/${partBQs.length} studied` }].map(tab => (
              <button key={tab.id} type="button" role="tab" aria-selected={activeTab===tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-3 px-3 md:px-4 rounded-2xl transition-all text-left min-h-[56px]"
                style={{ background: activeTab===tab.id?'linear-gradient(135deg,rgba(124,158,255,0.2),rgba(167,139,250,0.15))':'rgba(255,255,255,0.02)', border:`1px solid ${activeTab===tab.id?'rgba(124,158,255,0.45)':'rgba(255,255,255,0.06)'}` }}>
                <p className="text-sm font-black" style={{ color: activeTab===tab.id?'#a5b4fc':'#94a3b8' }}>{tab.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: activeTab===tab.id?'#a78bfa':'#64748b' }}>{tab.sub}</p>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-3 mb-4 px-1 flex-wrap gap-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>Probability:</span>
          {[{ label:'🔥 HIGH', color:'#86dfba', conf:'80–95%' },{ label:'⚡ MED', color:'#f0c987', conf:'65%' },{ label:'📌 LOW', color:'#94a3b8', conf:'45%' }].map(p => (
            <span key={p.label} className="text-[10px] font-black" style={{ color: p.color }}>{p.label} ({p.conf})</span>
          ))}
        </div>

        <div className="space-y-4 md:space-y-5">
          {visibleQuestions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 glass-panel rounded-3xl">
              <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: '#334155' }} />
              <p className="font-bold" style={{ color: '#64748b' }}>No questions for selected filter.</p>
              <button type="button" onClick={() => setSelectedModules([])} className="mt-3 text-sm font-bold underline min-h-[44px] flex items-center mx-auto" style={{ color: '#7c9eff' }}>Clear filters</button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {visibleQuestions.map(q => (
                <QuestionCard key={q.id} question={q} isStudied={studiedIds.has(q.id)} onToggle={() => toggleStudied(q.id)}
                  onAskChatbot={ctx => { setChatContext(ctx); setShowChatbot(true); }}
                  subject={subject} scheme={scheme} callAI={callAI}
                  isBookmarked={bookmarksHook.isBookmarked(q.id)} onBookmark={bookmarksHook.toggleBookmark} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {studiedIds.size >= 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <motion.button type="button" onClick={() => onRevision(studiedQuestions)}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full btn-primary rounded-2xl py-4 flex items-center justify-center space-x-2 font-bold min-h-[56px]" style={{ color: '#ffffff' }}>
              <Repeat className="w-5 h-5" /><span>Revise {studiedIds.size} Studied Topics</span>
              <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}><ArrowRight className="w-5 h-5" /></motion.div>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SECTION 39 — REVISION SCREEN
// ============================================================

function RevisionScreen({ studiedQuestions, subject, onBack, callAI, scheme }) {
  const [revTime, setRevTime] = useState('');
  const [started, setStarted] = useState(false);
  const [revContent, setRevContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const ragRef = useRef(null); const abortRef = useRef(false); const progRef = useRef(0);
  const details = subjectDetails[subject] || {};
  const cleanup = useCallback(() => { if (ragRef.current) { clearInterval(ragRef.current); ragRef.current = null; } }, []);
  useEffect(() => () => { abortRef.current = true; cleanup(); }, [cleanup]);

  const startRevision = useCallback(async () => {
    if (!callAI) { setError('AI not connected.'); return; }
    abortRef.current = false; setLoading(true); setError(''); setPhase(0); setProgress(0); progRef.current = 0; cleanup();
    ragRef.current = setInterval(() => {
      if (abortRef.current) return;
      progRef.current = Math.min(progRef.current + 0.6, 92);
      setProgress(Math.round(progRef.current));
      setPhase(Math.min(Math.floor((progRef.current / 100) * (RAG_PHASES.length - 1)), RAG_PHASES.length - 1));
    }, 120);
    const ragCtx = buildRAGContext(subject, scheme);
    const prompt = `${ragCtx}\n\nCreate a COMPLETE revision guide.\nSubject: ${subject} | Scheme: ${scheme} | Time: ${sanitizeUserInput(revTime)}\nQuestions Studied:\n${studiedQuestions.map((q,i) => `${i+1}. [M${q.module||''}][${q.marks}m] ${q.text}`).join('\n')}\n\n## Quick Reference\n## Question-by-Question Key Points\n## Time Strategy for ${sanitizeUserInput(revTime)}\n## Last Minute Checklist\nKeep concise.`;
    try {
      const res = await callAI(prompt);
      if (abortRef.current) return; cleanup(); setProgress(100); setRevContent(res); setStarted(true);
    } catch (err) {
      if (abortRef.current) return; cleanup(); setError(err.message || 'Failed.');
    } finally { if (!abortRef.current) setLoading(false); }
  }, [callAI, subject, scheme, revTime, studiedQuestions, cleanup]);

  const currentPhase = RAG_PHASES[Math.min(phase, RAG_PHASES.length - 1)];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#04050a' }}>
      <div className="aurora-bg" aria-hidden="true"><div className="aurora-orb aurora-orb-1" /><div className="aurora-orb aurora-orb-2" /><div className="aurora-orb aurora-orb-3" /></div>
      <div className="noise-overlay" aria-hidden="true" /><ReadingProgressBar />
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-6 md:mb-8">
          <button type="button" onClick={onBack} className="flex items-center space-x-2 text-sm font-semibold min-h-[44px]" style={{ color: '#94a3b8' }}>
            <ArrowLeft className="w-4 h-4" /><span>Back</span>
          </button>
          <div className="flex items-center space-x-2">
            <BookMarked className="w-5 h-5" style={{ color: '#7c9eff' }} />
            <span className="font-black text-sm md:text-base" style={{ color: '#e2e8f0' }}>Revision Mode</span>
            <span className="atlas-tag atlas-tag-green">{studiedQuestions.length} topics</span>
          </div>
        </motion.div>

        {!started ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: '#e2e8f0' }}>Let's Revise! 🚀</h1>
              <p className="text-sm" style={{ color: '#94a3b8' }}>{studiedQuestions.length} questions · AI creates your plan</p>
            </div>
            <div className="glass-panel rounded-3xl p-4 md:p-6 mb-5">
              <h2 className="text-sm font-black mb-3" style={{ color: '#e2e8f0' }}>Topics You Studied</h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {studiedQuestions.map((q,i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 rounded-xl" style={{ background: 'rgba(134,223,186,0.05)', border: '1px solid rgba(134,223,186,0.12)' }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#86dfba' }} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-relaxed" style={{ color: '#e2e8f0' }}>{q.text}</p>
                      <div className="flex space-x-2 mt-0.5 flex-wrap gap-1">
                        <span className="text-[10px] font-black" style={{ color: '#86dfba' }}>{q.marks}m</span>
                        {q.module && <span className="text-[10px] font-black" style={{ color: '#7c9eff' }}>M{q.module}</span>}
                        <span className="text-[10px] font-black" style={{ color: freqToBadge(q.freq||2).color }}>{freqToConfidence(q.freq||2)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {details.formulas?.length > 0 && (
              <div className="glass-panel rounded-3xl p-4 md:p-5 mb-5">
                <h2 className="text-sm font-black mb-3" style={{ color: '#e2e8f0' }}>Key Formulas</h2>
                <div className="space-y-2">{details.formulas.map((f,i) => <div key={i} className="formula-box text-xs md:text-sm">{f}</div>)}</div>
              </div>
            )}
            <div className="glass-panel rounded-3xl p-4 md:p-5 mb-5">
              <label className="text-[11px] font-black uppercase tracking-widest block mb-3" style={{ color: '#94a3b8' }}>Time Available</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['15 minutes','30 minutes','1 hour'].map(t => (
                  <button key={t} type="button" onClick={() => setRevTime(t)}
                    className="py-2.5 rounded-2xl text-xs font-bold transition-all min-h-[44px]"
                    style={{ background: revTime===t?'rgba(124,158,255,0.2)':'rgba(255,255,255,0.03)', border:`1px solid ${revTime===t?'rgba(124,158,255,0.5)':'rgba(255,255,255,0.07)'}`, color: revTime===t?'#a5b4fc':'#64748b' }}
                    aria-pressed={revTime===t}>{t}</button>
                ))}
              </div>
              <input type="text" placeholder="Or custom (e.g. 45 minutes)" value={revTime} onChange={e => setRevTime(e.target.value)} maxLength={50}
                className="w-full atlas-input rounded-2xl px-4 py-3 text-sm font-medium" style={{ color: '#e2e8f0' }} />
            </div>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 rounded-xl"
                style={{ background: 'rgba(232,165,152,0.08)', border: '1px solid rgba(232,165,152,0.25)' }}>
                <p className="text-[12px] font-medium" style={{ color: '#e8a598' }}>{error}</p>
                <button type="button" onClick={() => { setError(''); startRevision(); }} className="mt-1.5 text-[11px] font-bold underline min-h-[32px]" style={{ color: '#a5b4fc' }}>↻ Retry</button>
              </motion.div>
            )}
            {loading ? (
              <div className="rounded-2xl p-5" style={{ background: 'rgba(124,158,255,0.06)', border: '1px solid rgba(124,158,255,0.2)' }}>
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Brain className="w-5 h-5" style={{ color: '#7c9eff' }} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.p key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-[11px] font-medium truncate" style={{ color: '#7c9eff' }}>
                      {currentPhase.icon} {currentPhase.label}
                    </motion.p>
                  </div>
                  <span className="text-[11px] font-black" style={{ color: '#a78bfa' }}>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,158,255,0.1)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#7c9eff,#a78bfa)' }} animate={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <motion.button type="button" onClick={startRevision} disabled={!revTime.trim()}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full btn-primary rounded-2xl py-4 flex items-center justify-center space-x-2 font-bold disabled:opacity-40 min-h-[44px]" style={{ color: '#ffffff' }}>
                <Repeat className="w-5 h-5" /><span>Start AI Revision</span>
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-panel rounded-2xl p-3 md:p-4 mb-5 flex items-center space-x-4 flex-wrap gap-2">
              <Clock className="w-4 h-4" style={{ color: '#7c9eff' }} />
              <span className="text-xs font-black" style={{ color: '#94a3b8' }}>{revTime}</span>
              <span className="text-xs font-black ml-auto" style={{ color: '#86dfba' }}>{studiedQuestions.length} topics</span>
              <button type="button" onClick={() => { setStarted(false); setRevContent(''); setError(''); progRef.current = 0; }}
                className="text-[11px] font-bold underline min-h-[44px] flex items-center" style={{ color: '#a5b4fc' }}>Change time</button>
            </div>
            <div className="glass-panel rounded-3xl p-5 md:p-7"><AIResultRenderer content={revContent} /></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SECTION 40 — ERROR BOUNDARY
// ============================================================

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error) {
    const safeMsg = String(error?.message || 'Unknown error')
      .replace(/sk-[a-zA-Z0-9\-_]+/g, 'sk-***').replace(/AIza[a-zA-Z0-9_-]+/g, 'AIza***')
      .replace(/AQ\.[a-zA-Z0-9_-]+/g, 'AQ.***').replace(/nvapi-[a-zA-Z0-9_-]+/g, 'nvapi-***')
      .replace(/gsk_[a-zA-Z0-9_-]+/g, 'gsk_***').replace(/xai-[a-zA-Z0-9_-]+/g, 'xai-***')
      .replace(/Bearer\s+[a-zA-Z0-9_\-.]+/g, 'Bearer ***');
    console.error('ATLAS ErrorBoundary:', safeMsg);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#04050a' }} role="alert">
          <div className="text-center max-w-md">
            <div className="mb-6 p-4 rounded-2xl inline-block" style={{ background: 'rgba(232,165,152,0.1)', border: '1px solid rgba(232,165,152,0.3)' }}>
              <AlertCircle className="w-10 h-10" style={{ color: '#e8a598' }} />
            </div>
            <h1 className="text-2xl font-black mb-2" style={{ color: '#e2e8f0' }}>Something went wrong</h1>
            <p className="text-sm mb-2" style={{ color: '#94a3b8' }}>ATLAS encountered an unexpected error. Your bookmarks are safe.</p>
            <p className="text-[12px] font-mono mb-6 break-all" style={{ color: 'rgba(232,165,152,0.7)' }}>
              {String(this.state.error?.message || 'Unknown error').slice(0, 200)}
            </p>
            <button type="button" onClick={() => window.location.reload()}
              className="btn-primary rounded-2xl py-3 px-8 font-bold flex items-center space-x-2 mx-auto min-h-[44px]" style={{ color: '#ffffff' }}>
              <RefreshCw className="w-4 h-4" /><span>Reload ATLAS</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// SECTION 41 — ROOT APP
// BUG 17 FIX: session restore validates adapter exists
// ============================================================

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => { apiClient.abortAll(); });
}

function AppInner() {
  const [screen, setScreen] = useState('reconnecting');
  const [aiConfig, setAiConfig] = useState(null);
  const [studyConfig, setStudyConfig] = useState(null);
  const [studiedForRevision, setStudiedForRevision] = useState([]);
  const [showChangeAPI, setShowChangeAPI] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bootError, setBootError] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [switchToast, setSwitchToast] = useState({ show: false, from: null, to: null });
  const quoteTimerRef = useRef(null);
  const bookmarksHook = useBookmarks();

  // BUG 17 FIX: validate saved provider has a known adapter/config
  useEffect(() => {
    let saved = null;
    try { saved = SecureStorage.load(STORAGE_KEY); } catch (_) { SecureStorage.clearAll(); }

    if (!saved || typeof saved !== 'object' || !saved.apiKey || typeof saved.apiKey !== 'string' || saved.apiKey.trim().length < 4) {
      setScreen('welcome');
      return;
    }

    // BUG 17 FIX: check that saved provider is still a known provider
    const knownProvider = saved.provider && (
      AI_PROVIDERS.some(p => p.id === saved.provider) ||
      saved.provider === 'gemini_express' ||
      saved.provider === 'custom'
    );

    // Retired models (e.g. gemini-2.0-flash-exp) must never be trusted from storage —
    // they cause the exact "model not found for API version v1beta" generation failure.
    const modelDeprecated = describeModelStatus(saved.provider, saved.model) === 'deprecated';

    if (saved.provider && saved.model && knownProvider && !modelDeprecated) {
      setAiConfig({
        provider: saved.provider, apiKey: saved.apiKey, model: saved.model,
        customBaseUrl: saved.customBaseUrl || '', detectedName: saved.detectedName || '',
      });
      setScreen('dashboard');
      return;
    }

    // Re-verify if provider unknown, model retired, or config incomplete
    setScreen('reconnecting');
    const providerId    = saved.provider || detectProviderByPrefix(saved.apiKey);
    const providerToUse = (providerId && providerId !== 'unknown') ? providerId : null;

    universalVerify(saved.apiKey, providerToUse, saved.customBaseUrl || '')
      .then(result => {
        setAiConfig({
          provider: result.provider, apiKey: saved.apiKey,
          model: result.model || saved.model || '',
          customBaseUrl: result.customBaseUrl || saved.customBaseUrl || '',
          detectedName: result.detectedName || saved.detectedName || '',
        });
        setScreen('dashboard');
      })
      .catch(() => {
        // If the ONLY problem was a retired model, fall back to the safe default
        // (generation self-heals from there) instead of logging the user out.
        if (modelDeprecated) {
          setAiConfig({
            provider: saved.provider, apiKey: saved.apiKey, model: GEMINI_MODEL,
            customBaseUrl: saved.customBaseUrl || '', detectedName: saved.detectedName || '',
          });
          setScreen('dashboard');
          return;
        }
        SecureStorage.clearAll();
        setBootError('Session expired or key is no longer valid. Please re-enter your API key.');
        setScreen('boot');
      });
  }, []);

  useEffect(() => {
    if (quoteTimerRef.current) { clearTimeout(quoteTimerRef.current); quoteTimerRef.current = null; }
    if (screen !== 'study') return;
    const scheduleNext = () => {
      const delay = (30 + Math.random() * 10) * 60 * 1000;
      quoteTimerRef.current = setTimeout(() => { setShowQuote(true); scheduleNext(); }, delay);
    };
    scheduleNext();
    return () => { if (quoteTimerRef.current) { clearTimeout(quoteTimerRef.current); quoteTimerRef.current = null; } };
  }, [screen]);

  const callAI = useMemo(() => {
    if (!aiConfig) return null;
    return makeCallAI(aiConfig.provider, aiConfig.apiKey, aiConfig.model, aiConfig.customBaseUrl || '');
  }, [aiConfig]);

  useEffect(() => {
    if (import.meta.env?.DEV) {
      console.info('[ATLAS] AI health:', buildAIHealthReport(aiConfig));
    }
  }, [aiConfig]);

  const handleChangeAPI = useCallback(() => setShowChangeAPI(true), []);

  const handleAPIUpdate = useCallback((newConfig) => {
    if (newConfig && typeof newConfig === 'object') {
      const oldProvider = aiConfig?.provider || null;
      const newProvider = newConfig.provider;
      if (oldProvider && oldProvider !== newProvider) {
        setSwitchToast({ show: true, from: oldProvider, to: newProvider });
        conversationManager.setMigrating(true);
        setTimeout(() => conversationManager.setMigrating(false), 2500);
      }
      apiClient.abortAll();
      clearGeminiHealCache();
      setAiConfig(newConfig);
      setShowChangeAPI(false);
    } else {
      SecureStorage.clearAll(); conversationManager.clear(); apiClient.abortAll(); rateLimiter.clear(); clearGeminiHealCache();
      setAiConfig(null); setStudyConfig(null); setStudiedForRevision([]); setShowChangeAPI(false); setScreen('boot');
    }
  }, [aiConfig]);

  return (
    <>
      <ProviderSwitchToast show={switchToast.show} fromProvider={switchToast.from} toProvider={switchToast.to}
        onComplete={() => setSwitchToast({ show: false, from: null, to: null })} />
      <AnimatePresence>{showQuote && <QuotePopup onDismiss={() => setShowQuote(false)} />}</AnimatePresence>

      <AnimatePresence mode="wait">
        {screen === 'reconnecting' && (
          <motion.div key="reconnecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReconnectScreen />
          </motion.div>
        )}
        {screen === 'welcome' && (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
            <WelcomeScreen onContinue={() => setScreen('boot')} />
          </motion.div>
        )}
        {screen === 'boot' && (
          <motion.div key="boot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <BootScreen initialError={bootError} onBoot={cfg => { setBootError(''); setAiConfig(cfg); setScreen('dashboard'); }} />
          </motion.div>
        )}
        {screen === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <DashboardScreen
              onStartStudy={cfg => { setStudyConfig(cfg); setScreen('study'); }}
              aiConfig={aiConfig} onChangeAPI={handleChangeAPI}
              onShowBookmarks={() => setShowBookmarks(true)} bookmarksCount={bookmarksHook.bookmarks.length} />
          </motion.div>
        )}
        {screen === 'study' && studyConfig && callAI && (
          <motion.div key="study" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <StudyScreen config={studyConfig} callAI={callAI} aiConfig={aiConfig}
              onBack={() => setScreen('dashboard')}
              onRevision={qs => { setStudiedForRevision(qs); setScreen('revision'); }}
              onChangeAPI={handleChangeAPI} onShowBookmarks={() => setShowBookmarks(true)}
              bookmarksCount={bookmarksHook.bookmarks.length} bookmarksHook={bookmarksHook} />
          </motion.div>
        )}
        {screen === 'revision' && studyConfig && callAI && studiedForRevision.length > 0 && (
          <motion.div key="revision" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RevisionScreen studiedQuestions={studiedForRevision} subject={studyConfig.subject}
              scheme={studyConfig.scheme} callAI={callAI} onBack={() => setScreen('study')} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChangeAPI && <ChangeAPIPanel currentConfig={aiConfig} onClose={() => setShowChangeAPI(false)} onUpdate={handleAPIUpdate} />}
      </AnimatePresence>
      <AnimatePresence>
        {showBookmarks && <BookmarksPanel onClose={() => setShowBookmarks(false)} bookmarks={bookmarksHook.bookmarks}
          onRemove={bookmarksHook.toggleBookmark} onClearAll={bookmarksHook.clearAll} />}
      </AnimatePresence>
    </>
  );
}

// ============================================================
// SECTION 42 — DEFAULT EXPORT
// ============================================================

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}