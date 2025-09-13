# Research Page Upgrade

## Goal
Display GitHub research repositories using the existing beautiful ResearchPaper card design, adapted for GitHub repos with compiled PDFs.

## What We're Building
Take the current research page's elegant cards and populate them with:
- GitHub repos tagged with "Research", "Thesis", "Theory", "Article"
- Repository descriptions as abstracts
- GitHub topics as tags
- PDF links from compiled GitHub Actions outputs

## Changes Needed

### 1. New API Endpoint
```
GET /api/github/research-repos
```
Returns GitHub repos filtered by research topics with PDF detection.

### 2. Schema Update
```typescript
type ResearchRepo = {
  id: string;
  title: string;        // cleaned repo name
  description: string;  // repo description  
  topics: string[];     // GitHub topics
  repoUrl: string;
  pdfUrl?: string;      // compiled PDF URL
  year: number;         // from created date
  status: "draft" | "active" | "stable";
}
```

### 3. PDF Detection
Look for PDFs in:
1. Latest GitHub release assets (*.pdf)
2. Common paths: `/docs/paper.pdf`, `/build/paper.pdf`
3. GitHub Actions artifacts (if accessible)

### 4. Status Logic
- **Draft**: New repos or low activity
- **Active**: Recent commits (< 45 days)  
- **Stable**: Established repos with infrequent updates

### 5. Card Adaptation
Keep the existing ResearchPaper component, just change:
- **Authors** → Repository owner
- **Venue** → "GitHub Repository"
- **Abstract** → Repository description
- **PDF Button** → Links to compiled PDF
- **DOI Button** → "Repository" button to GitHub

That's it. Same beautiful design, GitHub data instead of academic papers.