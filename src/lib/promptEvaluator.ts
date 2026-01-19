import { z } from "zod";
import { generateObject as generateObjectLLM } from "@/lib/ai/client";
import { evaluationSystemPrompt, buildEvaluationUserPrompt } from "@/lib/ai/prompts/evaluation";
import type { ModelId } from "@/lib/ai/models/types";

export type LearningStage =
  | "onboarding"
  | "fundamentals"
  | "structure"
  | "control"
  | "reflection";

export type EvaluationScore = {
  intentClarity: number; // 0-100
  contextCompleteness: number; // 0-100
  constraints: number; // 0-100
  outputFormat: number; // 0-100
  scopeControl: number; // 0-100
  overall: number; // 0-100, average of above
};

export type Evaluation = {
  whatHappened: string[];
  why: string[];
  improvements: string[];
  rewrite: string;
  missing: string[];
  stage: LearningStage;
  score: EvaluationScore;
  intentMatch: number; // 0-100, how well prompt matches user's stated intent, or -1 if no user intent provided
};

// Zod schema for structured LLM evaluation output
export const EvaluationScoreSchema = z.object({
  intentClarity: z.number().min(0).max(100).describe("Intent clarity score (0-100)"),
  contextCompleteness: z.number().min(0).max(100).describe("Context completeness score (0-100)"),
  constraints: z.number().min(0).max(100).describe("Constraints score (0-100)"),
  outputFormat: z.number().min(0).max(100).describe("Output format score (0-100)"),
  scopeControl: z.number().min(0).max(100).describe("Scope control score (0-100)"),
  overall: z.number().min(0).max(100).describe("Overall score (0-100), average of above"),
});

export const EvaluationSchema = z.object({
  whatHappened: z.array(z.string()).min(1).describe("What the prompt did - list of observations"),
  why: z.array(z.string()).min(1).describe("Why that output would happen - explanations"),
  improvements: z.array(z.string()).min(3).max(5).describe("How to improve - 3-5 specific, actionable improvements"),
  rewrite: z.string().min(1).describe("Complete, improved version of the prompt"),
  missing: z.array(z.string()).describe("Missing elements from the prompt"),
  stage: z.enum(["onboarding", "fundamentals", "structure", "control", "reflection"]).describe("Learning stage"),
  score: EvaluationScoreSchema.describe("Evaluation scores"),
  intentMatch: z.number().min(-1).max(100).describe("How well prompt matches user's stated intent (0-100). Always provide this field: use 0-100 if user intent is provided, or -1 if no user intent is provided"),
});

type EvaluateOptions = {
  previousIterations?: number;
  userIntent?: string; // User's stated intent to compare with prompt
};


function deriveStage(missing: string[], previousIterations = 0): LearningStage {
  if (previousIterations === 0) return "onboarding";
  if (missing.includes("context/examples")) return "fundamentals";
  if (missing.includes("output format") || missing.includes("constraints (tone/length/must-include)")) {
    return "structure";
  }
  if (missing.includes("scope control")) return "control";
  return previousIterations > 1 ? "reflection" : "control";
}

export async function evaluatePrompt(
  prompt: string,
  options: EvaluateOptions & { modelId?: ModelId } = {}
): Promise<Evaluation> {
  const userPrompt = buildEvaluationUserPrompt(prompt, options.userIntent, options.previousIterations);
  const modelId = options.modelId || "openai/gpt-4o-mini";

  // Call LLM to get structured evaluation
  const evaluation = await generateObjectLLM(
    userPrompt,
    EvaluationSchema,
    modelId,
    {
      system: evaluationSystemPrompt,
      temperature: 0.2,
    }
  );

  return evaluation;
}

export function estimateTokens(prompt: string) {
  const words = prompt.trim().split(/\s+/).filter(Boolean).length;
  const base = 120;
  return Math.max(base, Math.round(words * 1.4));
}
