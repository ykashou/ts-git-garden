#!/bin/bash

# Custom Domain Deployment Script for Digital Garden Portfolio
# This script builds and deploys the static site to GitHub Pages with a custom domain

set -e  # Exit on any error

echo "🌱 Starting Digital Garden deployment with custom domain..."

# Check if repository URL and domain are provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "❌ Error: Please provide your GitHub repository URL and custom domain"
  echo "Usage: ./deploy-custom-domain.sh git@github.com:username/repo-name.git yourdomain.com"
  exit 1
fi

REPO_URL="$1"
CUSTOM_DOMAIN="$2"

echo "📦 Building static site for custom domain..."
npm run build

echo "📋 Copying static data files..."
cp -r public/data dist/public/

echo "🌐 Creating CNAME file for custom domain..."
echo "$CUSTOM_DOMAIN" > dist/public/CNAME

echo "📁 Preparing deployment directory..."
cd dist/public

# Initialize git repository if it doesn't exist
if [ ! -d ".git" ]; then
  git init
fi

# Add all files
git add -A

# Check if there are any changes to commit
if git diff --staged --quiet; then
  echo "⚠️  No changes detected. Deployment may not be necessary."
else
  echo "💾 Committing changes..."
  git commit -m "Deploy Digital Garden with custom domain - $(date)"
fi

echo "🚀 Deploying to GitHub Pages..."
git push -f "$REPO_URL" HEAD:gh-pages

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://$CUSTOM_DOMAIN"
echo "📝 Note: It may take a few minutes for GitHub Pages to update."
echo ""
echo "🔧 Next steps:"
echo "1. Go to your repository settings on GitHub"
echo "2. Navigate to the 'Pages' section"
echo "3. Set source to 'Deploy from a branch'"
echo "4. Select 'gh-pages' branch and '/ (root)' folder"
echo "5. Verify the custom domain is set to '$CUSTOM_DOMAIN'"
echo "6. Configure your DNS settings to point to GitHub Pages:"
echo "   - For apex domain (yourdomain.com): A record to GitHub Pages IPs"
echo "   - For subdomain (www.yourdomain.com): CNAME to username.github.io"