pl# TODO: Fix Seller Application Submission and Display

## Steps to Complete

- [x] Create firestore.rules file with rules allowing authenticated users to read/write their own 'application' documents.
- [x] Create firebase.json for Firebase CLI deployment configuration.
- [x] Update src/components/Seller.tsx to improve error handling for permissions errors.
- [x] Update src/components/Applications.tsx to fetch and display real application data from Firestore instead of mock data.
- [x] Add rules for 'profile' collection to allow profile saving with specific doc ID.
- [x] Update src/components/Profile.tsx to save to 'profile' collection with doc ID 'oKBVdiB6yR4iiwacSWah'.
- [x] Deploy updated rules to beebridge project.
- [x] Test submission after rules deployment.
- [x] Test dashboard display of application data.
- [ ] Test profile saving functionality.

## Notes
- Deploy rules using `firebase deploy --only firestore:rules` after CLI setup.
- Ensure Firebase CLI is installed: `npm install -g firebase-tools` and `firebase login`.
- Focus on permissions fix first, then data display.
Missing or insufficient permissions. Please ensure you are signed in and try again.Missing or insufficient permissions. Please ensure you are signed in and try again.