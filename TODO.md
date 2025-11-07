# TODO: Migrate Google Login to Supabase Integration

## Information Gathered
- Current setup uses custom Google OAuth with PHP backend and MySQL database
- Supabase client exists but not configured for auth
- useAuth hook has custom Google login implementation calling backend API
- SignUpScreen has placeholder Google login button
- Database has users table with google_profile JSON field for Google users

## Plan
- [x] Update src/lib/supabase.ts to include auth client
- [x] Modify src/hooks/useAuth.ts to use Supabase auth for Google login instead of custom backend
- [x] Update src/components/SignUpScreen.tsx to use actual Google login instead of placeholder
- [x] Remove or update backend/api/google_login.php since Supabase will handle authentication
- [x] Ensure user data (name, email) is properly saved in Supabase during Google auth

## Dependent Files to be edited
- src/lib/supabase.ts
- src/hooks/useAuth.ts
- src/components/SignUpScreen.tsx
- backend/api/google_login.php

## Followup steps
- [ ] Test Google login functionality on both login and signup screens
- [ ] Verify user data is saved correctly in Supabase
- [ ] Check that JWT tokens are properly handled
- [ ] Update any other components that reference old login flow
