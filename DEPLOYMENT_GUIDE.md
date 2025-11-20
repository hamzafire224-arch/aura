# AURA Deployment Guide

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- Git installed
- Accounts for:
  - Supabase
  - Vercel
  - Anthropic
  - Google AI
  - Resend
  - LemonSqueezy

### 2. Initial Setup

```bash
# Clone repository (if applicable)
git clone <your-repo-url>
cd aura

# Run setup script
bash setup.sh

# Or manually install
npm install
```

### 3. Environment Variables

Create `.env` file with all required variables (see `.env.example`):

```bash
# Copy example
cp .env.example .env

# Edit .env and fill in all values
```

## 📦 Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Initialize Project

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **aura**
- Directory? **./**
- Override settings? **No**

### Step 4: Add Environment Variables

**Option A: Via Vercel Dashboard**
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add each variable for Production, Preview, and Development

**Option B: Via CLI**

```bash
# Production
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_ANTHROPIC_API_KEY production
vercel env add VITE_GOOGLE_AI_API_KEY production
vercel env add VITE_RESEND_API_KEY production
vercel env add VITE_LEMONSQUEEZY_API_KEY production
vercel env add VITE_LEMONSQUEEZY_STORE_ID production
vercel env add VITE_APP_URL production

# Preview (same variables)
vercel env add VITE_SUPABASE_URL preview
# ... repeat for all variables

# Development (same variables)
vercel env add VITE_SUPABASE_URL development
# ... repeat for all variables
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

### Step 6: Setup Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `aura.ai`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## 🗄️ Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region closest to your users
4. Set database password (save it!)
5. Wait for project to be ready (~2 minutes)

### 2. Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Click "New query"
3. Copy entire contents of `database/schema.sql`
4. Paste and click "Run"
5. Verify all tables created (should see 9 tables)

### 3. Configure Authentication

1. Go to Authentication → Providers
2. Enable Email provider
3. Configure email templates:
   - Welcome email
   - Password reset
   - Email verification
4. Enable Google OAuth:
   - Add Google OAuth credentials
   - Set redirect URL: `https://aura.ai/auth/callback`

### 4. Get API Keys

1. Go to Settings → API
2. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## 🤖 AI Providers Setup

### Anthropic Claude

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create account or login
3. Go to API Keys
4. Create new key
5. Copy key → `VITE_ANTHROPIC_API_KEY`

### Google Gemini

1. Go to [makersuite.google.com](https://makersuite.google.com)
2. Get API key
3. Copy key → `VITE_GOOGLE_AI_API_KEY`

## 💳 LemonSqueezy Setup

### 1. Create Account

1. Go to [lemonsqueezy.com](https://lemonsqueezy.com)
2. Create account
3. Create store

### 2. Create Products

**Product 1: AURA Pro**
- Name: AURA Pro
- Price: $49/month (recurring)
- Or: $470/year (recurring, 20% discount)
- Copy Variant ID → `LEMONSQUEEZY_VARIANT_PRO`

**Product 2: AURA Enterprise**
- Name: AURA Enterprise
- Price: $149/month (recurring)
- Or: $1,430/year (recurring, 20% discount)
- Copy Variant ID → `LEMONSQUEEZY_VARIANT_ENTERPRISE`

### 3. Get API Key

1. Settings → API
2. Create API key
3. Copy → `VITE_LEMONSQUEEZY_API_KEY`
4. Copy Store ID → `VITE_LEMONSQUEEZY_STORE_ID`

### 4. Setup Webhook

1. Settings → Webhooks
2. Add webhook:
   - URL: `https://aura.ai/api/webhooks/lemonsqueezy`
   - Events: All subscription events
3. Copy signing secret → `LEMONSQUEEZY_WEBHOOK_SECRET`

## 📧 Resend Setup

### 1. Create Account

1. Go to [resend.com](https://resend.com)
2. Create account

### 2. Add Domain

1. Go to Domains
2. Add domain: `aura.ai`
3. Add DNS records:
   - TXT record for verification
   - CNAME record for DKIM
4. Wait for verification

### 3. Get API Key

1. Go to API Keys
2. Create API key
3. Copy → `VITE_RESEND_API_KEY`

## 🔧 Supabase Edge Functions

### Deploy Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy businesses-create
supabase functions deploy ai-generate
```

### Set Function Secrets

```bash
supabase secrets set ANTHROPIC_API_KEY=your-key
supabase secrets set GOOGLE_AI_API_KEY=your-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
```

## ✅ Post-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database schema deployed
- [ ] RLS policies active
- [ ] Authentication providers configured
- [ ] LemonSqueezy products created
- [ ] Webhook configured
- [ ] Resend domain verified
- [ ] Edge functions deployed
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Test authentication flow
- [ ] Test payment flow
- [ ] Test AI generation
- [ ] Monitor error logs

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules .vite dist
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_` for client-side access
- Redeploy after adding new variables
- Check Vercel dashboard for typos

### Database Connection Issues

- Verify Supabase URL and keys
- Check RLS policies
- Verify network access

### Payment Issues

- Verify LemonSqueezy webhook URL
- Check webhook secret matches
- Test with LemonSqueezy test mode

## 📊 Monitoring Setup

### Error Tracking (Sentry)

1. Create account at [sentry.io](https://sentry.io)
2. Create React project
3. Install: `npm install @sentry/react`
4. Add DSN to environment variables
5. Initialize in `src/main.tsx`

### Analytics (PostHog)

1. Create account at [posthog.com](https://posthog.com)
2. Get project API key
3. Install: `npm install posthog-js`
4. Initialize in app

### Uptime Monitoring

Use services like:
- UptimeRobot (free tier available)
- Better Uptime
- Pingdom

Monitor:
- Homepage: `https://aura.ai`
- Dashboard: `https://aura.ai/dashboard`
- API health endpoint

## 🎉 Launch!

Once everything is deployed and tested:

1. Announce on social media
2. Post on Product Hunt
3. Share in relevant communities
4. Start collecting feedback
5. Monitor metrics daily

---

**You're ready to launch! 🚀**

