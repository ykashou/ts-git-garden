# 3D Knowledge Graph

## Goal
Add an interactive 3D graph to visualize relationships between repositories and topics using `react-force-graph-3d`.

## What It Shows
- **Repository nodes** (blue spheres)
- **Topic nodes** (green spheres, larger)  
- **Connections** between repos and their topics
- **Physics simulation** that clusters related items

## Implementation

### 1. Install Dependencies
```bash
npm install react-force-graph-3d
```

### 2. Graph Data Structure
```typescript
interface GraphNode {
  id: string;
  type: 'repo' | 'topic';
  label: string;
  color: string;
  size: number;
  url?: string;
}

interface GraphLink {
  source: string;
  target: string;
}
```

### 3. Component Structure
```typescript
const KnowledgeGraph3D = ({ repositories }) => {
  // Convert repos to nodes and links
  const graphData = buildGraphData(repositories);
  
  return (
    <ForceGraph3D
      graphData={graphData}
      nodeColor={node => node.color}
      nodeLabel={node => node.label}
      onNodeClick={node => window.open(node.url)}
    />
  );
};
```

### 4. Data Processing
From repositories, create:
- One node per repository
- One node per unique topic
- Links connecting repos to their topics

### 5. Grouping Modes
Add buttons to cluster by:
- **Topic** - repos cluster around their main topics
- **Status** - draft/active/stable in different areas
- **Year** - arranged chronologically

### 6. Integration
Add to Research page as a second tab:
```
[📊 List View] [🌐 3D Graph]
```

Simple 3D visualization with physics simulation showing how your research topics connect.