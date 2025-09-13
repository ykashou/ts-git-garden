# Research Page Upgrade

## What We'll Display

- Your research repositories filtered by topics ("Research", "Thesis", "Theory", "Article")
- PDF Button → Links to the compiled PDF from GitHub Actions
- View Repository → Links to the GitHub repo for source/version history
- Repository description as the "abstract"
- GitHub topics as research tags
- Status based on repository state

## Card Structure Adaptation

```
┌─────────────────────────────────────┐
│ Paper Title (repo name cleaned up) │ Status Badge
├─────────────────────────────────────┤
│ Author: Your Name                   │
│ Topics: [Research] [Machine Learning] [Theory]
├─────────────────────────────────────┤
│ Abstract: Repository description    │
│ + README excerpt if needed          │
├─────────────────────────────────────┤
│ [📄 View PDF] [📂 Repository]      │
└─────────────────────────────────────┘
```

## Status System Options

- **"Draft"** - Recently created or low activity
- **"Active"** - Recent commits and activity
- **"Stable"** - Mature research, less frequent updates

## PDF Detection Strategy

We can look for PDF files in common locations:

- GitHub Actions artifacts
- /build/ or /dist/ folders
- Direct PDF files in repo
- GitHub Pages deployment for PDFs

This keeps the beautiful academic presentation while being authentic to your GitHub-based research workflow. The version history stays in Git, PDFs are automatically compiled, and everything is properly showcased.