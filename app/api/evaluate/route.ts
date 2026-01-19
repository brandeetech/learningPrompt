import { NextResponse } from "next/server";
import { evaluationSystemPrompt, buildEvaluationUserPrompt } from "@/lib/ai/prompts/evaluation";
import { evaluatePrompt } from "@/lib/promptEvaluator";

export async function POST(request: Request) {
  const requestId = `eval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = performance.now();

  try {
    const body = await request.json();
    const { prompt, previousIterations = 0, userIntent } = body || {};
    
    console.log("[Evaluate API] Request received", {
      requestId,
      promptLength: prompt?.length || 0,
      promptPreview: prompt?.substring(0, 100) + (prompt?.length > 100 ? "..." : "") || "none",
      previousIterations,
      hasUserIntent: !!userIntent,
      userIntentPreview: userIntent?.substring(0, 50) + (userIntent?.length > 50 ? "..." : "") || "none",
      timestamp: new Date().toISOString(),
    });

    if (!prompt) {
      console.warn("[Evaluate API] Validation failed: prompt required", { requestId });
      return NextResponse.json({ ok: false, message: "prompt required" }, { status: 400 });
    }

    const llmStartTime = performance.now();
    const userPrompt = buildEvaluationUserPrompt(prompt, userIntent, previousIterations);
    
    console.log("[Evaluate API] Requesting LLM evaluation", {
      requestId,
      model: "openai/gpt-4o-mini",
      userPromptLength: userPrompt.length,
      systemPromptLength: evaluationSystemPrompt.length,
      temperature: 0.2,
    });

    // Use evaluatePrompt which calls LLM via generateObject
    const evaluation = await evaluatePrompt(prompt, {
      previousIterations,
      userIntent,
      modelId: "openai/gpt-4o-mini",
    });

    const llmDuration = performance.now() - llmStartTime;
    const totalDuration = performance.now() - startTime;

    console.log("[Evaluate API] LLM evaluation completed", {
      requestId,
      llmDuration: `${llmDuration.toFixed(2)}ms`,
      totalDuration: `${totalDuration.toFixed(2)}ms`,
      overallScore: evaluation.score?.overall,
      stage: evaluation.stage,
      improvementsCount: evaluation.improvements.length,
    });

    return NextResponse.json(
      {
        ok: true,
        evaluation,
      },
      { status: 200 }
    );
  } catch (error) {
    const totalDuration = performance.now() - startTime;
    console.error("[Evaluate API] Error", {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      totalDuration: `${totalDuration.toFixed(2)}ms`,
    });
    return NextResponse.json({ ok: false, message: "Failed to evaluate prompt" }, { status: 500 });
  }
}
