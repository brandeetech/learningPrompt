import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env, flags } from "@/lib/env";
import * as schema from "./schema";

// Get database connection string
// For Supabase, construct from URL or use direct connection string
function getDatabaseUrl(): string | null {
  // First, try explicit DATABASE_URL or SUPABASE_DB_URL
  if (env.databaseUrl) {
    return env.databaseUrl;
  }
  
  // Fallback: construct from Supabase URL if available
  // Supabase provides a direct connection string in the format:
  // postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
  // Or use the connection pooling URL from Supabase dashboard
  if (env.supabaseUrl && env.supabaseServiceRoleKey) {
    try {
      const url = new URL(env.supabaseUrl);
      const hostname = url.hostname;
      const projectRef = hostname.split('.')[0];
      
      // Try to extract region (this is a best guess - user should provide DATABASE_URL)
      // For production, users should set DATABASE_URL directly from Supabase dashboard
      console.warn("Constructing database URL from Supabase URL. Consider setting DATABASE_URL directly.");
      
      // This is a fallback - may not work for all Supabase projects
      // Users should set DATABASE_URL environment variable from Supabase dashboard
      return `postgresql://postgres.${projectRef}:${encodeURIComponent(env.supabaseServiceRoleKey)}@${hostname.replace('supabase.co', 'pooler.supabase.com')}:6543/postgres`;
    } catch (error) {
      console.error("Failed to construct database URL:", error);
      return null;
    }
  }
  
  return null;
}

let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function getClient(): postgres.Sql | null {
  if (!flags.supabaseEnabled) {
    return null;
  }

  if (client) {
    return client;
  }

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    console.warn("Database URL not configured");
    return null;
  }

  try {
    client = postgres(databaseUrl, {
      max: 1, // Connection pool size
      idle_timeout: 20,
      connect_timeout: 10,
    });
    return client;
  } catch (error) {
    console.error("Failed to create database client:", error);
    return null;
  }
}

export function getDb() {
  if (!flags.supabaseEnabled) {
    return null;
  }

  if (db) {
    return db;
  }

  const sqlClient = getClient();
  if (!sqlClient) {
    return null;
  }

  db = drizzle(sqlClient, { schema });
  return db;
}

// Export client for raw queries if needed
export { getClient };

// For backward compatibility, keep supabaseAdmin export (but it won't be used)
export const supabaseAdmin = null;
