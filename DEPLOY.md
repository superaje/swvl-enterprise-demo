# Netlify Deployment Guide

## Quick Deploy

### Option 1: Deploy via Netlify Dashboard

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-detect Next.js settings

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = `<your-private-google-maps-api-key>`

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

## Environment Variables

Make sure to set these in Netlify Dashboard:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

## Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18

## Post-Deployment

After deployment, your site will be available at: `https://your-site-name.netlify.app`

Make sure to:
1. Verify Google Maps is loading correctly
2. Test all features (location search, vehicle selection, route optimization)
3. Check mobile responsiveness

