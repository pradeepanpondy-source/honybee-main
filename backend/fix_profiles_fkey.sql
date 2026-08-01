-- Fixes the foreign key constraint on the profiles table
-- and adds a UNIQUE constraint to user_id so upserts work properly.

-- 1. First, check if there's a constraint we need to drop (it might be named profiles_user_id_fkey)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- 2. Add the correct foreign key constraint to auth.users
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- 3. Make user_id UNIQUE so that upsert ({ onConflict: 'user_id' }) works
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
