import { NextResponse } from "next/server";
import { upsertPromptWithVersion } from "@/lib/db/prompts";
import { insertUsage } from "@/lib/db/usage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, model, tokensUsed, title, userId } = body || {};
    if (!prompt || !model || !tokensUsed) {
      return NextResponse.json(
        { ok: false, message: "prompt, model, tokensUsed required" },
        { status: 400 }
      );
    }

    const result = await upsertPromptWithVersion({
      userId,
      title,
      content: prompt,
      model,
      tokensUsed,
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, prompt: result.prompt, version: result.version });
  } catch (error) {
    console.error("runs POST error", error);
    return NextResponse.json(
        { ok: false, message: "Unexpected error" },
        { status: 500 }
      );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { model, tokensUsed, userId } = body || {};
    if (!model || !tokensUsed) {
      return NextResponse.json(
        { ok: false, message: "model and tokensUsed required" },
        { status: 400 }
      );
    }
    const result = await insertUsage({ model, tokensUsed, userId });
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("runs PUT error", error);
    return NextResponse.json({ ok: false, message: "Unexpected error" }, { status: 500 });
  }
}
