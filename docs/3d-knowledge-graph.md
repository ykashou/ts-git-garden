# 3D Knowledge Graph - Digital Garden Explorer

## The Vision: Interactive 3D Garden Knowledge Graph

An immersive, explorable knowledge landscape where visitors can discover connections between all your projects, research work, and development areas in beautiful 3D space.

## What We'll Build

### 🎯 3D Visualization Features

- **Nodes**: All repositories as spheres, topics/technologies as larger nodes
- **Connections**: Lines showing which projects belong to which topics/technologies
- **Clustering**: Projects automatically group around related topics
- **Interactive**: Click nodes to open repositories, PDFs, or live demos
- **Dual Views**: Switch between All Projects and Research-Only modes
- **Grouping Modes**: Switch between Topic/Status/Year/Technology groupings

### 🔧 Technical Implementation

- **react-force-graph-3d** for WebGL-powered 3D physics simulation
- **GitHub Integration** to fetch all your repositories
- **Smart Filtering** by project types and research topics
- **PDF Resolution** via GitHub Actions artifacts/releases for research papers
- **Live Demo Detection** for project deployments

### 🎨 User Experience

```
Knowledge Graph Page Layout:
┌─ [🏗️ All Projects] [📚 Research Only] ──┐
│                                        │
│  🎮 Controls: [🔍 Search]             │
│               [📋 Group by Topic]       │  
│               [📅 Group by Year]        │
│               [⚡ Group by Tech]        │
│                                        │
│  🌌 3D Space:                         │
│     ● Projects floating in space       │
│     ⬢ Topic/Tech clusters             │
│     ─ Connections between them         │
│                                        │
└────────────────────────────────────────┘
```

## Dual View System

### All Projects View
- **Development Projects**: Regular repositories with live demos
- **Research Papers**: Academic work with PDF compilation
- **Experiments**: Small projects and prototypes
- **Libraries/Tools**: Utility projects and packages

### Research Only View  
- **Filtered Display**: Only repositories tagged with "Research", "Thesis", "Theory", "Article"
- **Academic Focus**: Emphasizes papers, citations, and research connections
- **PDF Prioritization**: Highlights compiled research documents

## 📊 Data Flow

1. **GitHub API** → Fetch all repositories
2. **Classification** → Separate projects vs research
3. **PDF Detection** → Find compiled papers automatically  
4. **Demo Detection** → Identify live deployments
5. **Graph Builder** → Create nodes and links
6. **3D Render** → Beautiful interactive visualization

## Node Types & Interactions

### Project Nodes (Blue Spheres)
- **Click**: Open live demo or repository
- **Size**: Based on stars/activity
- **Clustering**: Group by primary technology

### Research Nodes (Green Spheres)  
- **Click**: Open PDF or repository
- **Size**: Based on research significance
- **Clustering**: Group by research topic

### Topic/Tech Nodes (Large Colored Nodes)
- **Click**: Filter to show only connected projects
- **Size**: Based on number of connected projects
- **Color**: Category-based (languages, research areas, etc.)

This transforms your entire digital garden into an immersive, explorable knowledge landscape where visitors can discover connections between your development work, research areas, and innovative projects!