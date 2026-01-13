# AI Library

Unified interface for interacting with multiple LLM providers (OpenAI, Anthropic, Google).

## Structure

```
lib/ai/
├── prompts/          # System prompts and templates
├── providers/        # Provider implementations
├── models/           # Model definitions
└── client.ts        # Main AI client
```

## Usage

### Basic Chat

```typescript
import { chat } from "@/lib/ai";

const response = await chat([
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "What is the capital of France?" }
], {
  model: "gpt-4o-mini",
  temperature: 0.7,
});

console.log(response.content);
console.log(response.usage?.totalTokens);
```

### Using the Client Directly

```typescript
import { getAIClient } from "@/lib/ai";

const client = getAIClient();

// Add custom API key
client.setProvider("openai", "your-api-key");

const response = await client.chat([
  { role: "user", content: "Hello!" }
], {
  model: "gpt-4o-mini",
});
```

### Using Custom Provider API Keys

```typescript
import { getAIClient } from "@/lib/ai";

const client = getAIClient();

// Use user's own API key
client.setProvider("anthropic", userApiKey);

const response = await client.chat([
  { role: "user", content: "Hello!" }
], {
  model: "claude-3-5-sonnet-20241022",
});
```

### Evaluation Prompt

```typescript
import { evaluationSystemPrompt, evaluationUserPrompt } from "@/lib/ai/prompts";
import { chat } from "@/lib/ai";

const response = await chat([
  { role: "system", content: evaluationSystemPrompt },
  { role: "user", content: evaluationUserPrompt(userPrompt, userIntent, 0) }
], {
  model: "gpt-4o-mini",
  temperature: 0.2,
});
```

### Get Available Models

```typescript
import { getModelsByProvider, getModelInfo } from "@/lib/ai/models";

// Get all OpenAI models
const openaiModels = getModelsByProvider("openai");

// Get model info
const modelInfo = getModelInfo("gpt-4o");
console.log(modelInfo?.name); // "GPT-4o"
console.log(modelInfo?.maxTokens); // 128000
```

## Providers

### OpenAI

- Models: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-4`, `gpt-3.5-turbo`
- API Key: `OPENAI_API_KEY`
- Base URL: `https://api.openai.com/v1`

### Anthropic

- Models: `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`, etc.
- API Key: `ANTHROPIC_API_KEY`
- Base URL: `https://api.anthropic.com/v1`

### Google

- Models: `gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-pro`
- API Key: `GOOGLE_API_KEY`
- Base URL: `https://generativelanguage.googleapis.com/v1beta`

## Configuration

Set environment variables:

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

## Error Handling

```typescript
import { chat } from "@/lib/ai";

try {
  const response = await chat([...], { model: "gpt-4o-mini" });
} catch (error) {
  if (error instanceof Error) {
    console.error("AI request failed:", error.message);
  }
}
```

## Token Usage

All responses include token usage information:

```typescript
const response = await chat([...], { model: "gpt-4o-mini" });

if (response.usage) {
  console.log(`Prompt tokens: ${response.usage.promptTokens}`);
  console.log(`Completion tokens: ${response.usage.completionTokens}`);
  console.log(`Total tokens: ${response.usage.totalTokens}`);
}
```
