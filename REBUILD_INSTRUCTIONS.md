# 🔧 Rebuild Instructions

## ✅ Local Build Status
- ✅ Build successful
- ✅ All files compiled correctly
- ✅ No errors

## 🌐 Netlify Deployment

The site needs to be rebuilt on Netlify's servers to work properly with Next.js App Router.

### Option 1: Trigger Build via Dashboard (Recommended)

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/projects/swvl-enterprise-demo

2. **Trigger New Deploy**
   - Click "Trigger deploy" button (top right)
   - Select "Deploy site"
   - This will rebuild the site on Netlify's servers

3. **Wait for Build**
   - Build takes ~2-3 minutes
   - Watch the build logs for progress

4. **Verify**
   - Visit: https://swvl-enterprise-demo.netlify.app
   - Site should now be working

### Option 2: Connect to Git (Best for Continuous Deployment)

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "SWVL Enterprise Transport Demo"
   ```

2. **Push to GitHub/GitLab**
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Connect in Netlify**
   - Go to: Site settings → Build & deploy → Continuous Deployment
   - Click "Link to Git provider"
   - Select your repository
   - Netlify will auto-detect settings

4. **Auto-Deploy**
   - Every push to main branch = automatic deploy
   - PR previews for pull requests

## 🔍 Current Status

- **Site URL**: https://swvl-enterprise-demo.netlify.app
- **Admin**: https://app.netlify.com/projects/swvl-enterprise-demo
- **Environment Variable**: ✅ Set (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
- **Build Config**: ✅ Configured (netlify.toml)
- **Next.js Plugin**: ✅ Installed (@netlify/plugin-nextjs)

## ⚠️ Why Manual Trigger?

When deploying via CLI with `--dir=.next`, we're uploading a pre-built directory. Netlify's Next.js plugin needs to build the site itself to properly handle:
- Server-side rendering
- API routes
- Dynamic routes
- Edge functions

Triggering a build through the dashboard ensures Netlify builds it correctly.

## ✅ After Rebuild

Once rebuilt, verify:
- [ ] Site loads correctly
- [ ] Google Maps loads
- [ ] Location search works
- [ ] Vehicle selection works
- [ ] Route optimization works
- [ ] Mobile responsive

---

**Next Step**: Go to Netlify dashboard and trigger a new deploy!

