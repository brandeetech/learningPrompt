import { getDb } from "./client";
import { users, type User, type NewUser, type UserRole } from "./schema";
import { flags } from "@/lib/env";
import { eq } from "drizzle-orm";

export async function getUserById(userId: string): Promise<User | null> {
  if (!flags.supabaseEnabled) return null;
  
  const db = getDb();
  if (!db) return null;
  
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result[0] || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  if (!flags.supabaseEnabled) return null;
  
  const db = getDb();
  if (!db) return null;
  
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function createUser(params: {
  id: string;
  email: string;
  role?: UserRole;
  tokensRemaining?: number;
}): Promise<{ ok: boolean; user?: User; message?: string }> {
  if (!flags.supabaseEnabled) {
    return { ok: false, message: "Database disabled" };
  }

  const db = getDb();
  if (!db) {
    return { ok: false, message: "Database connection not available" };
  }

  try {
    const newUser: NewUser = {
      id: params.id,
      email: params.email,
      role: params.role || "free",
      tokensRemaining: params.tokensRemaining ?? 8000,
    };

    const result = await db.insert(users).values(newUser).returning();
    return { ok: true, user: result[0] };
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to create user" 
    };
  }
}

export async function updateUserTokens(
  userId: string,
  tokensRemaining: number
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
      .update(users)
      .set({ tokensRemaining, updatedAt: new Date() })
      .where(eq(users.id, userId));
    
    return { ok: true };
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to update tokens" 
    };
  }
}

export async function updateUserRole(
  userId: string,
  role: UserRole
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
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId));
    
    return { ok: true };
  } catch (error) {
    return { 
      ok: false, 
      message: error instanceof Error ? error.message : "Failed to update role" 
    };
  }
}
