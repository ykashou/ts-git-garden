# GitHub Pages Deployment Guide

This Digital Garden portfolio is designed as a pure static site for GitHub Pages deployment.

## Quick Deploy

1. **Build the static site:**
   ```bash
   npm run build
   ```

2. **Copy static data files:**
   ```bash
   cp -r public/data dist/public/
   ```

3. **Deploy to GitHub Pages:**
   - Create a new repository on GitHub
   - Push the `dist/public` directory contents to the `gh-pages` branch
   - Enable GitHub Pages in repository settings

## Configuration for Different Deployment Types

### GitHub Pages with Repository Path (e.g., username.github.io/repo-name)
Set the base path in `vite.config.ts`:
```typescript
export default defineConfig({
  base: "/your-repo-name/",
  // ... other config
});
```

### GitHub Pages with Custom Domain (e.g., your-domain.com)
Keep the default base path:
```typescript
export default defineConfig({
  base: "/",
  // ... other config
});
```

## Deployment Scripts

You can create these commands in your workflow:

### For repository-based GitHub Pages:
```bash
npm run build && cp -r public/data dist/public/ && cd dist/public && git init && git add -A && git commit -m "Deploy" && git push -f git@github.com:username/repo-name.git HEAD:gh-pages
```

### For custom domain GitHub Pages:
```bash
npm run build && cp -r public/data dist/public/ && cd dist/public && echo "your-domain.com" > CNAME && git init && git add -A && git commit -m "Deploy" && git push -f git@github.com:username/repo-name.git HEAD:gh-pages
```

## Features

✅ **Pure Static Site** - No server-side dependencies  
✅ **Locked Arcane Blue Theme** - Consistent dark theme  
✅ **Static Data Loading** - All content from JSON files  
✅ **Bitcoin Donations** - QR code and address display  
✅ **Garden Portfolio** - Projects and research showcase  
✅ **Responsive Design** - Works on all devices  
✅ **No Admin Panel** - Pure static content  

## File Structure

```
dist/public/
├── index.html              # Main page
├── assets/
│   ├── index-*.css         # Compiled styles
│   └── index-*.js          # Compiled JavaScript
└── data/
    ├── config.json         # Site configuration
    ├── projects.json       # Projects data
    └── papers.json         # Research papers data
```

## Data Files

The site loads all content from static JSON files in the `data/` directory:

- **config.json**: Site metadata, Bitcoin address, personal info
- **projects.json**: Portfolio projects with status and links
- **papers.json**: Research publications and academic work

**Important:** These files must be manually copied to the build output using `cp -r public/data dist/public/` after running the build command. The files are then loaded via fetch requests that work in both development and production environments.