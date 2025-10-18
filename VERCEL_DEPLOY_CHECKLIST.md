# Vercel Deployment Checklist

## ✅ Pre-Deployment Validation (Complete)

- [x] `vercel.json` created with SPA rewrites and caching headers
- [x] `.env.production` created with production API/WebSocket URLs
- [x] `.env.staging` created with staging API/WebSocket URLs
- [x] `.gitignore` updated to track environment files
- [x] `package.json` updated with `build:staging` and `build:production` scripts
- [x] `DEPLOYMENT.md` created with comprehensive guide
- [x] Production build successful (`npm run build`)
- [x] All files are lint-free

## 🚀 Deployment Steps

### Step 1: Push to Git Repository

```bash
git add .
git commit -m "Add Vercel deployment configuration

- Add vercel.json with SPA rewrites and security headers
- Add .env.production and .env.staging
- Update .gitignore to track deployment env files
- Add deployment documentation
- Add build:staging and build:production scripts"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Choose your repository: `traffic-crm-frontend-ts`
5. Click **"Import"**

### Step 3: Configure Build Settings

Vercel should auto-detect these settings. Verify:

- **Framework Preset**: `Create React App`
- **Root Directory**: `./` (leave empty)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm ci`
- **Node.js Version**: `18.x`

Click **"Deploy"** to proceed (this first deployment will use default env vars).

### Step 4: Configure Environment Variables

**Important**: Vercel does NOT read `.env.production` or `.env.staging` from your repository. You must set these in the dashboard.

1. Go to **Project Settings** → **Environment Variables**
2. Add the following variables:

#### Production Environment

Select **"Production"** and **"main"** branch:

| Variable Name | Value |
|---------------|-------|
| `REACT_APP_API_URL` | `https://api.example.com/api/v1` |
| `REACT_APP_WS_URL` | `wss://api.example.com/ws` |

#### Preview Environment

Select **"Preview"** and **"All"** branches:

| Variable Name | Value |
|---------------|-------|
| `REACT_APP_API_URL` | `https://staging-api.example.com/api/v1` |
| `REACT_APP_WS_URL` | `wss://staging-api.example.com/ws` |

### Step 5: Redeploy with Environment Variables

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **three dots (⋯)** on the latest deployment
3. Select **"Redeploy"**
4. Confirm the redeploy

This ensures your environment variables are baked into the build.

## ✅ Post-Deployment Verification

### Production Deployment Checks

Visit your production URL (e.g., `https://traffic-crm-frontend-ts.vercel.app`):

- [ ] Application loads without errors
- [ ] No console errors in browser DevTools
- [ ] Navigate to `/dashboard` - works
- [ ] Navigate to `/contacts` - works
- [ ] Navigate to `/deals` - works
- [ ] Navigate to `/pipeline` - works
- [ ] Navigate to `/reports` - works
- [ ] Refresh on `/deals` - does NOT 404 (SPA routing works)
- [ ] Browser back/forward buttons work
- [ ] Open DevTools Network tab
- [ ] Verify API calls go to `https://api.example.com/api/v1`
- [ ] Verify WebSocket connects to `wss://api.example.com/ws`
- [ ] Test login flow
- [ ] Test token refresh (wait for expiry or force refresh)
- [ ] Check static assets have `Cache-Control: public, max-age=31536000, immutable`

### Preview Deployment Checks

Create a test branch and PR:

```bash
git checkout -b test/preview-deployment
git push origin test/preview-deployment
```

Create a pull request on GitHub/GitLab. Vercel will:

- Comment on the PR with a preview URL
- Deploy automatically

Visit the preview URL:

- [ ] Application loads
- [ ] API calls go to `https://staging-api.example.com/api/v1`
- [ ] WebSocket connects to `wss://staging-api.example.com/ws`
- [ ] All routes work correctly

### Performance Checks

- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Check bundle size: ~280KB gzipped (acceptable for CRA)
- [ ] Verify gzip compression is active (check Response Headers)
- [ ] Test on mobile device

## 🔒 Backend CORS Configuration

Ensure your backend API allows requests from Vercel domains:

### Production Backend

Add these origins to your CORS whitelist:

```text
https://traffic-crm-frontend-ts.vercel.app
https://traffic-crm-frontend-ts-*.vercel.app
```

### Staging Backend

Add these origins:

```text
https://traffic-crm-frontend-ts-*.vercel.app
```

**Tip**: Use wildcard patterns if your backend supports it:

```text
https://*.vercel.app
```

## 🎯 Optional Enhancements

### Branch Protection

Configure Git Integration:

1. **Project Settings** → **Git**
2. **Production Branch**: `main`
3. **Preview Deployments**: Enable for all branches
4. **Automatic Deployments**: Enable
5. **Comments on Pull Requests**: Enable

