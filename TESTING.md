# AURA Testing Checklist

## Pre-Launch Testing

### Authentication

- [ ] Email signup works
- [ ] Email verification works
- [ ] Google OAuth works
- [ ] Login works
- [ ] Password reset works
- [ ] Magic link works
- [ ] Session persistence works
- [ ] Logout works

### Business Creation

- [ ] Wizard completes all steps
- [ ] AI generation works
- [ ] Business saves to database
- [ ] All fields editable
- [ ] Can create multiple businesses (if plan allows)
- [ ] Business limit enforced
- [ ] Business deletion works

### AI Generation

- [ ] Product descriptions generate
- [ ] Social posts generate
- [ ] Blog posts generate
- [ ] Ad copy generates
- [ ] Credits deduct properly
- [ ] Error handling when credits run out
- [ ] Both Claude and Gemini work
- [ ] Fallback to alternative provider works
- [ ] Generation speed acceptable (< 10s)

### Payment Flow

- [ ] Can view pricing page
- [ ] Can click upgrade
- [ ] Redirects to LemonSqueezy checkout
- [ ] Payment processes
- [ ] Webhook updates user plan
- [ ] Dashboard reflects new plan
- [ ] Credits updated
- [ ] Subscription cancellation works
- [ ] Plan downgrade works

### Dashboard

- [ ] All pages load
- [ ] Data fetches correctly
- [ ] Charts render
- [ ] Actions work (edit, delete, etc.)
- [ ] Mobile responsive
- [ ] Loading states show
- [ ] Error states show
- [ ] Empty states show

### Financial Hub

- [ ] P&L statement accurate
- [ ] Charts render correctly
- [ ] Reinvestment planner works
- [ ] Scenarios apply correctly
- [ ] Investment education loads

### Affiliate Program

- [ ] Can generate referral link
- [ ] Referrals tracked
- [ ] Commissions calculated correctly
- [ ] Dashboard shows stats
- [ ] Payout history accurate
- [ ] Payment method updates

### Settings

- [ ] Profile updates save
- [ ] Password change works
- [ ] 2FA setup works
- [ ] Active sessions display
- [ ] Billing info updates
- [ ] Notifications save
- [ ] Integrations connect
- [ ] Account deletion works

### Email Notifications

- [ ] Welcome email sends
- [ ] Verification email sends
- [ ] Upgrade confirmation sends
- [ ] Affiliate notifications send
- [ ] Password reset email sends
- [ ] All emails render correctly

### Performance

- [ ] Page load < 3 seconds
- [ ] No console errors
- [ ] Images optimized
- [ ] Lighthouse score > 90
- [ ] No memory leaks
- [ ] Smooth animations (60fps)

### Security

- [ ] Can't access other users' data
- [ ] API routes protected
- [ ] Rate limiting works
- [ ] Input validation works
- [ ] XSS prevention works
- [ ] SQL injection prevented
- [ ] CSRF protection works

### Mobile

- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] All features work
- [ ] Looks good on small screens
- [ ] Touch interactions work
- [ ] Keyboard doesn't break layout

### Cross-Browser

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

## Post-Launch Monitoring

### Metrics to Track

**Acquisition**
- Website visitors
- Signup conversions
- Traffic sources
- Cost per acquisition

**Activation**
- % who complete onboarding
- % who create first business
- % who generate first content
- Time to first value

**Revenue**
- Free users
- Paid users
- MRR (Monthly Recurring Revenue)
- Churn rate
- LTV (Lifetime Value)
- CAC (Customer Acquisition Cost)

**Engagement**
- DAU / MAU (Daily/Monthly Active Users)
- Features used per session
- Content generated per user
- Businesses per user

**Retention**
- Day 1, 7, 30 retention
- Weekly active users
- Monthly active users

**Referral**
- Affiliate signups
- Referral conversion rate
- Virality coefficient

## Error Tracking

Set up error tracking (Sentry recommended):

```typescript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

## Performance Monitoring

- Use Lighthouse CI
- Set up Web Vitals tracking
- Monitor Core Web Vitals:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

## Uptime Monitoring

Monitor these endpoints:
- Homepage: `https://aura.ai`
- Dashboard: `https://aura.ai/dashboard`
- API health: `https://aura.ai/api/health`

Set up alerts for:
- Downtime > 1 minute
- Error rate > 1%
- Response time > 5 seconds

