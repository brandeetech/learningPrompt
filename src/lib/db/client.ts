import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Get database connection string from environment
function getDatabaseUrl(): string | null {
  return process.env.POSTGRES_URL || null;
}

let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function getClient(): postgres.Sql | null {
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
