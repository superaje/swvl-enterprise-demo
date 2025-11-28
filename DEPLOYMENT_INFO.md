# Deployment Information

## 🚀 New 3-Screen Flow Deployment

### Changes Deployed:
- ✅ Screen 1: Google Sheets view with 65+ passengers
- ✅ Screen 2: 3 optimization options (Cost, Optimum, Experience)
- ✅ Screen 3: Results with CTAs (Book a Call, Call Me Now)

### Deployment URLs:

**Main Production Site:**
- URL: https://swvl-enterprise-demo.netlify.app
- Status: ✅ Deployed and Live

**GitHub Repository:**
- URL: https://github.com/superaje/swvl-enterprise-demo
- Branch: `main`
- Latest Commit: `4c69efa` - Redesign to 3-screen flow

### To Create a New Site/URL:

1. **Via Netlify Dashboard:**
   - Go to: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub → Select `swvl-enterprise-demo`
   - Configure:
     - Site name: `swvl-enterprise-demo-v2` (or your preferred name)
     - Branch: `main`
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Deploy!

2. **Via Netlify CLI:**
   ```bash
   netlify sites:create --name swvl-enterprise-demo-v2
   netlify link --name swvl-enterprise-demo-v2
   netlify deploy --prod
   ```

3. **Branch Deploy (Preview URL):**
   - Create a new branch: `git checkout -b demo-v2`
   - Push: `git push origin demo-v2`
   - Netlify will auto-create a preview deployment
   - URL format: `https://demo-v2--swvl-enterprise-demo.netlify.app`

### Current Status:
- ✅ Code pushed to GitHub
- ✅ Main site deployed
- ⏳ New site creation pending (manual step in dashboard)

---

**Last Updated:** $(date)

