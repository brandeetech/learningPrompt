#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * Checks migration status and provides options for execution:
 * 1. Uses Supabase CLI if available (recommended)
 * 2. Provides SQL for manual execution
 * 3. Tracks executed migrations in database
 * 
 * Usage: pnpm db:migrate
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MIGRATIONS_DIR = join(process.cwd(), "src", "lib", "db", "migrations");

/**
 * Check if Supabase CLI is installed
 */
function hasSupabaseCLI(): boolean {
  try {
    execSync("supabase --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get executed migrations from database
 */
async function getExecutedMigrations(): Promise<string[]> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

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

    return (data || []).map((m: { name: string }) => m.name);
  } catch (error) {
    return [];
  }
}

/**
 * Record migration as executed
 */
async function recordMigration(name: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    await supabase.from("_migrations").insert({
      name,
      executed_at: new Date().toISOString(),
    });
  } catch (error) {
    // Ignore errors - migration might already be recorded
  }
}

/**
 * Ensure migrations table exists
 */
async function ensureMigrationsTable(): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return;
  }

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  console.log("📋 Ensuring _migrations table exists...");
  console.log("   Run this SQL in Supabase SQL editor if needed:\n");
  console.log(createTableSQL);
  console.log();
}

/**
 * Main migration function
 */
async function runMigrations() {
  console.log("🚀 Database Migration Tool\n");
  console.log("─".repeat(60));

  // Check migrations directory
  if (!existsSync(MIGRATIONS_DIR)) {
    console.error(`❌ Migrations directory not found: ${MIGRATIONS_DIR}`);
    process.exit(1);
  }

  // Get migration files
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("ℹ️  No migration files found");
    return;
  }

  console.log(`📋 Found ${files.length} migration file(s):`);
  files.forEach((f) => console.log(`   - ${f}`));
  console.log();

  // Check for Supabase CLI
  const hasCLI = hasSupabaseCLI();
  const hasCredentials = !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

  // Get executed migrations if we have credentials
  let executed: string[] = [];
  if (hasCredentials) {
    await ensureMigrationsTable();
    executed = await getExecutedMigrations();
    console.log(`✅ Already executed: ${executed.length}`);
    console.log(`📦 Pending: ${files.length - executed.length}\n`);
  }

  const pending = files.filter((f) => !executed.includes(f));

  if (pending.length === 0 && executed.length > 0) {
    console.log("✅ All migrations are up to date!");
    return;
  }

  // Execution options
  console.log("─".repeat(60));
  console.log("📝 Migration Execution Options:\n");

  if (hasCLI) {
    console.log("✅ Option 1: Supabase CLI (Recommended)");
    console.log("   Run: supabase db push");
    console.log("   Or: supabase db execute --file src/lib/db/migrations/<filename>.sql\n");
  } else {
    console.log("⚠️  Option 1: Install Supabase CLI");
    console.log("   npm install -g supabase");
    console.log("   Then run: supabase db push\n");
  }

  console.log("✅ Option 2: Supabase Dashboard");
  console.log("   1. Go to your Supabase project");
  console.log("   2. Open SQL Editor");
  console.log("   3. Copy and paste the SQL from migration files");
  console.log("   4. Execute\n");

  if (pending.length > 0) {
    console.log("📄 Pending Migration Files:\n");
    for (const file of pending) {
      const sqlPath = join(MIGRATIONS_DIR, file);
      const sql = readFileSync(sqlPath, "utf-8");
      console.log(`   ${file} (${sql.length} bytes)`);
    }
    console.log();
  }

  // If using CLI, try to execute
  if (hasCLI && pending.length > 0) {
    console.log("─".repeat(60));
    console.log("🚀 Attempting to run migrations with Supabase CLI...\n");
    
    for (const file of pending) {
      try {
        const sqlPath = join(MIGRATIONS_DIR, file);
        console.log(`▶️  Executing: ${file}`);
        
        // Try to execute via CLI
        // Note: This requires supabase link or connection string
        try {
          execSync(`supabase db push --file "${sqlPath}"`, {
            stdio: "inherit",
          });
          await recordMigration(file);
          console.log(`✅ Completed: ${file}\n`);
        } catch (cliError) {
          console.log(`⚠️  CLI execution failed, please run manually:\n`);
          console.log(`   File: src/lib/db/migrations/${file}`);
          console.log(`   Or use Supabase SQL editor\n`);
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
      }
    }
  }

  console.log("─".repeat(60));
  console.log("✅ Migration check completed!");
  console.log("\n💡 Tip: After running migrations, they will be tracked in _migrations table");
}

// Run
runMigrations().catch((error) => {
  console.error("\n❌ Migration process failed:", error);
  process.exit(1);
});
