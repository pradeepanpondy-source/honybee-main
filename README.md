# 🐝 Bee Bridge

**An E-commerce Platform Connecting Beekeepers with Honey Enthusiasts**

Bee Bridge is a full-stack web application that serves as a marketplace for honey products and beekeeping supplies. The platform enables sellers to list their products, manage inventory, and connect with customers interested in authentic, locally-sourced honey.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-demo-url.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com/)

---

## ✨ Features

### For Customers
- 🛒 **Browse Products** - Explore a curated selection of honey and beekeeping supplies
- 🛍️ **Shopping Cart** - Add items to cart with quantity limits (max 5 per item)
- 💳 **Secure Checkout** - Streamlined checkout process with order management
- 👤 **User Authentication** - Sign up/login with email or Google OAuth
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### For Sellers
- 📦 **Product Management** - Add, edit, and manage product listings
- 📊 **Analytics Dashboard** - Track sales, views, and performance metrics
- 🔔 **Order Notifications** - Real-time updates on new orders
- 👥 **Customer Interaction** - Direct contact through the platform

### Technical Highlights
- ⚡ **Real-time Updates** - Live inventory and order status using Supabase Realtime
- 🔐 **Secure Authentication** - JWT-based auth with Google OAuth integration
- 🎨 **Modern UI/UX** - Clean, intuitive interface with Tailwind CSS
- 📈 **Scalable Architecture** - Built with performance and scalability in mind

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library with hooks
- **TypeScript 5.5** - Type-safe JavaScript
- **Vite 7.2** - Lightning-fast build tool
- **React Router 7.8** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icon library

### Backend & Services
- **Supabase** - Backend-as-a-Service (PostgreSQL database, Authentication, Real-time subscriptions)
- **Google OAuth** - Third-party authentication
- **Vercel** - Serverless functions for API endpoints

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Autoprefixer** - CSS vendor prefixing
- **Zod** - Schema validation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22.x or higher
- npm or yarn package manager
- Supabase account ([Sign up here](https://supabase.com))
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pradeep23122006/Beebridge.git
   cd Beebridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your credentials in `.env`:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google OAuth
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase project:
   - `users` - User profiles
   - `products` - Product listings
   - `orders` - Customer orders
   - `sellers` - Seller information
   
   (Refer to `backend/` directory for schema details)

5. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
honybee-main/
├── src/
│   ├── components/        # React components
│   │   ├── Shop.tsx       # Product listing page
│   │   ├── CartPage.tsx   # Shopping cart
│   │   ├── Orders.tsx     # Order management
│   │   └── ...
│   ├── contexts/          # React contexts (Cart, Auth)
│   ├── lib/               # Utilities and configurations
│   │   └── supabase.ts    # Supabase client setup
│   ├── utils/             # Helper functions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── api/                   # Serverless API functions
├── backend/               # Database schemas and migrations
├── public/                # Static assets
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

---

## 🎯 Key Learnings & Challenges

### Technical Achievements
- Implemented **real-time inventory management** using Supabase subscriptions
- Built a **type-safe** application with TypeScript, reducing runtime errors
- Designed a **responsive UI** that works seamlessly across all devices
- Integrated **OAuth authentication** for improved user experience
- Optimized **performance** with code splitting and lazy loading

### Challenges Overcome
- **State Management** - Implemented efficient cart state management with React Context
- **Authentication Flow** - Handled complex auth flows including OAuth callbacks
- **Data Validation** - Used Zod for robust form and API validation
- **Real-time Sync** - Managed real-time data synchronization across multiple users

---

## 🔒 Security

- Environment variables are **never committed** to version control
- All API keys are stored securely in `.env` file
- Supabase Row Level Security (RLS) policies protect user data
- JWT tokens for secure authentication
- Input validation on both client and server side

---

## 📸 Screenshots

*Coming soon - Add screenshots of your application here*

---

## 🚧 Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Advanced search and filtering
- [ ] Product reviews and ratings
- [ ] Seller verification system
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Multi-language support

---

## 👨‍💻 About This Project

This project was developed as a **portfolio piece** to demonstrate full-stack web development skills. It showcases:
- Modern React development practices
- TypeScript for type safety
- Backend integration with Supabase
- Authentication and authorization
- Responsive design principles
- State management
- API integration

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📧 Contact

**Pradeep**
- GitHub: [@pradeep23122006](https://github.com/pradeep23122006)
- Project Link: [https://github.com/pradeep23122006/Beebridge](https://github.com/pradeep23122006/Beebridge)

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the excellent backend platform
- [Vercel](https://vercel.com/) for hosting
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) community for amazing tools and libraries

---

**⭐ If you found this project interesting, please consider giving it a star!**
