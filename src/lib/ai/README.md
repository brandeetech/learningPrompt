# AI Library

Unified interface for interacting with multiple LLM providers via Vercel AI SDK and Gateway.

## Structure

```
lib/ai/
├── prompts/          # System prompts and templates
├── models/           # Model definitions
└── client.ts        # Main AI client using Vercel AI SDK
```

## Usage

### Basic Text Generation

```typescript
import { generateText } from "@/lib/ai/client";

const text = await generateText(
  "What is the capital of France?",
  "openai/gpt-4o-mini",
  {
    temperature: 0.7,
  }
);

console.log(text);
```

### Streaming Text

```typescript
import { streamTextCompletion } from "@/lib/ai/client";

const result = await streamTextCompletion(
  "Explain quantum computing",
  "openai/gpt-4o-mini",
  {
    system: "You are a helpful assistant.",
    temperature: 0.7,
  }
);

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

### Evaluation Prompt

```typescript
import { generateText } from "@/lib/ai/client";
import { evaluationSystemPrompt, buildEvaluationUserPrompt } from "@/lib/ai/prompts/evaluation";

const userPrompt = "Extract customer complaints";
const userIntent = "Get top 3 complaints from support tickets";

const evaluationText = buildEvaluationUserPrompt(userPrompt, userIntent, 0);
const feedback = await generateText(
  evaluationText,
  "openai/gpt-4o-mini",
  {
    system: evaluationSystemPrompt,
    temperature: 0.2,
  }
);
```

### Get Available Models

```typescript
import { getModelsByProvider, getModelInfo, getProviderFromModel } from "@/lib/ai/models";

// Get all OpenAI models
const openaiModels = getModelsByProvider("openai");

// Get model info
const modelInfo = getModelInfo("openai/gpt-4o");
console.log(modelInfo?.name); // "GPT-4o"
console.log(modelInfo?.maxTokens); // 128000

// Extract provider from model ID
const provider = getProviderFromModel("openai/gpt-4o-mini"); // "openai"
```

## Model Format

Models use the format: `provider/model-name`

Examples:
- `openai/gpt-4o`
- `openai/gpt-4o-mini`
- `anthropic/claude-3-5-sonnet-20241022`
- `google/gemini-1.5-pro`

## Configuration

All API calls are routed through the Vercel AI Gateway. Set environment variables:

```bash
VERCEL_AI_GATEWAY_URL=https://...
VERCEL_AI_GATEWAY_AUTH=Bearer ...
```

The gateway handles all provider API keys internally.

## Error Handling

```typescript
import { generateText } from "@/lib/ai/client";

try {
  const text = await generateText("Hello", "openai/gpt-4o-mini");
} catch (error) {
  if (error instanceof Error) {
    console.error("AI request failed:", error.message);
  }
}
```
