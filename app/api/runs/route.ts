import { NextResponse } from "next/server";
import { upsertPromptWithVersion } from "@/lib/db/prompts";
import { generatePromptName } from "@/lib/ai/prompts/nameGeneration";

export async function POST(request: Request) {
  const requestId = `runs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = performance.now();

  try {
    const body = await request.json();
    const { 
      prompt, 
      systemPrompt, 
      userMessage, 
      model, 
      tokensUsed, 
      title, 
      userId,
      intent,
      output,
      evaluationScore,
      evaluationData,
    } = body || {};
    
    // Use full prompt if provided, otherwise combine system + user message
    const fullPrompt = prompt || (systemPrompt ? `${systemPrompt}\n\n${userMessage}` : userMessage);
    
    console.log("[Runs API] Request received", {
      requestId,
      hasSystemPrompt: !!systemPrompt,
      hasUserMessage: !!userMessage,
      fullPromptLength: fullPrompt?.length || 0,
      model: model || "not provided",
      tokensUsed: tokensUsed || 0,
      hasTitle: !!title,
      hasUserId: !!userId,
      timestamp: new Date().toISOString(),
    });

    if (!fullPrompt || !model || !tokensUsed) {
      console.warn("[Runs API] Validation failed", {
        requestId,
        missingFields: {
          prompt: !fullPrompt,
          model: !model,
          tokensUsed: !tokensUsed,
        },
      });
      return NextResponse.json(
        { ok: false, message: "prompt (or userMessage), model, tokensUsed required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "userId required" },
        { status: 400 }
      );
    }

    // Generate a camelCase name for the prompt if title is not provided
    let promptTitle = title;
    if (!promptTitle) {
      try {
        promptTitle = await generatePromptName(fullPrompt, intent);
        console.log("[Runs API] Generated prompt name", {
          requestId,
          generatedName: promptTitle,
        });
      } catch (error) {
        console.error("[Runs API] Failed to generate name, using fallback", {
          requestId,
          error: error instanceof Error ? error.message : String(error),
        });
        promptTitle = `prompt${Date.now().toString(36)}`;
      }
    }

    const dbStartTime = performance.now();
    const result = await upsertPromptWithVersion({
      userId,
      title: promptTitle,
      content: fullPrompt,
      systemPrompt,
      userMessage,
      model,
      tokensUsed,
      intent,
      output,
      evaluationScore,
      evaluationData,
    });
    const dbDuration = performance.now() - dbStartTime;

    if (!result.ok) {
      console.error("[Runs API] Database operation failed", {
        requestId,
        error: result.message,
        dbDuration: `${dbDuration.toFixed(2)}ms`,
      });
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 500 }
      );
    }

    const totalDuration = performance.now() - startTime;

    console.log("[Runs API] Prompt saved successfully", {
      requestId,
      dbDuration: `${dbDuration.toFixed(2)}ms`,
      totalDuration: `${totalDuration.toFixed(2)}ms`,
      promptId: result.prompt?.id,
      versionId: result.version?.id,
      versionNumber: result.version?.versionNumber,
      model: result.version?.model,
      tokensUsed: result.version?.tokensUsed,
    });

    return NextResponse.json({ ok: true, prompt: result.prompt, version: result.version });
  } catch (error) {
    const totalDuration = performance.now() - startTime;
    console.error("[Runs API] Unexpected error", {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      totalDuration: `${totalDuration.toFixed(2)}ms`,
    });
    return NextResponse.json(
        { ok: false, message: "Unexpected error" },
        { status: 500 }
      );
  }
}

