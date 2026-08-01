-- ============================================================
-- BeeBridge: user-profiles Storage Bucket + RLS Migration
-- Task 5 — Separate profile storage structure
-- Run this in Supabase SQL Editor after creating the bucket.
-- ============================================================

-- STEP 1: Add avatar_url column to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================
-- STEP 2: CREATE BUCKET MANUALLY IN SUPABASE DASHBOARD
-- Go to: Storage → New Bucket
--   Name:   user-profiles
--   Public: YES  (avatars are public images — no signed URLs needed)
--   Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
--   Max file size: 5 MB
-- ============================================================

-- STEP 3: Apply RLS policies to the storage bucket
-- (Run in SQL Editor after creating the bucket)

-- Drop existing policies if re-running (optional but safe)
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public read for avatars" ON storage.objects;

-- Allow authenticated users to upload to their own folder only
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'user-profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-profiles' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Public read for all avatars (bucket is public, this is optional but explicit)
CREATE POLICY "Public read for avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-profiles');

-- ============================================================
-- STEP 4: Folder structure contract (enforced by RLS above)
--
-- user-profiles/
--   {user_id}/
--     avatar.jpg     ← customer profile photo
--
-- seller assets remain in existing 'sellerid_details' bucket:
-- sellerid_details/
--   {email}/
--     {seller_id}/
--       data/
--         profile_{ts}.{ext}   ← seller profile photo
--         id_{ts}.{ext}        ← KYC ID proof
-- ============================================================

-- Performance index for avatar lookups
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url ON profiles(user_id) WHERE avatar_url IS NOT NULL;
