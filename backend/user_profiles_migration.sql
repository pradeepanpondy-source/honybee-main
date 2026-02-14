-- User Profiles table for email verification and provider tracking
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    provider TEXT NOT NULL DEFAULT 'local',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own user_profile" ON user_profiles;
CREATE POLICY "Users can view own user_profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own user_profile" ON user_profiles;
CREATE POLICY "Users can insert own user_profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own user_profile" ON user_profiles;
CREATE POLICY "Users can update own user_profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow service role full access (for API functions)
-- Note: Service role bypasses RLS by default in Supabase, so no extra policy needed

-- Allow anonymous/public read for verification checks during login
DROP POLICY IF EXISTS "Public can read verification status" ON user_profiles;
CREATE POLICY "Public can read verification status" ON user_profiles
    FOR SELECT USING (true);

-- Allow public insert for signup flow (user hasn't confirmed session yet)
DROP POLICY IF EXISTS "Public can insert user_profile" ON user_profiles;
CREATE POLICY "Public can insert user_profile" ON user_profiles
    FOR INSERT WITH CHECK (true);

-- Allow public update for verification flow (token-based update from API)
DROP POLICY IF EXISTS "Public can update user_profile" ON user_profiles;
CREATE POLICY "Public can update user_profile" ON user_profiles
    FOR UPDATE USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_verification_token ON user_profiles(verification_token);
