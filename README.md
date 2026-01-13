# AskRight — Prompt Learning Platform

Next.js application for the AskRight prompt learning platform. A personal, educational tool that teaches professionals how to ask better questions to Large Language Models.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

**Note**: Sign in is required to access the playground and start using the app.

## 📁 Project Structure

```
├── app/                    # Next.js App Router (routes)
│   ├── api/               # API routes
│   │   ├── evaluate/     # Prompt evaluation endpoint
│   │   └── runs/          # Prompt run tracking
│   ├── auth/              # Authentication page
│   ├── play/               # Playground page
│   ├── templates/          # Templates page
│   ├── learn/              # Learning hub
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── src/
│   ├── components/         # React components
│   │   └── nav.tsx         # Navigation bar
│   └── lib/                # Library code
│       ├── ai/             # AI/LLM integration
│       │   ├── prompts/    # System prompts
│       │   ├── models/     # Model definitions
│       │   └── client.ts   # AI client (Vercel AI SDK)
│       ├── db/             # Database layer
│       │   ├── migrations/ # SQL migrations
│       │   ├── schema.ts   # Drizzle schema
│       │   ├── client.ts   # Database client
│       │   ├── users.ts    # User queries
│       │   ├── prompts.ts  # Prompt queries
│       │   └── templates.ts
│       ├── env.ts          # Environment config
│       ├── promptEvaluator.ts
│       ├── evaluationColors.ts
│       └── learningPath.ts
├── scripts/                # Utility scripts
│   └── migrate.ts          # Database migration script
├── docs/                   # Documentation
│   ├── AGENTS.md          # Agent notes
│   ├── desc.md            # MVP plan
│   └── ...
└── public/                 # Static assets
```

## 🔧 Environment Variables

Create a `.env.local` file:

```bash
# Database
POSTGRES_URL=your_postgres_connection_string

# Authentication
JWT_SECRET=your-secret-key-change-in-production

# Database (Direct Postgres connection)
POSTGRES_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-secret-key-change-in-production-min-32-chars

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# Vercel AI Gateway (optional)
VERCEL_AI_GATEWAY_URL=https://...
VERCEL_AI_GATEWAY_AUTH=Bearer ...
```

## 🗄️ Database Setup

### Option 1: Migration Script

```bash
npm run db:migrate
```

### Option 2: Manual SQL Execution

1. Connect to your PostgreSQL database
2. Execute files from `src/lib/db/migrations/` in order:
   - `000_create_migrations_table.sql`
   - `001_initial_schema.sql`
   - `002_insert_templates.sql`
   - `003_add_password_hash.sql`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations

## 🏗️ Architecture

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL
- **Connection**: Direct Postgres via `postgres-js`
- **Schema**: Defined in `src/lib/db/schema.ts`
- **Queries**: Organized in `src/lib/db/*.ts` files

### AI Layer
- **SDK**: Vercel AI SDK with direct model format (provider/model)
- **Client**: Unified interface in `src/lib/ai/client.ts`
- **Models**: Model definitions in `src/lib/ai/models/` (format: `openai/gpt-4o-mini`)
- **Prompts**: System prompts in `src/lib/ai/prompts/`
- **Gateway**: All API calls go through Vercel AI Gateway

### API Routes
- `/api/evaluate` - Prompt evaluation endpoint
- `/api/runs` - Prompt run tracking

## 🎨 Design System

- **Colors**: Defined in `app/globals.css`
- **Typography**: Inter (UI), JetBrains Mono (code)
- **Components**: Tailwind CSS utility classes

## 📚 Documentation

- **AI Library**: `src/lib/ai/README.md`
- **Database Migrations**: `src/lib/db/migrations/README.md`
- **Drizzle Migration**: `DRIZZLE_MIGRATION.md`

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check Supabase network settings
- Ensure connection string includes `?pgbouncer=true` for pooling

### AI Provider Issues
- Verify API keys are set in environment variables
- Check provider rate limits
- Review error messages in console

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder: `rm -rf .next`
- Check TypeScript errors: `npm run lint`

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform.

## 📝 Notes

- The `app/` folder is at the root level (Next.js App Router convention)
- Source code is in `src/` folder
- Database migrations are in `src/lib/db/migrations/`
- All imports use `@/` alias pointing to `src/`
