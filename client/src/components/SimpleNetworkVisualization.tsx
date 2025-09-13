import { useMemo } from "react";
import { KnowledgeGraphData, GraphNode } from "@/lib/githubApi";
import { Badge } from "@/components/ui/badge";

interface SimpleNetworkVisualizationProps {
  data: KnowledgeGraphData;
  onNodeClick?: (node: GraphNode) => void;
}

export default function SimpleNetworkVisualization({ data, onNodeClick }: SimpleNetworkVisualizationProps) {
  // Calculate node positions in a circular layout
  const nodePositions = useMemo(() => {
    const positions = new Map();
    const { nodes } = data;
    
    if (nodes.length === 0) return positions;
    
    const centerX = 300;
    const centerY = 300;
    const radius = 200;
    
    // Separate repository nodes from grouping nodes
    const repoNodes = nodes.filter(node => node.type === 'repository');
    const groupNodes = nodes.filter(node => node.type !== 'repository');
    
    // Position repository nodes in outer circle
    repoNodes.forEach((node, index) => {
      const angle = (index / repoNodes.length) * 2 * Math.PI;
      positions.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        node
      });
    });
    
    // Position group nodes in inner circle
    groupNodes.forEach((node, index) => {
      const angle = (index / Math.max(groupNodes.length, 1)) * 2 * Math.PI;
      const innerRadius = radius * 0.4;
      positions.set(node.id, {
        x: centerX + Math.cos(angle) * innerRadius,
        y: centerY + Math.sin(angle) * innerRadius,
        node
      });
    });
    
    return positions;
  }, [data]);

  const getNodeColor = (node: GraphNode) => {
    switch (node.type) {
      case 'repository':
        return node.color.includes('blue') ? 'bg-blue-500' : 'bg-green-500';
      case 'topic':
        return 'bg-purple-500';
      case 'technology':
        return 'bg-yellow-500';
      case 'status':
        return 'bg-orange-500';
      case 'year':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleNodeClick = (node: GraphNode) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  return (
    <div className="w-full h-full bg-background relative flex items-center justify-center">
      <div className="text-center">
        {/* Info message */}
        <div className="mb-8 max-w-md">
          <h3 className="text-lg font-medium text-foreground mb-2">Network Visualization</h3>
          <p className="text-sm text-muted-foreground mb-4">
            3D visualization is not available. Here's a simplified network view of your projects and connections.
          </p>
        </div>
        
        {/* SVG Network */}
        <div className="bg-muted/20 rounded-lg p-8 border">
          <svg width="600" height="600" className="mx-auto">
            {/* Render links */}
            {data.links.map((link, index) => {
              const source = nodePositions.get(link.source);
              const target = nodePositions.get(link.target);
              
              if (!source || !target) return null;
              
              return (
                <line
                  key={index}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  opacity="0.3"
                />
              );
            })}
            
            {/* Render nodes */}
            {Array.from(nodePositions.values()).map(({ x, y, node }) => (
              <g key={node.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={Math.max(node.val * 2, 8)}
                  fill={node.color}
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleNodeClick(node)}
                  data-testid={`node-${node.id}`}
                />
                <text
                  x={x}
                  y={y - (node.val * 2 + 15)}
                  textAnchor="middle"
                  fontSize="10"
                  fill="hsl(var(--foreground))"
                  className="pointer-events-none text-xs"
                >
                  {node.name.length > 15 ? `${node.name.substring(0, 15)}...` : node.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto text-xs">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500 hover:bg-blue-500 text-white w-3 h-3 p-0 rounded-full" />
            <span>Dev Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500 hover:bg-green-500 text-white w-3 h-3 p-0 rounded-full" />
            <span>Research</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500 hover:bg-purple-500 text-white w-3 h-3 p-0 rounded-full" />
            <span>Topics</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white w-3 h-3 p-0 rounded-full" />
            <span>Technologies</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-500 hover:bg-orange-500 text-white w-3 h-3 p-0 rounded-full" />
            <span>Status</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-pink-500 hover:bg-pink-500 text-white w-3 h-3 p-0 rounded-full" />
            <span>Years</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-4">
          Click on project nodes to open repositories
        </p>
      </div>
    </div>
  );
}