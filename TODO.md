# TODO: Remove Sign-In Restrictions

## Tasks
- [x] Modify src/components/Seller.tsx: Remove redirect to login if not signed in with Google
- [x] Modify src/components/Profile.tsx: Remove sign-in checks and allow direct access
- [x] Modify src/components/Applications.tsx: Remove sign-in check for seller dashboard
- [x] Modify src/components/Orders.tsx: Remove sign-in check
- [ ] Modify src/components/Navigation.tsx: Remove check before navigating to seller page
- [x] Modify src/components/Checkout.tsx: Remove sign-in check for placing orders

## Followup Steps
- [ ] Test the changes to ensure pages are accessible without sign-in
