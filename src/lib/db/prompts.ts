import { getDb } from "./client";
import { prompts, promptVersions, type Prompt, type NewPrompt, type PromptVersion, type NewPromptVersion } from "./schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getPromptById(promptId: string): Promise<Prompt | null> {
  
  const db = getDb();
  if (!db) return null;
  
  const result = await db.select().from(prompts).where(eq(prompts.id, promptId)).limit(1);
  return result[0] || null;
}

export async function getPromptsByUserId(userId: string): Promise<Prompt[]> {
  
  const db = getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(prompts)
    .where(eq(prompts.userId, userId))
    .orderBy(desc(prompts.createdAt));
}

/**
 * Get prompts with their latest version information
 */
export async function getPromptsWithLatestVersion(userId: string): Promise<Array<Prompt & { latestVersion?: PromptVersion }>> {
  const db = getDb();
  if (!db) return [];

  const userPrompts = await getPromptsByUserId(userId);
  
  // Get latest version for each prompt
  const promptsWithVersions = await Promise.all(
    userPrompts.map(async (prompt) => {
      const versions = await getPromptVersions(prompt.id);
      return {
        ...prompt,
        latestVersion: versions[0] || undefined,
      };
    })
  );

  return promptsWithVersions;
}

export async function createPrompt(params: {
  userId: string;
  title?: string;
  intent?: string;
}): Promise<{ ok: boolean; prompt?: Prompt; message?: string }> {

  const db = getDb();
  if (!db) {
    return { ok: false, message: "Database connection not available" };
  }

  try {
    const newPrompt: NewPrompt = {
      userId: params.userId,
      title: params.title || "Untitled prompt",
      intent: params.intent || null,
    };

    const result = await db.insert(prompts).values(newPrompt).returning();
    return { ok: true, prompt: result[0] };
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to create prompt" 
    };
  }
}

export async function updatePrompt(
  promptId: string,
  updates: { title?: string; intent?: string }
): Promise<{ ok: boolean; message?: string }> {

  const db = getDb();
  if (!db) {
    return { ok: false, message: "Database connection not available" };
  }

  try {
    await db
      .update(prompts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(prompts.id, promptId));
    
    return { ok: true };
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to update prompt" 
    };
  }
}

export async function getPromptVersions(promptId: string): Promise<PromptVersion[]> {
  
  const db = getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(promptVersions)
    .where(eq(promptVersions.promptId, promptId))
    .orderBy(desc(promptVersions.versionNumber));
}

export async function getPromptVersionById(versionId: string): Promise<PromptVersion | null> {
  
  const db = getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(promptVersions)
    .where(eq(promptVersions.id, versionId))
    .limit(1);
  
  return result[0] || null;
}

export async function createPromptVersion(params: {
  promptId: string;
  content: string;
  model: string;
  systemInstructions?: string;
  userMessage?: string;
  output?: string;
  evaluationScore?: number;
  evaluationData?: Record<string, any>;
  tokensUsed: number;
}): Promise<{ ok: boolean; version?: PromptVersion; message?: string }> {

  const db = getDb();
  if (!db) {
    return { ok: false, message: "Database connection not available" };
  }

  try {
    // Get the latest version number
    const latest = await db
      .select({ versionNumber: promptVersions.versionNumber })
      .from(promptVersions)
      .where(eq(promptVersions.promptId, params.promptId))
      .orderBy(desc(promptVersions.versionNumber))
      .limit(1);

    const versionNumber = latest[0] ? latest[0].versionNumber + 1 : 1;

    const newVersion: NewPromptVersion = {
      promptId: params.promptId,
      versionNumber,
      content: params.content,
      model: params.model,
      systemInstructions: params.systemInstructions || null,
      userMessage: params.userMessage || null,
      output: params.output || null,
      evaluationScore: params.evaluationScore || null,
      evaluationData: params.evaluationData || null,
      tokensUsed: params.tokensUsed,
    };

    const result = await db.insert(promptVersions).values(newVersion).returning();
    return { ok: true, version: result[0] };
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to create version" 
    };
  }
}

/**
 * Create a prompt with its first version
 * This is a convenience function that combines prompt creation and versioning
 */
export async function upsertPromptWithVersion(params: {
  userId?: string;
  title?: string;
  content: string;
  systemPrompt?: string;
  userMessage?: string;
  model: string;
  tokensUsed: number;
  intent?: string;
  output?: string;
  evaluationScore?: number;
  evaluationData?: Record<string, any>;
}): Promise<{ ok: boolean; prompt?: Prompt; version?: PromptVersion; message?: string }> {

  const db = getDb();
  if (!db) {
    return { ok: false, message: "Database connection not available" };
  }

  const userId = params.userId || "anonymous-demo";

  try {
    // Create prompt
    const promptResult = await createPrompt({
      userId,
      title: params.title,
      intent: params.intent,
    });

    if (!promptResult.ok || !promptResult.prompt) {
      return { ok: false, message: promptResult.message || "Failed to create prompt" };
    }

    // Create first version
    const versionResult = await createPromptVersion({
      promptId: promptResult.prompt.id,
      content: params.content,
      systemInstructions: params.systemPrompt,
      userMessage: params.userMessage,
      model: params.model,
      tokensUsed: params.tokensUsed,
      output: params.output,
      evaluationScore: params.evaluationScore,
      evaluationData: params.evaluationData,
    });

    if (!versionResult.ok || !versionResult.version) {
      return { ok: false, message: versionResult.message || "Failed to create version" };
    }

    return { ok: true, prompt: promptResult.prompt, version: versionResult.version };
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to create prompt with version" 
    };
  }
}
