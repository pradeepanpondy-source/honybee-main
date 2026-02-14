-- Add password reset token columns to user_profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMPTZ;

-- Index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_reset_token
ON public.user_profiles (reset_token)
WHERE reset_token IS NOT NULL;
