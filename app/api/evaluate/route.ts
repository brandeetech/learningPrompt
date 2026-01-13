import { NextResponse } from "next/server";
import { evaluatePrompt } from "@/lib/promptEvaluator";
import { generateText } from "@/lib/ai/client";
import { evaluationSystemPrompt, buildEvaluationUserPrompt } from "@/lib/ai/prompts/evaluation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, previousIterations = 0, userIntent } = body || {};
    if (!prompt) {
      return NextResponse.json({ ok: false, message: "prompt required" }, { status: 400 });
    }

    const localEvaluation = evaluatePrompt(prompt, { previousIterations, userIntent });

    try {
      const userPrompt = buildEvaluationUserPrompt(prompt, userIntent, previousIterations);
      const content = await generateText(
        userPrompt,
        "openai/gpt-4o-mini",
        {
          system: evaluationSystemPrompt,
          temperature: 0.2,
        }
      );

      return NextResponse.json(
        {
          ok: true,
          via: "vercel-gateway",
          content,
          evaluation: localEvaluation,
        },
        { status: 200 }
      );
    } catch (err) {
      console.warn("Gateway evaluation failed, using local evaluation", err);
    }

    // Fallback to local evaluation
    const fullEvaluation = evaluatePrompt(prompt, { previousIterations, userIntent });
    return NextResponse.json({ ok: true, via: "local", evaluation: fullEvaluation });
  } catch (error) {
    console.error("evaluate POST error", error);
    return NextResponse.json({ ok: false, message: "Unexpected error" }, { status: 500 });
  }
}
