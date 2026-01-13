export type PromptTemplate = {
  id: string;
  title: string;
  category: "summary" | "analysis" | "compare" | "extract" | "critique" | "writing";
  intent: string;
  prompt: string;
  whyItWorks: string;
};

export const promptTemplates: PromptTemplate[] = [
  {
    id: "summary",
    title: "Tidy Summary",
    category: "summary",
    intent: "Summarize with structure and transparency on unknowns.",
    prompt:
      "Summarize the following text for a business audience in 4 bullets + 1 risk. Include dates/regions if present; if unknown, say 'unknown'. Keep sentences under 18 words.\n\nText:\n{{insert text}}",
    whyItWorks:
      "Specifies audience, length, format, and how to handle unknowns—reduces drift and verbosity.",
  },
  {
    id: "analysis",
    title: "Explain a Decision",
    category: "analysis",
    intent: "Analyze a decision with context and counterpoints.",
    prompt:
      "You are an analyst. Explain the decision on {{topic}} for {{audience}}. Provide: 1) 3 key factors, 2) trade-offs, 3) 1 counterpoint, 4) what data is missing. Use bullets.",
    whyItWorks:
      "Breaks analysis into repeatable sections and asks for missing data, improving clarity and trust.",
  },
  {
    id: "compare",
    title: "Compare Options",
    category: "compare",
    intent: "Compare two options with constraints.",
    prompt:
      "Compare {{option A}} vs {{option B}} for {{audience}}. Create a 4-row table: criteria, why it matters, option A note, option B note. End with a short recommendation and 1 risk.",
    whyItWorks:
      "Forces a shared schema and keeps outputs scoped; makes trade-offs explicit instead of generic pros/cons.",
  },
  {
    id: "extract",
    title: "Structured Extraction",
    category: "extract",
    intent: "Extract structured data safely.",
    prompt:
      "Extract the required fields from the text. Respond in JSON only with keys: title, date, audience, actions[]. If a field is missing, set its value to null and note it in unknowns[].\n\nText:\n{{insert text}}",
    whyItWorks:
      "Defines schema, handling of unknowns, and discourages hallucination with explicit nulls.",
  },
  {
    id: "critique",
    title: "Critique and Improve",
    category: "critique",
    intent: "Critique content and propose concise fixes.",
    prompt:
      "Critique the following draft for clarity, completeness, and tone for {{audience}}. Return: 1) 3 issues, 2) 3 fixes, 3) a concise example rewrite (<=120 words). If context is missing, list the missing items first.\n\nDraft:\n{{insert draft}}",
    whyItWorks:
      "Separates critique from rewrite and caps length; keeps focus on the audience and missing context.",
  },
  {
    id: "writing",
    title: "Structured Writing Plan",
    category: "writing",
    intent: "Create a plan before writing.",
    prompt:
      "Before writing, create a plan for {{piece type}} for {{audience}}. Provide: 1) goal, 2) reader questions, 3) outline with bullet points, 4) voice/tone guide, 5) sources to verify. Keep it under 160 words.",
    whyItWorks:
      "Front-loads structure and verification before drafting, reducing rewrites and hallucination.",
  },
];
