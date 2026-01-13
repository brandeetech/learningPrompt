# Database Migrations

This directory contains SQL migration files for the AskRight database schema.

## Running Migrations

### Option 1: Using the Migration Script (Recommended)

```bash
pnpm db:migrate
```

This script will:
- Check for pending migrations
- Show execution options
- Track executed migrations in the `_migrations` table

**Requirements:**
- `NEXT_PUBLIC_SUPABASE_URL` environment variable
- `SUPABASE_SERVICE_ROLE_KEY` environment variable (optional, for tracking)

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project (first time only)
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Option 3: Manual Execution

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Copy and paste the contents of each migration file
4. Execute them in order (000, 001, etc.)

## Migration Files

- `000_create_migrations_table.sql` - Creates the migration tracking table
- `001_initial_schema.sql` - Initial database schema (users, prompts, versions, etc.)

## Migration Tracking

The `_migrations` table tracks which migrations have been executed. This prevents running the same migration twice.

To check executed migrations:
```sql
SELECT * FROM _migrations ORDER BY executed_at;
```

## Creating New Migrations

1. Create a new SQL file: `00X_description.sql`
2. Use sequential numbering (002, 003, etc.)
3. Include descriptive names
4. Use `IF NOT EXISTS` for idempotent operations
5. Test in a development environment first

## Notes

- Migrations are executed in alphabetical order
- Always test migrations in development before production
- Backup your database before running migrations in production
- The migration script uses `tsx` to run TypeScript files directly
