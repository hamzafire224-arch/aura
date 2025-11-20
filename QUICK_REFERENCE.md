# AURA Quick Reference Guide

## 🚀 Essential Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

### Database (Supabase)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Initialize (if using local dev)
supabase init

# Start local Supabase
supabase start

# Link to remote project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy businesses-create
supabase functions deploy ai-generate

# View function logs
supabase functions logs businesses-create
```

### Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

## 📍 Important URLs

### Local Development
- **App**: http://localhost:5173
- **Vite HMR**: http://localhost:5173

### Services
- **Supabase Dashboard**: https://app.supabase.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **LemonSqueezy**: https://app.lemonsqueezy.com
- **Resend Dashboard**: https://resend.com/emails
- **Anthropic Console**: https://console.anthropic.com
- **Google AI Studio**: https://makersuite.google.com

### Documentation
- **Next.js Docs**: https://nextjs.org/docs (for reference)
- **Vite Docs**: https://vitejs.dev
- **Supabase Docs**: https://supabase.com/docs
- **shadcn/ui Docs**: https://ui.shadcn.com
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Anthropic Docs**: https://docs.anthropic.com
- **React Router Docs**: https://reactrouter.com

## 🔑 Environment Variables

### Required Variables

```bash
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Server-side only

# AI Providers
VITE_ANTHROPIC_API_KEY=
VITE_GOOGLE_AI_API_KEY=

# LemonSqueezy
VITE_LEMONSQUEEZY_API_KEY=
VITE_LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=  # Server-side only
LEMONSQUEEZY_VARIANT_PRO=
LEMONSQUEEZY_VARIANT_ENTERPRISE=

# Resend
VITE_RESEND_API_KEY=

# App
VITE_APP_URL=
NODE_ENV=
```

### Getting API Keys

1. **Supabase**: Settings → API
2. **Anthropic**: Console → API Keys
3. **Google AI**: AI Studio → Get API Key
4. **LemonSqueezy**: Settings → API
5. **Resend**: API Keys section

## 📁 Key File Locations

### Configuration
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS config
- `tsconfig.json` - TypeScript config
- `.eslintrc.cjs` - ESLint config
- `.prettierrc` - Prettier config
- `.env` - Environment variables (not in git)

### Source Code
- `src/App.tsx` - Main app component
- `src/main.tsx` - Entry point
- `src/pages/` - All page components
- `src/components/` - Reusable components
- `src/lib/` - Utilities and helpers
- `src/store/` - State management

### Database
- `database/schema.sql` - Complete database schema

### Documentation
- `README.md` - Setup instructions
- `DEPLOYMENT.md` - Deployment guide
- `TESTING.md` - Testing checklist
- `PRE_LAUNCH_CHECKLIST.md` - Launch checklist
- `QUICK_REFERENCE.md` - This file

## 🛠️ Common Tasks

### Add a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `DashboardLayout.tsx`

### Add a New UI Component

1. Create in `src/components/ui/`
2. Follow shadcn/ui patterns
3. Export from component file

### Add a New API Endpoint

1. Create Supabase Edge Function in `supabase/functions/`
2. Deploy: `supabase functions deploy function-name`
3. Call from frontend: `fetch('/api/function-name')`

### Debug Issues

```bash
# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint

# Clear build cache
rm -rf .vite dist node_modules/.vite

# Check environment variables
cat .env

# View Supabase logs
supabase functions logs function-name

# View Vercel logs
vercel logs
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear everything and reinstall
rm -rf node_modules .vite dist package-lock.json
npm install
npm run build
```

### Type Errors

```bash
# Regenerate types
npm run type-check

# Check for missing types
npm install -D @types/package-name
```

### Environment Variable Issues

- Ensure variables start with `VITE_` for client access
- Restart dev server after changing `.env`
- Check Vercel dashboard for production variables

### Database Issues

- Verify Supabase connection
- Check RLS policies
- Verify table structure matches schema

## 📊 Monitoring Commands

```bash
# View function logs
supabase functions logs businesses-create --tail

# View Vercel logs
vercel logs --follow

# Check build size
npm run build
du -sh dist
```

## 🎯 Key Metrics to Track

- **MRR**: Monthly Recurring Revenue
- **Churn Rate**: % of users who cancel
- **LTV**: Lifetime Value
- **CAC**: Customer Acquisition Cost
- **DAU/MAU**: Daily/Monthly Active Users
- **Conversion Rate**: Signups / Visitors
- **Viral Coefficient**: Referrals per user

## 💡 Pro Tips

1. **Use TypeScript**: Catch errors early
2. **Format before commit**: `npm run format`
3. **Check types**: `npm run type-check`
4. **Test locally**: Always test before deploying
5. **Monitor logs**: Watch for errors in production
6. **Backup database**: Regular backups of Supabase
7. **Version control**: Commit frequently
8. **Document changes**: Update README when needed

## 🆘 Getting Help

1. Check documentation files
2. Review error messages carefully
3. Check Supabase/Vercel status pages
4. Search error messages online
5. Review code comments
6. Check GitHub issues (if public)

---

**Keep this guide handy for quick reference! 📚**

