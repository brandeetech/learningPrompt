import { getDb } from "./client";
import { templates, type Template, type PromptCategory } from "./schema";
import { eq, desc, or, ilike, and } from "drizzle-orm";

export async function getTemplates(
  category?: PromptCategory,
  searchQuery?: string
): Promise<Template[]> {

  const db = getDb();
  if (!db) return [];

  const conditions = [];

  // Apply category filter
  if (category) {
    conditions.push(eq(templates.category, category));
  }

  // Apply search filter
  if (searchQuery && searchQuery.trim()) {
    const search = `%${searchQuery.trim()}%`;
    conditions.push(
      or(
        ilike(templates.title, search),
        ilike(templates.intent, search),
        ilike(templates.content, search),
        ilike(templates.whyItWorks, search)
      )!
    );
  }

  let query = db.select().from(templates);

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return await query.orderBy(desc(templates.createdAt));
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
