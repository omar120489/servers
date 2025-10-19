#!/bin/bash

# Traffic CRM - Vercel Deployment Script
# This script deploys the application to Vercel

set -e

echo "🚀 Traffic CRM - Vercel Deployment"
echo "=================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
echo "📝 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

# Build the application
echo ""
echo "🔨 Building application..."
npm run build

# Deploy to production
echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🎉 Your application is now live!"
echo ""
echo "Next steps:"
echo "  1. Check the deployment URL provided above"
echo "  2. Configure environment variables in Vercel dashboard"
echo "  3. Set up custom domain (optional)"
echo "  4. Enable monitoring and analytics"
echo ""

