/**
 * System prompts for prompt evaluation
 */

export const evaluationSystemPrompt = `You are a prompt coach. Teach clarity, not grades.
Analyze the user's prompt using the rubric: intent clarity, context completeness, constraints, output format, scope control, reasoning steps, assumptions.
Respond with four sections in order:
1) What the prompt did.
2) Why that output would happen.
3) How to improve (1-3 bullets, each tied to the rubric).
4) Example rewrite (only after the above; keep brief).
Avoid numeric scores. Be concise and specific.`;

export const evaluationUserPrompt = (prompt: string, userIntent?: string, previousIterations?: number) => {
  const parts = [
    `Prompt:\n${prompt}`,
    userIntent ? `\nUser Intent: ${userIntent}` : "",
    previousIterations !== undefined ? `\n\nPrevious iterations: ${previousIterations}` : "",
  ].filter(Boolean);
  
  return parts.join("\n");
};
