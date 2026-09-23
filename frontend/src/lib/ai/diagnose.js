// ============================================================
// ATLAS — AI HEALTH / DIAGNOSTICS
// Non-secret diagnostic report for the active AI configuration.
// Never includes API keys or tokens.
// ============================================================

import {
  GEMINI_API_VERSION,
  GEMINI_MODEL,
  geminiModelsUrl,
  isRetiredGeminiModel,
} from './config.js';

export function describeModelStatus(provider, model) {
  if (provider === 'gemini' || provider === 'gemini_express') {
    if (!model) return 'not-configured';
    if (isRetiredGeminiModel(model)) return 'deprecated';
    return 'supported';
  }
  // OpenAI-compatible providers: only explicit retired list applies (always trust).
  return model ? 'supported' : 'not-configured';
}

export function buildAIHealthReport(config) {
  if (!config) {
    return {
      status: 'not-configured',
      provider: 'gemini',
      model: GEMINI_MODEL,
      sdk: 'REST',
      apiVersion: GEMINI_API_VERSION,
      generation: 'not-configured',
      modelListUrl: geminiModelsUrl(),
    };
  }

  const isGemini = config.provider === 'gemini' || config.provider === 'gemini_express';
  const model = config.model || GEMINI_MODEL;

  if (isGemini) {
    const retired = isRetiredGeminiModel(model);
    return {
      status: retired ? 'degraded' : 'ok',
      provider: 'Google Gemini',
      model,
      sdk: 'REST (raw /v1beta generateContent, no SDK bundle)',
      apiVersion: GEMINI_API_VERSION,
      generation: retired ? 'model-retired' : 'supported',
      defaultModel: GEMINI_MODEL,
      modelListUrl: geminiModelsUrl(),
    };
  }

  return {
    status: 'ok',
    provider: config.detectedName || config.provider,
    model,
    sdk: 'REST (OpenAI-compatible chat/completions)',
    apiVersion: 'chat/completions v1',
    generation: 'openai-compatible',
    defaultModel: GEMINI_MODEL,
    modelListUrl: null,
  };
}

export function formatHealthReportLine(report) {
  if (!report) return '';
  if (report.status === 'not-configured') return 'AI: not configured';
  return [
    `AI: ${report.provider}`,
    `model: ${report.model}`,
    `api: ${report.apiVersion}`,
    `sdk: ${report.sdk}`,
    `capability: ${report.generation}`,
    `status: ${report.status}`,
  ].join(' · ');
}