import type { ProviderClient, ChatMessage, ChatCompletionOptions, ChatCompletionResponse } from "./types";

export interface GoogleConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
}

const DEFAULT_MODEL = "gemini-1.5-flash";
const DEFAULT_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export class GoogleProvider implements ProviderClient {
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;

  constructor(config: GoogleConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.defaultModel = config.defaultModel || DEFAULT_MODEL;
  }

  async chat(
    messages: ChatMessage[],
    options?: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    const model = options?.model || this.defaultModel;
    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;

    // Google Gemini uses a different message format
    // System message becomes part of generation config
    const systemMessage = messages.find((msg) => msg.role === "system");
    const conversationMessages = messages.filter((msg) => msg.role !== "system");

    const contents = conversationMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        systemInstruction: systemMessage
          ? {
              parts: [{ text: systemMessage.content }],
            }
          : undefined,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      content,
      model: model,
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount || 0,
            completionTokens: data.usageMetadata.candidatesTokenCount || 0,
            totalTokens: data.usageMetadata.totalTokenCount || 0,
          }
        : undefined,
    };
  }

  getAvailableModels(): string[] {
    return [
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-pro",
    ];
  }
}
