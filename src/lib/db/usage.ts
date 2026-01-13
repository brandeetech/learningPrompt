import { getDb } from "./client";
import { usageLogs, type UsageLog, type NewUsageLog } from "./schema";
import { flags } from "@/lib/env";
import { eq, desc, sum } from "drizzle-orm";

export async function createUsageLog(params: {
  userId?: string;
  promptVersionId?: string;
  model: string;
  tokensUsed: number;
}): Promise<{ ok: boolean; message?: string }> {
  if (!flags.supabaseEnabled) {
    return { ok: false, message: "Database disabled" };
  }

  const db = getDb();
  if (!db) {
    return { ok: false, message: "Database connection not available" };
  }

  const userId = params.userId || "anonymous-demo";

  try {
    const newLog: NewUsageLog = {
      userId,
      promptVersionId: params.promptVersionId || null,
      model: params.model,
      tokensUsed: params.tokensUsed,
    };

    await db.insert(usageLogs).values(newLog);
    return { ok: true };
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to create usage log" 
    };
  }
}

/**
 * @deprecated Use createUsageLog instead. This function is kept for backward compatibility.
 */
export async function insertUsage(params: {
  userId?: string;
  model: string;
  tokensUsed: number;
}): Promise<{ ok: boolean; message?: string }> {
  return createUsageLog({
    userId: params.userId,
    model: params.model,
    tokensUsed: params.tokensUsed,
  });
}

export async function getUsageLogsByUserId(
  userId: string,
  limit = 50
): Promise<UsageLog[]> {
  if (!flags.supabaseEnabled) return [];

  const db = getDb();
  if (!db) return [];

  return await db
    .select()
    .from(usageLogs)
    .where(eq(usageLogs.userId, userId))
    .orderBy(desc(usageLogs.createdAt))
    .limit(limit);
}

export async function getTotalTokensUsed(userId: string): Promise<number> {
  if (!flags.supabaseEnabled) return 0;

  const db = getDb();
  if (!db) return 0;

  try {
    const result = await db
      .select({ total: sum(usageLogs.tokensUsed) })
      .from(usageLogs)
      .where(eq(usageLogs.userId, userId));

    return Number(result[0]?.total || 0);
  } catch (error) {
    console.error("Failed to get total tokens used:", error);
    return 0;
  }
}
