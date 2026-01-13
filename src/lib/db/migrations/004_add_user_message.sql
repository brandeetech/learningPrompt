-- Migration: Add user_message column to prompt_versions table
-- This migration separates user message from system prompt

ALTER TABLE prompt_versions 
ADD COLUMN IF NOT EXISTS user_message TEXT;

-- Update content to be the full prompt (system + user message combined)
-- This maintains backward compatibility
