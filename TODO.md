# TODO: Modernize Website with Animations and Icons

## Overview
Enhance the entire website with modern Framer Motion animations (page transitions, staggers, hovers) and lucide-react icons. Covers all pages: auth, home, shop, cart, checkout, profile, etc.

## Steps to Complete

### 1. Global Setup
- [x] Update src/App.tsx: Add AnimatePresence for route transitions (fade/slide).
- [x] Enhance src/components/Button.tsx: Add Framer Motion for hover scale/glow, click ripple.
- [x] Update src/index.css: Add global smooth transitions, keyframes for glow/ripple.

### 2. Authentication Pages
- [x] src/components/LoginScreen.tsx: Replace password SVGs with lucide-react Eye/EyeOff; add stagger animation to form inputs.
- [x] src/components/SignUpScreen.tsx: Add name input animation; replace Google button icon if needed.

### 3. Home & Landing Pages
- [x] src/components/Home.tsx / HomeScreen.tsx: Animate hero section slide-in; stagger HomeCards.
- [x] src/components/LandingPage.tsx: Add parallax or scroll-triggered animations.

### 4. Shop & Products
- [x] src/components/Shop.tsx: Stagger product cards on load; hover lift/scale effects.
- [x] src/components/ProductFeature.tsx: Animate features list.

### 5. Cart & Checkout
- [x] src/components/Cart.tsx: Animate cart items addition/removal; total fade-in.
- [x] src/components/Checkout.tsx: Stepper animations; form staggers.
- [x] src/components/CheckoutSummary.tsx / PaymentMethod.tsx / AddressInformation.tsx: Icon replacements (CreditCard, MapPin), smooth transitions.

### 6. User & Other Pages
- [ ] src/components/Profile.tsx / Settings.tsx: User icon (User), toggle animations.
- [ ] src/components/Subscription.tsx: Animate subscription cards.
- [ ] src/components/About.tsx / Contact.tsx / Seller.tsx: Icon updates (Info, Mail, UserCheck), fade-ins.

### 7. Shared Components
- [ ] src/components/Navigation.tsx: Animate menu items, icon hovers.
- [ ] src/components/Footer.tsx: Subtle slide-up on scroll.
- [ ] src/components/DarkModeToggle.tsx: Smooth icon transition.
- [ ] Other: AnimatedBee.tsx, DrippingHoney.tsx, HoneycombTransition.tsx – enhance if thematic.

### 8. Testing & Polish
- [ ] Run `npm run dev` and test each page: animations smooth, icons render correctly.
- [ ] Browser testing: Interactions (clicks, hovers), mobile responsiveness.
- [ ] Performance: Ensure <60ms layout shifts; optimize if needed.
- [ ] Accessibility: Add aria-labels to icons.

## Progress Tracking
- Started: Current session
- Completed: Mark [x] as done
- Notes: Use lucide-react for all new icons; keep honey theme (warm colors, subtle motions).
