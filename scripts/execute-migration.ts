#!/usr/bin/env node

/**
 * Execute a migration file directly using the database connection
 */

import { readFileSync } from "fs";
import { join } from "path";
import { getClient } from "../src/lib/db/client";

const MIGRATION_FILE = process.argv[2] || "002_insert_templates.sql";
const MIGRATIONS_DIR = join(process.cwd(), "src", "lib", "db", "migrations");

async function executeMigration() {
  try {
    const client = getClient();
    if (!client) {
      console.error("❌ Database connection not available");
      console.error("   Make sure POSTGRES_URL is set in your environment");
      process.exit(1);
    }

    const migrationPath = join(MIGRATIONS_DIR, MIGRATION_FILE);
    const sql = readFileSync(migrationPath, "utf-8");

    console.log(`📄 Executing migration: ${MIGRATION_FILE}`);
    console.log("────────────────────────────────────────────────────────────");

    // Execute the SQL directly
    await client.unsafe(sql);

    // Record migration in _migrations table
    try {
      await client.unsafe(`
        INSERT INTO _migrations (name)
        VALUES ($1)
        ON CONFLICT (name) DO NOTHING
      `, [MIGRATION_FILE]);
      console.log(`✅ Migration recorded in _migrations table`);
    } catch (error: any) {
      // If _migrations table doesn't exist, that's okay - migration still executed
      if (error.message?.includes("does not exist") || error.message?.includes("relation")) {
        console.log(`⚠️  _migrations table not found (migration still executed)`);
      } else {
        console.log(`⚠️  Could not record migration: ${error.message}`);
      }
    }

    console.log(`✅ Migration ${MIGRATION_FILE} executed successfully!`);
    
    // Close connection
    await client.end();
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Migration failed:");
    console.error(error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

executeMigration();
