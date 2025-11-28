#!/bin/bash

# Netlify Deployment Script for SWVL Enterprise Transport Demo

echo "🚀 Starting Netlify deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if logged in
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify..."
    netlify login
fi

# Build the project
echo "📦 Building project..."
npm run build

# Create site and deploy
echo "🌐 Creating Netlify site and deploying..."
netlify deploy --create-site swvl-enterprise-transport --dir=.next --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Netlify dashboard:"
echo "   Site settings → Environment variables → Add variable"

