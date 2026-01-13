/**
 * AI Client
 * 
 * Unified interface for interacting with different LLM providers
 */

import type { Provider, ChatMessage, ChatCompletionOptions, ChatCompletionResponse, ProviderClient } from "./providers/types";
import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";
import { GoogleProvider } from "./providers/google";
import { getModelInfo, type ModelId } from "./models";

export interface AIClientConfig {
  provider: Provider;
  model?: ModelId; // Override default model
}

export class AIClient {
  private providers: Map<Provider, ProviderClient> = new Map();

  constructor() {
    // Initialize providers with default API keys from environment variables
    if (process.env.OPENAI_API_KEY) {
      this.providers.set("openai", new OpenAIProvider({ apiKey: process.env.OPENAI_API_KEY }));
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set("anthropic", new AnthropicProvider({ apiKey: process.env.ANTHROPIC_API_KEY }));
    }
    if (process.env.GOOGLE_API_KEY) {
      this.providers.set("google", new GoogleProvider({ apiKey: process.env.GOOGLE_API_KEY }));
    }
  }


  /**
   * Get provider client for a given provider
   */
  private getProvider(provider: Provider): ProviderClient {
    const client = this.providers.get(provider);
    if (!client) {
      throw new Error(`Provider ${provider} is not configured. Please set the API key.`);
    }
    return client;
  }

  /**
   * Get provider from model ID
   */
  private getProviderFromModel(modelId: string): Provider {
    const modelInfo = getModelInfo(modelId);
    if (!modelInfo) {
      throw new Error(`Unknown model: ${modelId}`);
    }
    return modelInfo.provider;
  }

  /**
   * Chat completion
   */
  async chat(
    messages: ChatMessage[],
    config?: AIClientConfig & ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    let provider: Provider;
    let model: string | undefined;

    if (config?.model) {
      // Use model to determine provider
      const modelInfo = getModelInfo(config.model);
      if (!modelInfo) {
        throw new Error(`Unknown model: ${config.model}`);
      }
      provider = config.provider || modelInfo.provider;
      model = config.model;
    } else if (config?.provider) {
      provider = config.provider;
      model = config.model;
    } else {
      throw new Error("Either model or provider must be specified");
    }

    const providerClient = this.getProvider(provider);

    return providerClient.chat(messages, {
      model,
      temperature: config?.temperature,
      maxTokens: config?.maxTokens,
      stream: config?.stream,
    });
  }

  /**
   * Check if a provider is available
   */
  isProviderAvailable(provider: Provider): boolean {
    return this.providers.has(provider);
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): Provider[] {
    return Array.from(this.providers.keys());
  }
}

// Singleton instance
let aiClient: AIClient | null = null;

export function getAIClient(): AIClient {
  if (!aiClient) {
    aiClient = new AIClient();
  }
  return aiClient;
}

// Convenience function for quick chat
export async function chat(
  messages: ChatMessage[],
  config?: AIClientConfig & ChatCompletionOptions
): Promise<ChatCompletionResponse> {
  return getAIClient().chat(messages, config);
}
