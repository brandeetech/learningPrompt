# Drizzle ORM Migration

The database layer has been migrated from Supabase client to Drizzle ORM with postgres-js for better type safety and query building.

## What Changed

### Packages Added
- `drizzle-orm`: Type-safe ORM for PostgreSQL
- `postgres`: PostgreSQL client for Node.js

### Database Client
- **Before**: Used `@supabase/supabase-js` client directly
- **After**: Uses `drizzle-orm` with `postgres-js` for direct PostgreSQL connections

### Schema Definition
- **Before**: TypeScript types only (`UserRow`, `PromptRow`, etc.)
- **After**: Drizzle schema definitions with full type inference

## Configuration

### Environment Variables

You need to set one of these:

1. **DATABASE_URL** (recommended): Direct PostgreSQL connection string
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **SUPABASE_DB_URL**: Alternative name for the same variable

3. **Fallback**: If neither is set, the system will attempt to construct from `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, but this is not recommended for production.

### Getting Your Database URL

For Supabase:
1. Go to your Supabase project dashboard
2. Navigate to Settings → Database
3. Copy the "Connection string" under "Connection pooling"
4. Use the "Transaction" mode connection string
5. Set it as `DATABASE_URL` in your `.env` file

Example format:
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Schema Structure

All tables are now defined in `src/lib/db/schema.ts` using Drizzle:

- `users` - User accounts
- `prompts` - User prompts
- `promptVersions` - Version history
- `templates` - Prompt templates
- `usageLogs` - Token usage tracking
- `providerKeys` - User API keys
- `migrations` - Migration tracking

## Type Safety

Drizzle provides automatic type inference:

```typescript
import { users, type User, type NewUser } from "@/lib/db/schema";

// Select types
const user: User = await db.select().from(users).where(...);

// Insert types
const newUser: NewUser = { email: "...", role: "free" };
```

## Query Examples

### Before (Supabase)
```typescript
const { data, error } = await supabaseAdmin
  .from("users")
  .select("*")
  .eq("id", userId)
  .single();
```

### After (Drizzle)
```typescript
const user = await db
  .select()
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);
```

## Benefits

1. **Type Safety**: Full TypeScript inference for queries and results
2. **Better DX**: Autocomplete and type checking in queries
3. **Flexibility**: Can use raw SQL when needed
4. **Performance**: Direct PostgreSQL connection (no REST API overhead)
5. **Relations**: Built-in support for table relations

## Migration Notes

- All query functions have been updated to use Drizzle
- Type exports remain compatible (`User`, `Prompt`, etc.)
- API routes continue to work without changes
- SQL migrations in `src/lib/db/migrations/` are still used for schema creation

## Next Steps

1. Set `DATABASE_URL` in your environment variables
2. Run migrations: `pnpm db:migrate`
3. Test database operations
4. Remove `@supabase/supabase-js` if not needed for auth (keep it if using Supabase Auth)

## Troubleshooting

### Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check that the connection string includes `?pgbouncer=true` for Supabase connection pooling
- Ensure your IP is allowed in Supabase network settings

### Type Errors
- Run `npm install` to ensure all packages are installed
- Check that TypeScript can find `drizzle-orm` types

### Query Errors
- Verify table names match the schema
- Check that migrations have been run
- Ensure column names use camelCase in code (Drizzle converts to snake_case)
