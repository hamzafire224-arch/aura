# Pre-Deployment Checklist

## Local Testing

- [ ] `npm run type-check` - no TypeScript errors
- [ ] `npm run build` - builds successfully
- [ ] `npm run preview` - preview works locally
- [ ] All environment variables in `.env`
- [ ] Test authentication flow
- [ ] Test AI generation
- [ ] Test navigation between pages

## Vercel Setup

- [ ] Push code to GitHub
- [ ] Import project to Vercel
- [ ] Add all environment variables
- [ ] Update VITE_APP_URL to Vercel URL
- [ ] Deploy and test

## Post-Deployment

- [ ] Test live authentication
- [ ] Test live AI generation
- [ ] Test payment flow (test mode)
- [ ] Check browser console for errors
- [ ] Test on mobile device
- [ ] Setup custom domain (if ready)

