/**
 * AI Client using Vercel AI SDK
 * 
 * All API calls go through Vercel AI Gateway
 * The SDK automatically uses the gateway when deployed on Vercel
 */

import { streamText } from "ai";
import type { ModelId } from "./models/types";

/**
 * Stream text completion using Vercel AI SDK
 */
export async function streamTextCompletion(
  prompt: string,
  modelId: ModelId = "openai/gpt-4o-mini",
  options?: {
    system?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  return streamText({
    model: modelId,
    system: options?.system,
    prompt,
    temperature: options?.temperature ?? 0.7,
    ...(options?.maxTokens && { maxTokens: options.maxTokens }),
  });
}

/**
 * Generate text completion (non-streaming)
 */
export async function generateText(
  prompt: string,
  modelId: ModelId = "openai/gpt-4o-mini",
  options?: {
    system?: string;
    temperature?: number;
    maxTokens?: number;
  }
) {
  const result = await streamTextCompletion(prompt, modelId, options);
  const text = await result.text;
  return text;
}
