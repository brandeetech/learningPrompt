/**
 * Generate a camelCase name for a prompt using LLM
 */

import { generateText } from "../client";

/**
 * Generate a simple camelCase name for a prompt based on its content
 */
export async function generatePromptName(
  prompt: string,
  intent?: string
): Promise<string> {
  try {
    const systemPrompt = `You are a naming assistant. Generate a short, descriptive camelCase name for a prompt based on its content. 
Rules:
- Use camelCase (first word lowercase, subsequent words capitalized)
- Keep it short (2-4 words max)
- Be descriptive but concise
- Use common programming/variable naming conventions
- Return ONLY the name, no explanation, no quotes, no extra text

Examples:
- "Extract customer complaints" → extractCustomerComplaints
- "Summarize meeting notes" → summarizeMeetingNotes
- "Compare two products" → compareProducts
- "Analyze sales data" → analyzeSalesData`;

    const userPrompt = intent
      ? `Intent: ${intent}\n\nPrompt: ${prompt.substring(0, 500)}`
      : `Prompt: ${prompt.substring(0, 500)}`;

    const name = await generateText(
      userPrompt,
      "openai/gpt-4o-mini",
      {
        system: systemPrompt,
        temperature: 0.3,
        maxTokens: 50,
      }
    );

    // Clean up the response - remove quotes, whitespace, etc.
    const cleaned = name
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9]/g, "");

    // Ensure it starts with lowercase and is valid camelCase
    if (cleaned.length === 0) {
      return "untitledPrompt";
    }

    // Convert to camelCase if needed
    const camelCase = cleaned.charAt(0).toLowerCase() + cleaned.slice(1);

    return camelCase || "untitledPrompt";
  } catch (error) {
    console.error("[Name Generation] Error generating name:", error);
    // Fallback to a simple name based on timestamp or content
    return `prompt${Date.now().toString(36)}`;
  }
}