### Preview Protection

Protect preview deployments:

1. **Project Settings** → **Deployment Protection**
2. Enable **"Password Protection"** for Preview deployments
3. Set a password (share with team)

### Custom Domain

Add your custom domain:

1. **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter: `app.yourdomain.com`
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (~5 minutes)

For staging subdomain:

1. Add: `staging.yourdomain.com`
2. Assign to **Preview** environment
3. Configure DNS

### Notifications

Set up deployment notifications:

1. **Project Settings** → **Notifications**
2. Enable:
   - Deployment Started
   - Deployment Ready
   - Deployment Failed
3. Choose method: Email, Slack, or Discord

### Monitoring

Enable Vercel Analytics:

1. **Analytics** tab
2. Click **"Enable Analytics"**
3. Free tier includes:
   - Page views
   - Top pages
   - Top referrers
   - Device breakdown

## 🔄 Continuous Deployment Workflow

### Production Deployment

```bash
git checkout main
git pull origin main
# Make changes
git add .
git commit -m "Your changes"
git push origin main
```

Vercel automatically:

1. Detects the push
2. Runs `npm ci`
3. Runs `npm run build`
4. Deploys to production
5. Comments on commit with URL

### Preview Deployment

```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create PR on GitHub/GitLab
```

Vercel automatically:

1. Deploys preview environment
2. Comments on PR with preview URL
3. Updates preview on each commit

## 🚨 Troubleshooting

### Issue: Environment Variables Not Working

**Symptom**: App uses wrong API URL

**Solution**:

1. Verify variables are set in Vercel Dashboard
2. Check correct environment (Production vs Preview)
3. **Redeploy** after changing env vars (they're baked into build)
4. Clear browser cache and hard refresh

### Issue: 404 on Routes

**Symptom**: Refreshing `/deals` returns 404

**Solution**:

1. Verify `vercel.json` exists in repository
2. Check the rewrite rule is correct
3. Redeploy

### Issue: CORS Errors

**Symptom**: API calls fail with CORS error

**Solution**:

1. Add Vercel domain to backend CORS whitelist
2. Ensure backend allows `https://*.vercel.app`
3. Check preflight OPTIONS requests are handled

### Issue: WebSocket Connection Fails

**Symptom**: WebSocket won't connect

**Solution**:

1. Verify `REACT_APP_WS_URL` is set in Vercel
2. Ensure using `wss://` (not `ws://`)
3. Check backend WebSocket CORS/origin settings
4. Redeploy after fixing

## 📊 Monitoring Checklist

### Daily

- [ ] Check Vercel Dashboard for failed deployments
- [ ] Review error logs (if integrated with Sentry)

### Weekly

- [ ] Review Analytics for traffic patterns
- [ ] Check bundle size hasn't increased significantly
- [ ] Review deployment logs for warnings

### Monthly

- [ ] Run `npm outdated` to check for updates
- [ ] Review and update dependencies (test in preview first)
- [ ] Check Lighthouse scores
- [ ] Review and rotate API keys if needed

## 🔐 Security Checklist

- [x] Security headers configured in `vercel.json`
- [x] Environment variables stored in Vercel (not in code)
- [x] HTTPS enforced (automatic with Vercel)
- [ ] Backend CORS properly configured
- [ ] Preview deployments password-protected (optional)
- [ ] Regular dependency updates scheduled
- [ ] Error tracking integrated (Sentry recommended)

## 📝 Important Notes

1. **MUI X Versions**: Keep `@mui/x-charts@^7.18.0` and `@mui/x-data-grid@^7.18.0` pinned until CRA is upgraded or you migrate to Next.js

2. **Environment Variables**: Changes to env vars require a redeploy to take effect (they're compiled into the build)

3. **Rollback**: Instant rollback available via Vercel Dashboard → Deployments → Promote to Production

4. **Preview Cleanup**: Preview deployments auto-delete after 30 days

5. **Build Time**: Typical build time is 1-2 minutes

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Production URL loads without errors
- ✅ All routes work and don't 404 on refresh
- ✅ API calls use correct production endpoint
- ✅ WebSocket connects successfully
- ✅ Authentication flow works end-to-end
- ✅ Preview deployments work for PRs
- ✅ Static assets are cached properly
- ✅ Lighthouse scores are 90+

## 📚 Resources

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Comprehensive deployment guide
- [VERCEL_SETUP_COMPLETE.md](./VERCEL_SETUP_COMPLETE.md) - Setup summary
- [Vercel Documentation](https://vercel.com/docs)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)

---

**Last Updated**: 2025-10-18

**Status**: Ready for Deployment

**Next Action**: Push to Git and import to Vercel
