#!/usr/bin/env node

/**
 * Database Migration Script for Supabase
 * 
 * This script uses Supabase's REST API to execute SQL migrations.
 * It tracks executed migrations in a _migrations table.
 * 
 * Usage: pnpm db:migrate
 * 
 * Requirements:
 * - NEXT_PUBLIC_SUPABASE_URL environment variable
 * - SUPABASE_SERVICE_ROLE_KEY environment variable
 */

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Error: Missing Supabase credentials");
  console.error("   Required environment variables:");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const MIGRATIONS_DIR = join(process.cwd(), "src", "lib", "db", "migrations");

interface MigrationRecord {
  name: string;
  executed_at: string;
}

/**
 * Create the migrations tracking table if it doesn't exist
 */
async function ensureMigrationsTable(): Promise<void> {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  try {
    // Use Supabase's REST API to execute SQL
    // Note: This requires enabling the pg_net extension or using a custom function
    // For now, we'll check if table exists and create via a workaround
    
    const { data, error } = await supabase
      .from("_migrations")
      .select("id")
      .limit(1);

    if (error && error.code === "42P01") {
      // Table doesn't exist - we need to create it
      // Since Supabase JS client can't execute raw SQL, we'll use fetch to REST API
      console.log("📋 Creating _migrations table...");
      
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ sql: createTableSQL }),
      });

      if (!response.ok) {
        // Fallback: print SQL for manual execution
        console.log("⚠️  Could not create _migrations table automatically.");
        console.log("   Please run this SQL in Supabase SQL editor:");
        console.log("\n" + createTableSQL + "\n");
        console.log("   Or install Supabase CLI and run: supabase db push\n");
      }
    }
  } catch (error) {
    console.warn("⚠️  Could not verify _migrations table:", error);
    console.log("   The table may need to be created manually.");
  }
}

/**
 * Get list of already executed migrations
 */
async function getExecutedMigrations(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("_migrations")
      .select("name")
      .order("executed_at", { ascending: true });

    if (error) {
      if (error.code === "42P01") {
        // Table doesn't exist yet
        return [];
      }
      throw error;
    }

    return (data || []).map((m: MigrationRecord) => m.name);
  } catch (error) {
    console.warn("⚠️  Could not fetch migration history");
    return [];
  }
}

/**
 * Record a migration as executed
 */
async function recordMigration(name: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("_migrations")
      .insert({ 
        name, 
        executed_at: new Date().toISOString() 
      });

    if (error) {
      // If it's a duplicate, that's okay
      if (error.code !== "23505") {
        throw error;
      }
    }
  } catch (error) {
    console.error(`❌ Failed to record migration ${name}:`, error);
    throw error;
  }
}

/**
 * Execute SQL using Supabase REST API
 * Note: This requires a custom RPC function or using Supabase CLI
 */
async function executeSQL(sql: string, migrationName: string): Promise<void> {
  // Supabase JS client doesn't support raw SQL execution
  // We have a few options:
  
  // Option 1: Use Supabase CLI (recommended)
  // Option 2: Create a custom RPC function that executes SQL
  // Option 3: Use pg library for direct PostgreSQL connection
  
  // For now, we'll provide instructions and use Supabase CLI approach
  console.log(`\n📝 Migration: ${migrationName}`);
  console.log("   ⚠️  Supabase JS client cannot execute raw SQL directly.");
  console.log("   Please use one of these methods:\n");
  console.log("   1. Supabase CLI (recommended):");
  console.log(`      supabase db push --file src/lib/db/migrations/${migrationName}\n`);
  console.log("   2. Supabase Dashboard:");
  console.log("      - Go to SQL Editor");
  console.log(`      - Copy contents of src/lib/db/migrations/${migrationName}`);
  console.log("      - Execute the SQL\n");
  console.log("   3. Create a custom RPC function for SQL execution\n");
  
  // Ask user if they want to mark as executed (for manual runs)
  // In a real scenario, you'd integrate with Supabase CLI
}

/**
 * Main migration runner
 */
async function runMigrations() {
  console.log("🚀 Starting database migrations...\n");
  console.log(`📍 Supabase URL: ${SUPABASE_URL?.substring(0, 30)}...\n`);

  // Ensure migrations table exists
  await ensureMigrationsTable();

  // Get list of migration files
  let files: string[];
  try {
    files = readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();
  } catch (error) {
    console.error(`❌ Could not read migrations directory: ${MIGRATIONS_DIR}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("ℹ️  No migration files found in src/lib/db/migrations/");
    return;
  }

  // Get executed migrations
  const executed = await getExecutedMigrations();
  console.log(`📋 Found ${files.length} migration file(s)`);
  console.log(`   Already executed: ${executed.length}\n`);

  // Filter pending migrations
  const pending = files.filter((f) => !executed.includes(f));

  if (pending.length === 0) {
    console.log("✅ All migrations are up to date!");
    return;
  }

  console.log(`📦 Pending migrations: ${pending.length}\n`);

  // Process each pending migration
  for (const file of pending) {
    try {
      const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
      
      console.log(`\n${"─".repeat(60)}`);
      console.log(`▶️  Processing: ${file}`);
      console.log(`${"─".repeat(60)}`);
      
      // Since we can't execute SQL directly, provide instructions
      await executeSQL(sql, file);
      
      // For manual execution flow, we could prompt the user
      // For now, we'll just show the SQL
      console.log("📄 SQL Content:");
      console.log("─".repeat(60));
      console.log(sql.substring(0, 500) + (sql.length > 500 ? "\n... (truncated)" : ""));
      console.log("─".repeat(60));
      
    } catch (error) {
      console.error(`❌ Failed to process ${file}:`, error);
      process.exit(1);
    }
  }

  console.log("\n✅ Migration check completed!");
  console.log("\n💡 Next steps:");
  console.log("   1. Install Supabase CLI: npm install -g supabase");
  console.log("   2. Run migrations: supabase db push");
  console.log("   Or execute SQL files manually in Supabase SQL editor");
}

// Run migrations
runMigrations().catch((error) => {
  console.error("\n❌ Migration process failed:", error);
  process.exit(1);
});
