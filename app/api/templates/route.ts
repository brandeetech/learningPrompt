import { NextResponse } from "next/server";
import { getTemplates, getTemplateById } from "@/lib/db/templates";
import type { PromptCategory } from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("id");
    
    // If requesting a single template by ID
    if (templateId) {
      const template = await getTemplateById(templateId);
      if (!template) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ template });
    }

    // Otherwise, fetch all templates with filters
    const category = searchParams.get("category") as PromptCategory | null;
    const search = searchParams.get("search") || undefined;

    const templates = await getTemplates(category || undefined, search);

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("[Templates API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
