import { getDb } from "./client";
import { providerKeys, type ProviderKey, type NewProviderKey, type Provider } from "./schema";
import { flags } from "@/lib/env";
import { eq, and } from "drizzle-orm";

export async function getProviderKey(
  userId: string,
  provider: Provider
): Promise<ProviderKey | null> {
  if (!flags.supabaseEnabled) return null;

  const db = getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(providerKeys)
    .where(and(
      eq(providerKeys.userId, userId),
      eq(providerKeys.provider, provider)
    ))
    .limit(1);

  return result[0] || null;
}

export async function getUserProviderKeys(userId: string): Promise<ProviderKey[]> {
  if (!flags.supabaseEnabled) return [];

  const db = getDb();
  if (!db) return [];

  return await db
    .select()
    .from(providerKeys)
    .where(eq(providerKeys.userId, userId));
}

export async function upsertProviderKey(params: {
  userId: string;
  provider: Provider;
  apiKeyEncrypted: string;
}): Promise<{ ok: boolean; key?: ProviderKey; message?: string }> {
  if (!flags.supabaseEnabled) {
    return { ok: false, message: "Database disabled" };
  }

  const db = getDb();
  if (!db) {
    return { ok: false, message: "Database connection not available" };
  }

  try {
    // Check if key exists
    const existing = await getProviderKey(params.userId, params.provider);

    if (existing) {
      // Update existing
      const result = await db
        .update(providerKeys)
        .set({ 
          apiKeyEncrypted: params.apiKeyEncrypted,
          updatedAt: new Date()
        })
        .where(eq(providerKeys.id, existing.id))
        .returning();

      return { ok: true, key: result[0] };
    } else {
      // Insert new
      const newKey: NewProviderKey = {
        userId: params.userId,
        provider: params.provider,
        apiKeyEncrypted: params.apiKeyEncrypted,
      };

      const result = await db.insert(providerKeys).values(newKey).returning();
      return { ok: true, key: result[0] };
    }
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to upsert provider key" 
    };
  }
}

export async function deleteProviderKey(
  userId: string,
  provider: Provider
): Promise<{ ok: boolean; message?: string }> {
  if (!flags.supabaseEnabled) {
    return { ok: false, message: "Database disabled" };
  }

  const db = getDb();
  if (!db) {
    return { ok: false, message: "Database connection not available" };
  }

  try {
    await db
      .delete(providerKeys)
      .where(and(
        eq(providerKeys.userId, userId),
        eq(providerKeys.provider, provider)
      ));

    return { ok: true };
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to delete provider key" 
    };
  }
}
