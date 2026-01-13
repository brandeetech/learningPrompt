#!/usr/bin/env node

/**
 * Database Migration Script using Supabase CLI
 * 
 * This script checks migration status and provides instructions
 * for running migrations via Supabase CLI.
 * 
 * Usage: pnpm db:migrate
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

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
 * Run migrations using Supabase CLI
 */
async function runMigrationsWithCLI() {
  console.log("🚀 Running migrations with Supabase CLI...\n");

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("ℹ️  No migration files found");
    return;
  }

  console.log(`📋 Found ${files.length} migration file(s)\n`);

  for (const file of files) {
    console.log(`▶️  Running: ${file}`);
    try {
      const sqlPath = join(MIGRATIONS_DIR, file);
      const sql = readFileSync(sqlPath, "utf-8");
      
      // Use Supabase CLI to execute SQL
      // Note: This requires supabase link or direct connection
      execSync(`supabase db push --file "${sqlPath}"`, {
        stdio: "inherit",
      });
      
      console.log(`✅ Completed: ${file}\n`);
    } catch (error) {
      console.error(`❌ Failed: ${file}`, error);
      process.exit(1);
    }
  }

  console.log("✅ All migrations completed!");
}

/**
 * Main function
 */
async function runMigrations() {
  console.log("🔍 Checking for Supabase CLI...\n");

  if (!hasSupabaseCLI()) {
    console.log("❌ Supabase CLI not found");
    console.log("\n📦 Install it with:");
    console.log("   npm install -g supabase");
    console.log("   or");
    console.log("   brew install supabase/tap/supabase\n");
    console.log("💡 Alternative: Run SQL files manually in Supabase SQL editor");
    process.exit(1);
  }

  console.log("✅ Supabase CLI found\n");

  // Check if migrations directory exists
  if (!existsSync(MIGRATIONS_DIR)) {
    console.error(`❌ Migrations directory not found: ${MIGRATIONS_DIR}`);
    process.exit(1);
  }

  await runMigrationsWithCLI();
}

runMigrations().catch((error) => {
  console.error("\n❌ Migration failed:", error);
  process.exit(1);
});
