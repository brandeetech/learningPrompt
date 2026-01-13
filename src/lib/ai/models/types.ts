/**
 * Chat model types
 */

import type { Provider } from "../providers/types";

export type ModelId = 
  // OpenAI
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-4-turbo"
  | "gpt-4"
  | "gpt-3.5-turbo"
  // Anthropic
  | "claude-3-5-sonnet-20241022"
  | "claude-3-5-haiku-20241022"
  | "claude-3-opus-20240229"
  | "claude-3-sonnet-20240229"
  | "claude-3-haiku-20240307"
  // Google
  | "gemini-1.5-pro"
  | "gemini-1.5-flash"
  | "gemini-pro";

export interface ModelInfo {
  id: ModelId;
  provider: Provider;
  name: string;
  description?: string;
  maxTokens?: number;
  supportsSystemPrompt?: boolean;
}

export const MODELS: Record<ModelId, ModelInfo> = {
  // OpenAI
  "gpt-4o": {
    id: "gpt-4o",
    provider: "openai",
    name: "GPT-4o",
    description: "Most capable model, optimized for speed",
    maxTokens: 128000,
    supportsSystemPrompt: true,
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    provider: "openai",
    name: "GPT-4o Mini",
    description: "Fast and affordable, great for most tasks",
    maxTokens: 128000,
    supportsSystemPrompt: true,
  },
  "gpt-4-turbo": {
    id: "gpt-4-turbo",
    provider: "openai",
    name: "GPT-4 Turbo",
    description: "High performance with extended context",
    maxTokens: 128000,
    supportsSystemPrompt: true,
  },
  "gpt-4": {
    id: "gpt-4",
    provider: "openai",
    name: "GPT-4",
    description: "Original GPT-4 model",
    maxTokens: 8192,
    supportsSystemPrompt: true,
  },
  "gpt-3.5-turbo": {
    id: "gpt-3.5-turbo",
    provider: "openai",
    name: "GPT-3.5 Turbo",
    description: "Fast and cost-effective",
    maxTokens: 16385,
    supportsSystemPrompt: true,
  },
  // Anthropic
  "claude-3-5-sonnet-20241022": {
    id: "claude-3-5-sonnet-20241022",
    provider: "anthropic",
    name: "Claude 3.5 Sonnet",
    description: "Best balance of intelligence and speed",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  "claude-3-5-haiku-20241022": {
    id: "claude-3-5-haiku-20241022",
    provider: "anthropic",
    name: "Claude 3.5 Haiku",
    description: "Fastest model, great for simple tasks",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  "claude-3-opus-20240229": {
    id: "claude-3-opus-20240229",
    provider: "anthropic",
    name: "Claude 3 Opus",
    description: "Most capable model",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  "claude-3-sonnet-20240229": {
    id: "claude-3-sonnet-20240229",
    provider: "anthropic",
    name: "Claude 3 Sonnet",
    description: "Balanced performance",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  "claude-3-haiku-20240307": {
    id: "claude-3-haiku-20240307",
    provider: "anthropic",
    name: "Claude 3 Haiku",
    description: "Fast and efficient",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  // Google
  "gemini-1.5-pro": {
    id: "gemini-1.5-pro",
    provider: "google",
    name: "Gemini 1.5 Pro",
    description: "Most capable Gemini model",
    maxTokens: 1000000,
    supportsSystemPrompt: true,
  },
  "gemini-1.5-flash": {
    id: "gemini-1.5-flash",
    provider: "google",
    name: "Gemini 1.5 Flash",
    description: "Fast and efficient",
    maxTokens: 1000000,
    supportsSystemPrompt: true,
  },
  "gemini-pro": {
    id: "gemini-pro",
    provider: "google",
    name: "Gemini Pro",
    description: "Standard Gemini model",
    maxTokens: 30720,
    supportsSystemPrompt: true,
  },
};

export function getModelInfo(modelId: string): ModelInfo | null {
  return MODELS[modelId as ModelId] || null;
}

export function getModelsByProvider(provider: Provider): ModelInfo[] {
  return Object.values(MODELS).filter((model) => model.provider === provider);
}
