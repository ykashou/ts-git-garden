# Interactive 3D Knowledge Graph Page

## Overview

Create a new separate page featuring an interactive 3D visualization of GitHub repositories with dual viewing modes: Repository View (all projects) and Research View (filtered research papers).

## The Vision: Interactive 3D Knowledge Graph

### 🎯 3D Visualization Features

- **Nodes**: Repositories as spheres, topics as larger nodes
- **Connections**: Lines showing which projects belong to which topics
- **Clustering**: Projects automatically group around related topics
- **Interactive**: Click nodes to open PDFs or repositories
- **Grouping Modes**: Switch between Topic/Status/Year groupings

### 🔧 Technical Implementation

- **react-force-graph-3d** for WebGL-powered 3D physics simulation
- **GitHub Integration** to fetch your repositories
- **PDF Resolution** via GitHub Actions artifacts/releases
- **Smart Filtering** by topics and project types

### 🎨 User Experience

```
Page Layout:
┌─ [📊 List View] [🌐 3D Graph] ────┐
│                                  │
│  🎮 Controls: [🔍 Search]       │
│               [📋 Group by Topic] │  
│               [📅 Group by Year] │
│                                  │
│  🌌 3D Space:                   │
│     ● Projects floating in space │
│     ⬢ Topic clusters            │
│     ─ Connections between them   │
│                                  │
└──────────────────────────────────┘
```

## Dual View Modes

### Repository View (All Projects)
- Display all GitHub repositories
- Standard project cards with live demos, GitHub links
- Topics from all repository types
- Project status: blooming/growing/mature

### Research View (Research Papers)
- Filter repositories by research topics ("Research", "Thesis", "Theory", "Article")
- Academic-style cards with PDF links
- Repository description as "abstract"
- Research status: draft/active/stable

## Card Structure Adaptation

### Repository View Cards
```
┌─────────────────────────────────────┐
│ Project Title                       │ Status Badge
├─────────────────────────────────────┤
│ Technologies: [React] [TypeScript]  │
│ Topics: [Web Dev] [Tools]           │
├─────────────────────────────────────┤
│ Description: Project description    │
├─────────────────────────────────────┤
│ [🚀 Live Demo] [📂 Repository]     │
└─────────────────────────────────────┘
```

### Research View Cards  
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

## PDF Detection Strategy

Look for PDF files in common locations:
- GitHub Actions artifacts
- /build/ or /dist/ folders  
- Direct PDF files in repo
- GitHub Pages deployment for PDFs

## 📊 Data Flow

1. **GitHub API** → Filter repositories by view mode
2. **PDF Detection** → Find compiled papers automatically  
3. **Graph Builder** → Create nodes and links
4. **3D Render** → Beautiful interactive visualization

This transforms repository exploration from a simple list into an immersive, explorable knowledge landscape where visitors can discover connections between different project areas and research topics.