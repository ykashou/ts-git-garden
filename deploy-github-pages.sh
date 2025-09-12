#!/bin/bash

# GitHub Pages Deployment Script for Digital Garden Portfolio
# This script builds and deploys the static site to GitHub Pages

set -e  # Exit on any error

echo "🌱 Starting Digital Garden deployment..."

# Check if repository URL is provided
if [ -z "$1" ]; then
  echo "❌ Error: Please provide your GitHub repository URL"
  echo "Usage: ./deploy-github-pages.sh git@github.com:username/repo-name.git"
  echo "   or: ./deploy-github-pages.sh https://github.com/username/repo-name.git"
  exit 1
fi

REPO_URL="$1"
REPO_NAME=$(echo "$REPO_URL" | sed 's/.*\/\([^\.]*\)\.git/\1/' | sed 's/.*\/\([^\.]*\)/\1/')

echo "📦 Building static site..."
npm run build

echo "📋 Copying static data files..."
cp -r public/data dist/public/

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
  git commit -m "Deploy Digital Garden - $(date)"
fi

echo "🚀 Deploying to GitHub Pages..."
git push -f "$REPO_URL" HEAD:gh-pages

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://$(echo "$REPO_URL" | sed 's/.*github\.com[:/]\([^/]*\)\/\([^\.]*\).*/\1.github.io\/\2/')/"
echo "📝 Note: It may take a few minutes for GitHub Pages to update."
echo ""
echo "🔧 Next steps:"
echo "1. Go to your repository settings on GitHub"
echo "2. Navigate to the 'Pages' section"
echo "3. Set source to 'Deploy from a branch'"
echo "4. Select 'gh-pages' branch and '/ (root)' folder"
echo "5. Save the settings"