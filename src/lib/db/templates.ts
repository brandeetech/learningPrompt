import { getDb } from "./client";
import { templates, type Template, type PromptCategory } from "./schema";
import { eq, desc } from "drizzle-orm";

export async function getTemplates(
  category?: PromptCategory
): Promise<Template[]> {

  const db = getDb();
  if (!db) return [];

  if (category) {
    return await db
      .select()
      .from(templates)
      .where(eq(templates.category, category))
      .orderBy(desc(templates.createdAt));
  }

  return await db
    .select()
    .from(templates)
    .orderBy(desc(templates.createdAt));
}

export async function getTemplateById(templateId: string): Promise<Template | null> {

  const db = getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(templates)
    .where(eq(templates.id, templateId))
    .limit(1);

  return result[0] || null;
}
