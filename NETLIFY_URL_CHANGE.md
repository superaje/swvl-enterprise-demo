# Change Netlify Site URL

## Current Site
- **Site Name:** swvl-enterprise-demo
- **URL:** https://swvl-enterprise-demo.netlify.app
- **Site ID:** dad72021-5773-42ed-a341-7c0e43fbe909

## Option 1: Rename Existing Site (Via Dashboard)
1. Go to: https://app.netlify.com/projects/swvl-enterprise-demo
2. Click "Site settings" (gear icon)
3. Go to "General" → "Site details"
4. Click "Change site name"
5. Enter new name (e.g., `swvl-enterprise-transport-demo`)
6. Save
7. New URL: https://swvl-enterprise-transport-demo.netlify.app

## Option 2: Create New Site (Via Dashboard)
1. Go to: https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → Select `swvl-enterprise-demo`
4. Site name: `swvl-enterprise-transport-demo` (or your preferred name)
5. Branch: `main`
6. Build command: `npm run build`
7. Publish directory: `.next`
8. Deploy!

## Option 3: Create New Site via CLI
```bash
# Create new site
netlify sites:create --name swvl-enterprise-transport-demo

# Link to current directory
netlify link --name swvl-enterprise-transport-demo

# Deploy
netlify deploy --prod
```
