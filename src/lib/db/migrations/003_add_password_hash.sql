-- Migration: Add password_hash column to users table
-- This migration adds password_hash column for password-based authentication

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
