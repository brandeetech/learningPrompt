/**
 * Provider types and interfaces
 */

export type Provider = "openai" | "anthropic" | "google";

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ProviderClient {
  chat(messages: ChatMessage[], options?: ChatCompletionOptions): Promise<ChatCompletionResponse>;
  getAvailableModels(): string[];
}
