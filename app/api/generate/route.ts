import { NextResponse } from "next/server";
import { generateText } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const { systemPrompt, userMessage, model = "openai/gpt-4o-mini" } = await request.json();

    if (!userMessage) {
      return NextResponse.json(
        { error: "userMessage is required" },
        { status: 400 }
      );
    }

    const output = await generateText(
      userMessage,
      model,
      {
        system: systemPrompt,
        temperature: 0.7,
      }
    );

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error("[Generate API] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate output" },
      { status: 500 }
    );
  }
}
