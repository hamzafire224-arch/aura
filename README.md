# AURA - AI-Powered Business Operating System

A premium, production-ready SaaS platform that serves as an AI business partner for entrepreneurs. AURA automates business operations, marketing, content creation, and financial management using multiple AI providers.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** + shadcn/ui components
- **Framer Motion** for animations
- **GSAP** for advanced landing page animations
- **Recharts** for analytics visualizations
- **Lucide React** for icons
- **React Hook Form** + **Zod** for forms
- **TanStack Query** for data fetching
- **Zustand** for state management

### Backend & Database
- **Supabase** (PostgreSQL database, Auth, Storage, Realtime)
- Row Level Security (RLS) enabled on all tables
- Supabase Edge Functions for serverless logic

### AI Providers
- **Anthropic Claude 3.5 Sonnet** (primary AI brain)
- **Google Gemini Pro** (backup/alternative)
- Smart routing: Gemini for simple tasks, Claude for complex ones

### Integrations
- **Resend** (transactional emails + email authentication)
- **LemonSqueezy** (payments, subscriptions, webhooks)
- **Google OAuth** (authentication)

### Deployment
- **Vercel** hosting
- Environment variables management
- Automatic deployments from main branch

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- API keys for:
  - Anthropic Claude
  - Google Gemini
  - Resend
  - LemonSqueezy
  - Google OAuth

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Providers
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key

# Resend
VITE_RESEND_API_KEY=your_resend_api_key

# LemonSqueezy
VITE_LEMONSQUEEZY_STORE_ID=your_store_id
VITE_LEMONSQUEEZY_API_KEY=your_api_key

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# App
VITE_APP_URL=http://localhost:5173
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `database/schema.sql`
4. This will create all necessary tables with RLS policies

### 4. Supabase Configuration

1. Enable Email Auth in Supabase Dashboard → Authentication → Providers
2. Enable Google OAuth:
   - Add your Google OAuth credentials
   - Set redirect URL to: `http://localhost:5173/auth/callback` (dev) and your production URL
3. Configure Email Templates in Authentication → Email Templates

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
aura/
├── database/
│   └── schema.sql          # Database schema with all tables
├── src/
│   ├── components/
│   │   └── ui/             # shadcn/ui components
│   ├── lib/
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # Utility functions
│   ├── pages/
│   │   └── auth/          # Authentication pages
│   ├── store/
│   │   └── authStore.ts   # Zustand auth store
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design System

### Color Palette
- **Primary**: Electric Blue (#3366FF)
- **Secondary**: Purple (#9933FF)
- **Accent**: Teal (#00E5A0)
- **Background**: Dark (#13131A)
- **Foreground**: Off-white (#FAFAFA)

### Typography
- **Headings**: Inter (700-900 weight)
- **Body**: Inter (400-600 weight)
- **Code/Numbers**: JetBrains Mono

## 🔐 Authentication Features

- Email + Password authentication
- Google OAuth
- Magic Link (passwordless)
- Email verification
- Password strength indicator
- Multi-step signup with plan selection
- Referral code support

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚧 Current Status

**All Parts Complete!**

**Part 1:** Foundation & Authentication ✅
- Project setup with Vite + React + TypeScript
- Tailwind CSS with design system
- shadcn/ui components
- Database schema (Supabase)
- Authentication system

**Part 2:** Landing Page & Dashboard ✅
- Complete landing page with animations
- Dashboard layout & navigation
- Overview, Businesses, Content Studio, Analytics pages

**Part 3:** Advanced Features ✅
- Financial Hub with 4 tabs
- Complete Settings page
- Affiliate Dashboard
- AI Provider system
- Email templates

**Part 4:** Polish & Production Ready ✅
- GSAP animations
- Page transitions
- Loading skeletons
- Error handling system
- Performance optimizations
- Security utilities

**Part 5:** Complete Components & Infrastructure ✅
- Enhanced Sidebar component
- Business Wizard with all steps
- AI Loading Animation
- Enhanced Analytics Chart
- Format & Validation utilities
- API route structures
- Testing examples

## 📚 Documentation

- `README.md` - This file (setup instructions)
- `DEPLOYMENT.md` - Deployment guide
- `TESTING.md` - Testing checklist
- `TESTING_EXAMPLES.md` - Testing examples
- `PROJECT_SUMMARY.md` - Complete project overview
- `PART5_SUMMARY.md` - Part 5 details

## 📄 License

Proprietary - All rights reserved

