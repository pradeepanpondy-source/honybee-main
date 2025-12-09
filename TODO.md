
# TODO: Fix TypeScript Errors in Components

## Tasks
# TODO: Fix Registration Failure and Login Page Visibility

## Tasks
- [ ] Update `useAuth.ts` to only set user after signup if a valid session exists (to handle email confirmation)
- [ ] Improve error handling in `SignUpScreen.tsx` to display specific Supabase error messages
- [ ] Test the registration flow to ensure errors are handled properly and login page is accessible

## Notes
- Current issue: User is set immediately after signup even without session, causing premature navigation to home
- Supabase signup may require email confirmation, so session might not be active immediately
- Error messages need to be more specific to help users understand issues
