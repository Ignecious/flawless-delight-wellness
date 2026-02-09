# Deployment Guide - Flawless Delight Wellness

This guide explains how to deploy the Angular application to Vercel.

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Vercel account (free): https://vercel.com
- Git repository connected to GitHub

## Deployment Methods

### Method 1: Vercel CLI (Fastest)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   # First deployment (preview)
   vercel
   
   # Production deployment
   vercel --prod
   ```

4. **Your site will be live at:**
   - Production: `https://flawless-delight-wellness.vercel.app`
   - Preview: Unique URL for each deployment

### Method 2: Vercel Dashboard (Auto-Deploy)

1. **Go to [vercel.com](https://vercel.com) and login**

2. **Click "Add New..." → "Project"**

3. **Import your GitHub repository:**
   - Select `Ignecious/flawless-delight-wellness`
   - Click "Import"

4. **Vercel will auto-detect settings:**
   - Framework: Angular
   - Build Command: `npm run build:prod`
   - Output Directory: `dist/flawless-delight-wellness`
   - Install Command: `npm install`

5. **Click "Deploy"**

6. **Enable Auto-Deploy:**
   - Every push to `main` branch auto-deploys
   - Pull requests get preview URLs

### Method 3: GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml` for custom CI/CD if needed.

## Post-Deployment

### Test Your Deployment

Visit your live URL and test all routes:
- ✅ `/` (Landing page)
- ✅ `/book-service` (Booking page)
- ✅ `/admin/dashboard`
- ✅ `/admin/calendar`
- ✅ `/admin/bookings`
- ✅ `/admin/treatments`
- ✅ `/admin/packages`
- ✅ `/admin/therapists`
- ✅ `/admin/clients`

### Add Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `flawlessdelightwellness.co.za`
3. Update DNS records at your domain provider
4. Wait for DNS propagation (5 mins - 48 hours)

### Monitor Your Site

Vercel Dashboard provides:
- 📊 Analytics (page views, performance)
- 🚀 Deployment history
- 🐛 Error logs
- ⚡ Performance metrics

## Troubleshooting

### Issue: 404 on Page Refresh

**Solution:** Ensure `vercel.json` has the rewrites configuration (already included).

### Issue: Build Fails

1. **Test local build:**
   ```bash
   npm run build:prod
   ```

2. **Check Node version:**
   ```bash
   node --version  # Should be 18+
   ```

3. **Clear cache and rebuild:**
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build:prod
   ```

### Issue: Slow Load Times

- Check asset sizes in `dist/` folder
- Optimize images before deployment
- Vercel automatically serves from global CDN

## Updating Your Deployment

### Via Git (Auto-Deploy Enabled)

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys in 2-3 minutes
```

### Via CLI

```bash
# Deploy latest code
vercel --prod
```

## Cost

**Vercel Free Tier includes:**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domains
- ✅ Preview deployments

**Estimated usage for this app:**
- ~20,000 page loads/month fits in free tier
- Upgrade to Pro ($20/month) only if you exceed limits

## Environment Variables (Future)

When you add backend API:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add variables:
   - `API_URL` = `https://your-api.com`
   - `API_KEY` = `your-secret-key`
3. Redeploy for changes to take effect

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Angular on Vercel:** https://vercel.com/docs/frameworks/angular
- **Issues:** Check Vercel deployment logs in dashboard

---

**🎉 You're ready to deploy!** Run `vercel --prod` to go live.
