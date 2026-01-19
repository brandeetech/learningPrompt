-- AskRight Database Schema
-- Run this migration in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'pro', 'admin')),
  tokens_remaining INTEGER NOT NULL DEFAULT 8000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  intent TEXT, -- User's stated intent for the prompt
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prompt versions table
CREATE TABLE IF NOT EXISTS prompt_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  model TEXT NOT NULL,
  system_instructions TEXT,
  output TEXT, -- The actual LLM output
  evaluation_score INTEGER CHECK (evaluation_score >= 0 AND evaluation_score <= 100), -- 0-100 score
  evaluation_data JSONB, -- Full evaluation JSON
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(prompt_id, version_number)
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('summary', 'analysis', 'compare', 'extract', 'critique', 'writing')),
  intent TEXT NOT NULL,
  content TEXT NOT NULL,
  why_it_works TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_prompt_id ON prompt_versions(prompt_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (users can only see/update their own data)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for prompts
CREATE POLICY "Users can view own prompts" ON prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts" ON prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON prompts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON prompts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for prompt_versions
CREATE POLICY "Users can view own prompt versions" ON prompt_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prompts WHERE prompts.id = prompt_versions.prompt_id AND prompts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own prompt versions" ON prompt_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM prompts WHERE prompts.id = prompt_versions.prompt_id AND prompts.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates (optional - can be done via admin later)
INSERT INTO templates (title, category, intent, content, why_it_works) VALUES
  (
    'Tidy Summary',
    'summary',
    'Summarize with structure and transparency on unknowns.',
    'Summarize the following text for a business audience in 4 bullets + 1 risk. Include dates/regions if present; if unknown, say ''unknown''. Keep sentences under 18 words.

Text:
{{insert text}}',
    'Specifies audience, length, format, and how to handle unknowns—reduces drift and verbosity.'
  ),
  (
    'Explain a Decision',
    'analysis',
    'Analyze a decision with context and counterpoints.',
    'You are an analyst. Explain the decision on {{topic}} for {{audience}}. Provide: 1) 3 key factors, 2) trade-offs, 3) 1 counterpoint, 4) what data is missing. Use bullets.',
    'Breaks analysis into repeatable sections and asks for missing data, improving clarity and trust.'
  ),
  (
    'Compare Options',
    'compare',
    'Compare two options with constraints.',
    'Compare {{option A}} vs {{option B}} for {{audience}}. Create a 4-row table: criteria, why it matters, option A note, option B note. End with a short recommendation and 1 risk.',
    'Forces a shared schema and keeps outputs scoped; makes trade-offs explicit instead of generic pros/cons.'
  )
ON CONFLICT DO NOTHING;
