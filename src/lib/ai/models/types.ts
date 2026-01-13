/**
 * Chat model types
 * 
 * Models use the format: provider/model-name
 * Examples: openai/gpt-4o, anthropic/claude-3-5-sonnet-20241022, google/gemini-1.5-pro
 */

export type Provider = "openai" | "anthropic" | "google";

export type ModelId = 
  // OpenAI
  | "openai/gpt-4o"
  | "openai/gpt-4o-mini"
  | "openai/gpt-4-turbo"
  | "openai/gpt-4"
  | "openai/gpt-3.5-turbo"
  // Anthropic
  | "anthropic/claude-3-5-sonnet-20241022"
  | "anthropic/claude-3-5-haiku-20241022"
  | "anthropic/claude-3-opus-20240229"
  | "anthropic/claude-3-sonnet-20240229"
  | "anthropic/claude-3-haiku-20240307"
  // Google
  | "google/gemini-1.5-pro"
  | "google/gemini-1.5-flash"
  | "google/gemini-pro";

export interface ModelInfo {
  id: ModelId;
  provider: Provider;
  name: string;
  description?: string;
  maxTokens?: number;
  supportsSystemPrompt?: boolean;
}

/**
 * Extract provider from model ID
 */
export function getProviderFromModel(modelId: ModelId): Provider {
  const [provider] = modelId.split("/");
  return provider as Provider;
}

/**
 * Get model name without provider prefix
 */
export function getModelName(modelId: ModelId): string {
  const [, ...nameParts] = modelId.split("/");
  return nameParts.join("/");
}

export const MODELS: Record<ModelId, ModelInfo> = {
  // OpenAI
  "openai/gpt-4o": {
    id: "openai/gpt-4o",
    provider: "openai",
    name: "GPT-4o",
    description: "Most capable model, optimized for speed",
    maxTokens: 128000,
    supportsSystemPrompt: true,
  },
  "openai/gpt-4o-mini": {
    id: "openai/gpt-4o-mini",
    provider: "openai",
    name: "GPT-4o Mini",
    description: "Fast and affordable, great for most tasks",
    maxTokens: 128000,
    supportsSystemPrompt: true,
  },
  "openai/gpt-4-turbo": {
    id: "openai/gpt-4-turbo",
    provider: "openai",
    name: "GPT-4 Turbo",
    description: "High performance with extended context",
    maxTokens: 128000,
    supportsSystemPrompt: true,
  },
  "openai/gpt-4": {
    id: "openai/gpt-4",
    provider: "openai",
    name: "GPT-4",
    description: "Original GPT-4 model",
    maxTokens: 8192,
    supportsSystemPrompt: true,
  },
  "openai/gpt-3.5-turbo": {
    id: "openai/gpt-3.5-turbo",
    provider: "openai",
    name: "GPT-3.5 Turbo",
    description: "Fast and cost-effective",
    maxTokens: 16385,
    supportsSystemPrompt: true,
  },
  // Anthropic
  "anthropic/claude-3-5-sonnet-20241022": {
    id: "anthropic/claude-3-5-sonnet-20241022",
    provider: "anthropic",
    name: "Claude 3.5 Sonnet",
    description: "Best balance of intelligence and speed",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  "anthropic/claude-3-5-haiku-20241022": {
    id: "anthropic/claude-3-5-haiku-20241022",
    provider: "anthropic",
    name: "Claude 3.5 Haiku",
    description: "Fastest model, great for simple tasks",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  "anthropic/claude-3-opus-20240229": {
    id: "anthropic/claude-3-opus-20240229",
    provider: "anthropic",
    name: "Claude 3 Opus",
    description: "Most capable model",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  "anthropic/claude-3-sonnet-20240229": {
    id: "anthropic/claude-3-sonnet-20240229",
    provider: "anthropic",
    name: "Claude 3 Sonnet",
    description: "Balanced performance",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  "anthropic/claude-3-haiku-20240307": {
    id: "anthropic/claude-3-haiku-20240307",
    provider: "anthropic",
    name: "Claude 3 Haiku",
    description: "Fast and efficient",
    maxTokens: 200000,
    supportsSystemPrompt: true,
  },
  // Google
  "google/gemini-1.5-pro": {
    id: "google/gemini-1.5-pro",
    provider: "google",
    name: "Gemini 1.5 Pro",
    description: "Most capable Gemini model",
    maxTokens: 1000000,
    supportsSystemPrompt: true,
  },
  "google/gemini-1.5-flash": {
    id: "google/gemini-1.5-flash",
    provider: "google",
    name: "Gemini 1.5 Flash",
    description: "Fast and efficient",
    maxTokens: 1000000,
    supportsSystemPrompt: true,
  },
  "google/gemini-pro": {
    id: "google/gemini-pro",
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

/**
 * Check if a model ID is valid
 */
export function isValidModelId(modelId: string): modelId is ModelId {
  return modelId in MODELS;
}
