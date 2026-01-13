import { NextResponse } from "next/server";
import { evaluatePrompt } from "@/lib/promptEvaluator";

const isGatewayEnabled = () => !!process.env.VERCEL_AI_GATEWAY_URL;

const rubricSystem = `
You are a prompt coach. Teach clarity, not grades.
Analyze the user's prompt using the rubric: intent clarity, context completeness, constraints, output format, scope control, reasoning steps, assumptions.
Respond with four sections in order:
1) What the prompt did.
2) Why that output would happen.
3) How to improve (1-3 bullets, each tied to the rubric).
4) Example rewrite (only after the above; keep brief).
Avoid numeric scores. Be concise and specific.
`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, previousIterations = 0, userIntent } = body || {};
    if (!prompt) {
      return NextResponse.json({ ok: false, message: "prompt required" }, { status: 400 });
    }

    const localEvaluation = evaluatePrompt(prompt, { previousIterations, userIntent });

    const gatewayUrl = process.env.VERCEL_AI_GATEWAY_URL;
    const auth = process.env.VERCEL_AI_GATEWAY_AUTH;

    if (isGatewayEnabled() && gatewayUrl && auth) {
      try {
        const completion = await fetch(gatewayUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: rubricSystem },
              {
                role: "user",
                content: `Prompt:\n${prompt}\n\nUser Intent: ${userIntent || "Not provided"}\n\nPrevious iterations: ${previousIterations}`,
              },
            ],
            temperature: 0.2,
          }),
        });

        if (!completion.ok) {
          const text = await completion.text();
          console.warn("Gateway completion failed", completion.status, text);
          throw new Error("Gateway request failed");
        }

        const json = await completion.json();
        const content = json.choices?.[0]?.message?.content as string | undefined;
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
        console.warn("Falling back to local evaluation", err);
      }
    }

    // Ensure evaluation has all required fields
    const fullEvaluation = evaluatePrompt(prompt, { previousIterations, userIntent });
    return NextResponse.json({ ok: true, via: "local", evaluation: fullEvaluation });
  } catch (error) {
    console.error("evaluate POST error", error);
    return NextResponse.json({ ok: false, message: "Unexpected error" }, { status: 500 });
  }
}
