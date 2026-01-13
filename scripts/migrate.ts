#!/usr/bin/env node

/**
 * Database Migration Script
 * 
 * Executes SQL migrations directly using the database connection
 * 
 * Usage: pnpm db:migrate
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { getClient } from "../src/lib/db/client";

// Load environment variables from .env.local
const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envFile = readFileSync(envPath, "utf-8");
  envFile.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        const value = valueParts.join("=").replace(/^["']|["']$/g, "");
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const MIGRATIONS_DIR = join(process.cwd(), "src", "lib", "db", "migrations");

/**
 * Get executed migrations from database
 */
async function getExecutedMigrations(): Promise<string[]> {
  const client = getClient();
  if (!client) {
    return [];
  }

  try {
    const result = await client`
      SELECT name FROM _migrations ORDER BY executed_at ASC
    `;
    return result.map((m: { name: string }) => m.name);
  } catch (error) {
    // Table might not exist yet
    return [];
  }
}

/**
 * Record migration as executed
 */
async function recordMigration(name: string): Promise<void> {
  const client = getClient();
  if (!client) {
    return;
  }

  try {
    await client`
      INSERT INTO _migrations (name)
      VALUES (${name})
      ON CONFLICT (name) DO NOTHING
    `;
  } catch (error) {
    // Ignore errors - migration might already be recorded
  }
}

/**
 * Ensure migrations table exists
 */
async function ensureMigrationsTable(): Promise<void> {
  const client = getClient();
  if (!client) {
    return;
  }

  try {
    await client.unsafe(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  } catch (error) {
    // Table might already exist or connection issue
    console.warn("⚠️  Could not ensure _migrations table exists");
  }
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

  // Check database connection
  const client = getClient();
  if (!client) {
    console.log("❌ Database connection not available");
    console.log("   Make sure POSTGRES_URL is set in your environment\n");
    console.log("📄 Migration Files (execute manually):\n");
    for (const file of files) {
      const sqlPath = join(MIGRATIONS_DIR, file);
      if (existsSync(sqlPath)) {
        const size = readFileSync(sqlPath, "utf-8").length;
        console.log(`   ${file} (${size} bytes)`);
      }
    }
    return;
  }

  // Ensure migrations table exists
  await ensureMigrationsTable();

  // Get executed migrations
  const executed = await getExecutedMigrations();
  console.log(`✅ Already executed: ${executed.length}`);
  console.log(`📦 Pending: ${files.length - executed.length}\n`);

  const pending = files.filter((f) => !executed.includes(f));

  if (pending.length === 0) {
    console.log("✅ All migrations are up to date!");
    await client.end();
    return;
  }

  // Execute pending migrations
  console.log("─".repeat(60));
  console.log("📝 Executing pending migrations...\n");

  for (const file of pending) {
    const sqlPath = join(MIGRATIONS_DIR, file);
    if (!existsSync(sqlPath)) {
      console.log(`⚠️  Skipping ${file} (file not found)`);
      continue;
    }

    try {
      const sql = readFileSync(sqlPath, "utf-8");
      console.log(`📄 Executing ${file}...`);

      await client.unsafe(sql);
      await recordMigration(file);

      console.log(`✅ ${file} executed successfully\n`);
    } catch (error: any) {
      console.error(`❌ Failed to execute ${file}:`);
      console.error(`   ${error.message}\n`);
    }
  }

  await client.end();

  console.log("─".repeat(60));
  console.log("✅ Migration process completed!");
}

// Run
runMigrations().catch((error) => {
  console.error("\n❌ Migration process failed:", error);
  process.exit(1);
});
