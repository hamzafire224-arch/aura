# Vercel Deployment Steps

## 1. Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## 2. Import to Vercel

1. Go to vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration

## 3. Configure Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

**For all environments (Production, Preview, Development):**

```
VITE_SUPABASE_URL = https://etgqeorblzvvwoeqywgt.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ANTHROPIC_API_KEY = sk-ant-api03-_WY70GUF6KIyOX28WHNfWhp...
VITE_GOOGLE_AI_API_KEY = AIzaSyAEZw4GHheQxTl6ssFUlQkWiooVIK2WlIY
VITE_RESEND_API_KEY = re_JheeP32R_PXK3unMx5yBMgyshGCoju6RK
VITE_LEMONSQUEEZY_API_KEY = [your-key]
VITE_LEMONSQUEEZY_STORE_ID = [your-store-id]
VITE_LEMONSQUEEZY_VARIANT_PRO = [variant-id]
VITE_LEMONSQUEEZY_VARIANT_ENTERPRISE = [variant-id]
NODE_ENV = production
```

**IMPORTANT:** Update this one after deployment:

```
VITE_APP_URL = https://your-project.vercel.app
```

## 4. Deploy

Click "Deploy" and wait for build to complete (2-3 minutes)

## 5. Update VITE_APP_URL

After first deployment:

1. Copy your Vercel URL (e.g., `https://aura-abc123.vercel.app`)
2. Go to Settings → Environment Variables
3. Update `VITE_APP_URL` to your Vercel URL
4. Redeploy: Deployments → Latest → "Redeploy"

## 6. Test Deployment

- [ ] Visit your Vercel URL
- [ ] Test authentication
- [ ] Test AI generation
- [ ] Check browser console for errors
- [ ] Test on mobile

## 7. Setup Custom Domain (Optional)

1. Settings → Domains
2. Add your domain: `getaura.ai`
3. Update nameservers at your registrar
4. Wait for DNS propagation (24-48 hours)
5. Update `VITE_APP_URL` to `https://getaura.ai`
6. Redeploy

