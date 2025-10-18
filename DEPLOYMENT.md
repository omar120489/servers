# Deployment Guide - Traffic CRM Frontend

This guide covers deploying the Traffic CRM frontend to Vercel with staging and production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Vercel Setup](#vercel-setup)
- [Deployment Process](#deployment-process)
- [Verification](#verification)
- [Rollback Procedures](#rollback-procedures)
- [Custom Domain Setup](#custom-domain-setup)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. **Git Repository**: Code pushed to GitHub, GitLab, or Bitbucket
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **API Endpoints**: Production and staging API URLs available
4. **Node.js 18+**: For local builds and testing

## Quick Start

### Local Build Test

Before deploying, verify the build works locally:

```bash
# Install dependencies
npm ci

# Test production build
npm run build

# Test staging build (requires env-cmd)
npm install -D env-cmd
npm run build:staging

# Serve locally to test
npx serve -s build
```

Visit `http://localhost:3000` to verify the build works correctly.

## Environment Configuration

### Environment Variables

The application uses these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `https://api.example.com/api/v1` |
| `REACT_APP_WS_URL` | WebSocket endpoint URL | `wss://api.example.com/ws` |

### Environment Files

Three environment files are configured:

1. **`.env.production`** - Production defaults (tracked in Git)
2. **`.env.staging`** - Staging defaults (tracked in Git)
3. **`.env.local`** - Local development overrides (not tracked)

**Note**: Vercel environment variables override these files.

## Vercel Setup

### Step 1: Import Project

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your Git repository
4. Select the repository: `traffic-crm-frontend-ts`

### Step 2: Configure Build Settings

Vercel should auto-detect Create React App. Verify these settings:

- **Framework Preset**: `Create React App`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm ci`
- **Node.js Version**: `18.x`

### Step 3: Set Environment Variables

Navigate to **Project Settings → Environment Variables**

#### Production Environment

Set these for **Production** (main branch only):

```text
REACT_APP_API_URL = https://api.example.com/api/v1
REACT_APP_WS_URL = wss://api.example.com/ws
```

#### Preview/Staging Environment

Set these for **Preview** (all branches):

```text
REACT_APP_API_URL = https://staging-api.example.com/api/v1
REACT_APP_WS_URL = wss://staging-api.example.com/ws
```

**Important**: After adding environment variables, trigger a redeploy for changes to take effect.

### Step 4: Configure Git Integration

1. **Production Branch**: Set to `main` (or `master`)
2. **Preview Deployments**: Enable for all branches
3. **Automatic Deployments**: Enable
4. **Comments on Pull Requests**: Enable (recommended)

## Deployment Process

### Production Deployment

Production deploys automatically when you push to the `main` branch:

```bash
git checkout main
git pull origin main
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will:

1. Detect the push
2. Run `npm ci`
3. Run `npm run build`
4. Deploy to production URL
5. Comment on the commit with the deployment URL

### Staging/Preview Deployment

Preview deploys automatically for pull requests:

```bash
git checkout -b feature/my-feature
# Make your changes
git add .
git commit -m "Add new feature"
git push origin feature/my-feature
# Create a pull request on GitHub/GitLab
```

Vercel will:

1. Deploy a preview environment
2. Comment on the PR with the preview URL
3. Update the preview on each new commit

### Manual Deployment

To manually trigger a deployment:

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on any previous deployment
4. Or use Vercel CLI:

```bash
npm install -g vercel
vercel --prod  # Deploy to production
vercel         # Deploy preview
```

## Verification

### Post-Deployment Checklist

After each deployment, verify:

#### 1. Application Loads

- [ ] Visit the deployment URL
- [ ] Application loads without errors
- [ ] No console errors in browser DevTools

#### 2. Routing Works

- [ ] Navigate to `/dashboard`
- [ ] Navigate to `/contacts`
- [ ] Navigate to `/deals`
- [ ] Navigate to `/pipeline`
- [ ] Navigate to `/reports`
- [ ] Refresh page on each route (should not 404)
- [ ] Browser back/forward buttons work

#### 3. API Connectivity

- [ ] Open DevTools Network tab
- [ ] Verify API calls go to correct endpoint
- [ ] Check for CORS errors
- [ ] Test login flow
- [ ] Test token refresh (wait for token expiry)

#### 4. WebSocket Connection

- [ ] Open DevTools Console
- [ ] Look for WebSocket connection logs
- [ ] Verify connection to correct WS endpoint
- [ ] Test real-time features (if applicable)

#### 5. Performance

- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Check bundle size (should be ~280KB gzipped)
- [ ] Verify static assets are cached (Network tab)
- [ ] Test on mobile device

### Environment-Specific Checks

**Production**:

- API calls use `https://api.example.com/api/v1`
- WebSocket connects to `wss://api.example.com/ws`
- No staging/debug features visible

**Staging/Preview**:

- API calls use `https://staging-api.example.com/api/v1`
- WebSocket connects to `wss://staging-api.example.com/ws`
- Preview URL format: `https://traffic-crm-frontend-ts-<hash>.vercel.app`

## Rollback Procedures

### Instant Rollback via Dashboard

If a deployment introduces issues:

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Find the last known good deployment
3. Click the **three dots** menu (⋯)
4. Select **"Promote to Production"**
5. Confirm the promotion

**Time to rollback**: ~30 seconds

### Rollback via Git

For a more permanent rollback:

```bash
# Find the commit to roll back to
# cSpell:ignore oneline
git log --oneline

# Create a revert commit
git revert <bad-commit-hash>
git push origin main

# Or reset to previous commit (use with caution)
git reset --hard <good-commit-hash>
git push origin main --force
```

**Note**: Force push requires coordination with team.

### Rollback via Vercel CLI

```bash
vercel rollback
```

## Custom Domain Setup

<!-- cSpell:ignore yourdomain -->

### Add Production Domain

1. Go to **Project Settings → Domains**
2. Click **"Add"**
3. Enter your domain: `app.yourdomain.com`
4. Vercel will provide DNS records to add:

```text
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

1. Add the DNS record at your domain registrar
2. Wait for DNS propagation (5-30 minutes)
3. Vercel will automatically provision SSL certificate

### Add Staging Subdomain

For a dedicated staging URL:

1. Add domain: `staging.yourdomain.com`
2. Assign it to **Preview** environment
3. Configure DNS:

```text
Type: CNAME
Name: staging
Value: cname.vercel-dns.com
```

### Redirect Root Domain

To redirect `yourdomain.com` → `app.yourdomain.com`:

1. Add `yourdomain.com` as a domain
2. Vercel will automatically redirect to `app.yourdomain.com`

## Troubleshooting

### Build Fails

**Error**: `Module not found` or `Cannot resolve`

**Solution**:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` locally
3. Commit the new `package-lock.json`
4. Push to trigger new build

**Error**: `Out of memory`

**Solution**:

1. Check bundle size: `npm run build`
2. Optimize imports (use tree-shaking)
3. Consider code splitting
4. Contact Vercel support for memory limit increase

### 404 on Routes

**Error**: Refreshing `/deals` returns 404

**Solution**:

- Verify `vercel.json` exists with SPA rewrites
- Check the rewrite rule: `{ "source": "/(.*)", "destination": "/index.html" }`
- Redeploy after adding `vercel.json`

### API Calls Fail

**Error**: `Network Error` or `CORS` errors

**Solution**:

1. Verify environment variables are set correctly
2. Check API endpoint is accessible: `curl https://api.example.com/api/v1/health`
3. Ensure backend CORS allows Vercel domain
4. Check browser console for exact error

**Error**: API calls use wrong URL

**Solution**:

1. Check environment variables in Vercel Dashboard
2. Verify correct environment (Production vs Preview)
3. Trigger a redeploy after changing env vars
4. Clear browser cache

### WebSocket Connection Fails

**Error**: `WebSocket connection failed`

**Solution**:

1. Verify `REACT_APP_WS_URL` is set
2. Check WebSocket endpoint is accessible
3. Ensure `wss://` (not `ws://`) for production
4. Check backend WebSocket CORS/origin settings

### Slow Build Times

**Issue**: Builds take >5 minutes

**Solution**:

1. Check for large dependencies
2. Use `npm ci` instead of `npm install`
3. Remove unused dependencies
4. Consider caching strategies

### Environment Variables Not Working

**Issue**: App uses wrong API URL

**Solution**:

1. Environment variables must start with `REACT_APP_`
2. Redeploy after changing env vars (they're baked into build)
3. Check correct environment is selected (Production/Preview)
4. Clear browser cache and hard refresh

## Monitoring and Maintenance

### Enable Monitoring

1. **Vercel Analytics**: Enable in Project Settings
2. **Error Tracking**: Integrate Sentry or similar
3. **Uptime Monitoring**: Use UptimeRobot or Pingdom
4. **Logs**: View in Vercel Dashboard → Functions tab

### Regular Maintenance

- **Weekly**: Review deployment logs for errors
- **Monthly**: Check bundle size and performance
- **Quarterly**: Update dependencies (`npm outdated`)
- **As needed**: Review and rotate API keys

### Notifications

Set up notifications in Vercel:

1. Go to **Project Settings → Notifications**
2. Enable:
   - Deployment Started
   - Deployment Ready
   - Deployment Failed
3. Choose notification method (Email, Slack, Discord)

## Security Best Practices

1. **Never commit secrets**: Use Vercel environment variables
2. **Use HTTPS**: Always use `https://` for API URLs
3. **Enable security headers**: Already configured in `vercel.json`
4. **Regular updates**: Keep dependencies updated
5. **Review deployments**: Check each deployment before promoting
6. **Limit access**: Use Vercel Teams for access control

## Support and Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Create React App**: [create-react-app.dev](https://create-react-app.dev)
- **Project Issues**: [GitHub Issues](https://github.com/your-org/traffic-crm-frontend-ts/issues)

## Appendix

### Vercel CLI Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# List deployments
vercel ls

# View logs
vercel logs <deployment-url>

# Remove deployment
vercel remove <deployment-name>

# Rollback
vercel rollback
```

### Build Scripts Reference

```bash
# Development
npm start                 # Start dev server (port 3000)

# Production builds
npm run build            # Build with .env.production
npm run build:production # Explicit production build
npm run build:staging    # Build with .env.staging

# Testing
npm test                 # Run unit tests
npm run test:e2e         # Run Playwright E2E tests
npm run e2e:ui           # Run E2E tests in UI mode

# Utilities
npm run lint             # Run linter
npm run smoke            # Run smoke tests against backend
```

### File Structure

```text
traffic-crm-frontend-ts/
├── .env.production          # Production env vars (tracked)
├── .env.staging             # Staging env vars (tracked)
├── .env.local               # Local overrides (not tracked)
├── .gitignore               # Git ignore rules
├── vercel.json              # Vercel configuration
├── DEPLOYMENT.md            # This file
├── package.json             # Dependencies and scripts
├── public/                  # Static assets
├── src/                     # Source code
└── build/                   # Production build output
```

---

**Last Updated**: 2025-10-18

**Maintained By**: DevOps Team

**Questions?** Open an issue or contact the team lead.
