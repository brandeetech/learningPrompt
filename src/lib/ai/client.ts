/**
 * AI Client using Vercel AI SDK
 * 
 * All API calls use the Vercel AI SDK with configured models
 */

import { streamText, generateObject as generateObjectSDK } from "ai";
import type { ModelId } from "./models/types";
import type { z } from "zod";

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

/**
 * Generate structured object completion using Zod schema
 */
export async function generateObject<T extends z.ZodTypeAny>(
  prompt: string,
  schema: T,
  modelId: ModelId = "openai/gpt-4o-mini",
  options?: {
    system?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<z.infer<T>> {
  const result = await generateObjectSDK({
    model: modelId,
    system: options?.system,
    prompt,
    schema,
    temperature: options?.temperature ?? 0.7,
    ...(options?.maxTokens && { maxTokens: options.maxTokens }),
  });
  return result.object as z.infer<T>;
}
