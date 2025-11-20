# AURA Deployment Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase
VITE_SUPABASE_URL=https://etgqeorblzvvwoeqywgt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Z3Flb3JibHp2dndvZXF5d2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzk5MjgsImV4cCI6MjA3ODc1NTkyOH0.EbVMhTlkkBYlgkMh9LS6QH9U44u5jrKWXFbYhlcCWAQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Z3Flb3JibHp2dndvZXF5d2d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzE3OTkyOCwiZXhwIjoyMDc4NzU1OTI4fQ.4dXXjNlAbpPKDnuHSHsQiciEKS-eOzJ_L_EuennoMRE

# AI Providers
VITE_ANTHROPIC_API_KEY=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
VITE_GOOGLE_AI_API_KEY=AIzaSyAEZw4GHheQxTl6ssFUlQkWiooVIK2WlIY

# LemonSqueezy
VITE_LEMONSQUEEZY_API_KEY=xxx
VITE_LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_xxx
LEMONSQUEEZY_VARIANT_PRO=123456
LEMONSQUEEZY_VARIANT_ENTERPRISE=123457

# Resend
VITE_RESEND_API_KEY=re_JheeP32R_PXK3unMx5yBMgyshGCoju6RK

# App
VITE_APP_URL=https://aura.ai
NODE_ENV=production
```

## Vercel Deployment Steps

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Link Project

```bash
vercel link
```

### 4. Add Environment Variables

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_ANTHROPIC_API_KEY
vercel env add VITE_GOOGLE_AI_API_KEY
vercel env add VITE_RESEND_API_KEY
vercel env add VITE_LEMONSQUEEZY_API_KEY
vercel env add VITE_LEMONSQUEEZY_STORE_ID
vercel env add LEMONSQUEEZY_WEBHOOK_SECRET
vercel env add VITE_APP_URL
```

### 5. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Database Setup (Supabase)

### 1. Create Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Migrations

1. Go to SQL Editor in Supabase dashboard
2. Copy the SQL from `database/schema.sql`
3. Run the entire script
4. Verify all tables are created

### 3. Enable Row Level Security

All tables should have RLS enabled (already in schema.sql). Verify:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 4. Test Database Connection

Test the connection from your app to ensure everything works.

## LemonSqueezy Setup

### 1. Create Account

1. Go to [lemonsqueezy.com](https://lemonsqueezy.com)
2. Create an account
3. Create a store

### 2. Create Products

**Product 1: AURA Pro**
- Name: AURA Pro
- Price: $49/month (or $470/year)
- Recurring: Yes
- Copy the variant ID

**Product 2: AURA Enterprise**
- Name: AURA Enterprise
- Price: $149/month (or $1,430/year)
- Recurring: Yes
- Copy the variant ID

### 3. Get API Key

1. Go to Settings > API
2. Generate a new API key
3. Copy the key

### 4. Setup Webhook

1. Go to Settings > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/lemonsqueezy`
3. Select events: All subscription events
4. Copy the signing secret

## Resend Setup

### 1. Create Account

1. Go to [resend.com](https://resend.com)
2. Create an account

### 2. Add Domain

1. Go to Domains
2. Add your domain (e.g., aura.ai)
3. Verify DNS records:
   - Add TXT record for DKIM
   - Add CNAME record for domain verification

### 3. Get API Key

1. Go to API Keys
2. Create a new API key
3. Copy the key

### 4. Test Email

```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "AURA <notifications@aura.ai>",
    "to": "test@example.com",
    "subject": "Test",
    "html": "<p>It works!</p>"
  }'
```

## Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] RLS policies active
- [ ] LemonSqueezy products created
- [ ] Webhook configured
- [ ] Resend domain verified
- [ ] Email sending tested
- [ ] Authentication working
- [ ] AI generation working
- [ ] Payment flow tested
- [ ] Error tracking configured
- [ ] Analytics configured

## Monitoring

### Error Tracking

Set up Sentry or similar:

```typescript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### Analytics

Set up PostHog, Mixpanel, or Google Analytics to track:
- User signups
- Feature usage
- Revenue metrics
- Error rates

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- Better Uptime

Monitor:
- Homepage
- Dashboard
- API endpoints

