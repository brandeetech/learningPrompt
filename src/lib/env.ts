export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  databaseUrl: process.env.DATABASE_URL || process.env.SUPABASE_DB_URL, // Direct Postgres connection string
  vercelAIGatewayUrl: process.env.VERCEL_AI_GATEWAY_URL,
  vercelAIGatewayAuth: process.env.VERCEL_AI_GATEWAY_AUTH, // bearer token if gateway requires it
  openaiKey: process.env.OPENAI_API_KEY,
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  googleKey: process.env.GOOGLE_API_KEY,
};

export const flags = {
  supabaseEnabled:
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  gatewayEnabled: !!process.env.VERCEL_AI_GATEWAY_URL,
};
