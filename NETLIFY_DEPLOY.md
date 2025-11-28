# Netlify Deployment Instructions

## ✅ Project is Ready for Deployment

All configuration files have been created:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `next.config.js` - Next.js configuration with webpack settings
- ✅ `@netlify/plugin-nextjs` - Installed

## 🚀 Deploy Now

### Option 1: Via Netlify Dashboard (Recommended)

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "SWVL Enterprise Transport Demo"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - These should auto-detect from `netlify.toml`

4. **Set Environment Variables**
   - Go to: Site settings → Environment variables → Add variable
   - Key: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - Value: `<your-private-google-maps-api-key>`
   - Click "Save"

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at: `https://your-site-name.netlify.app`

### Option 2: Via Netlify CLI

```bash
# Make sure you're logged in
netlify login

# Create and deploy new site
netlify deploy --create-site swvl-enterprise-transport --dir=.next --prod

# After first deploy, set environment variable
netlify env:set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY "<your-private-google-maps-api-key>"

# Redeploy with environment variable
netlify deploy --prod --dir=.next
```

### Option 3: Use Deployment Script

```bash
chmod +x deploy-netlify.sh
./deploy-netlify.sh
```

## 📋 Post-Deployment Checklist

- [ ] Verify site is accessible
- [ ] Test Google Maps loading
- [ ] Test location search autocomplete
- [ ] Test vehicle selection (3D)
- [ ] Test route optimization
- [ ] Test scenario comparison
- [ ] Test mobile responsiveness
- [ ] Verify environment variables are set

## 🔧 Troubleshooting

### If Maps Don't Load
- Check environment variable is set correctly in Netlify dashboard
- Verify API key has correct permissions (Maps JavaScript API, Places API)
- Check browser console for errors

### If Build Fails
- Check Node version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Netlify dashboard

### If 3D Vehicles Don't Load
- This is normal - 3D components load client-side
- Check browser console for WebGL errors
- Try a different browser

## 🌐 Your Site URL

After deployment, your site will be available at:
- Production: `https://your-site-name.netlify.app`
- Preview deployments: `https://deploy-preview-X--your-site-name.netlify.app`

## 📞 Support

For issues or questions:
- Check Netlify build logs
- Review browser console for errors
- Verify all environment variables are set

