import { useRef, useEffect, useCallback } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { KnowledgeGraphData, GraphNode } from "@/lib/githubApi";
import * as THREE from "three";

interface KnowledgeGraph3DProps {
  data: KnowledgeGraphData;
  onNodeClick?: (node: GraphNode) => void;
  width?: number;
  height?: number;
}

export default function KnowledgeGraph3D({ 
  data, 
  onNodeClick, 
  width, 
  height = 600 
}: KnowledgeGraph3DProps) {
  const fgRef = useRef<any>();

  // Calculate responsive width
  const graphWidth = width || (typeof window !== 'undefined' ? window.innerWidth - 64 : 1200);

  // Node styling based on type
  const nodeVal = useCallback((node: GraphNode) => {
    return node.val || 10;
  }, []);

  const nodeColor = useCallback((node: GraphNode) => {
    return node.color;
  }, []);

  // Create 3D node objects for better visual appeal
  const nodeThreeObject = useCallback((node: GraphNode) => {
    let geometry: THREE.BufferGeometry;
    
    switch (node.type) {
      case 'repository':
        // Sphere for repositories
        geometry = new THREE.SphereGeometry(node.val * 0.5);
        break;
      case 'topic':
        // Octahedron for topics (diamond-like)
        geometry = new THREE.OctahedronGeometry(node.val * 0.6);
        break;
      case 'technology':
        // Box for technologies
        geometry = new THREE.BoxGeometry(node.val * 0.8, node.val * 0.8, node.val * 0.8);
        break;
      case 'status':
        // Cylinder for status
        geometry = new THREE.CylinderGeometry(node.val * 0.5, node.val * 0.5, node.val * 0.8);
        break;
      case 'year':
        // Tetrahedron for years
        geometry = new THREE.TetrahedronGeometry(node.val * 0.7);
        break;
      default:
        geometry = new THREE.SphereGeometry(node.val * 0.5);
    }

    const material = new THREE.MeshPhongMaterial({ 
      color: node.color,
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Add subtle hover effect through scaling
    mesh.userData = { originalScale: 1, node };
    
    return mesh;
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: any) => {
    if (onNodeClick) {
      onNodeClick(node as GraphNode);
    }
  }, [onNodeClick]);

  // Handle node hover for visual feedback
  const handleNodeHover = useCallback((node: any, prevNode: any) => {
    if (fgRef.current) {
      // Reset previous node
      if (prevNode && prevNode.__threeObj) {
        prevNode.__threeObj.scale.set(1, 1, 1);
      }
      
      // Scale up hovered node
      if (node && node.__threeObj) {
        node.__threeObj.scale.set(1.2, 1.2, 1.2);
      }
      
      // Change cursor
      document.body.style.cursor = node ? 'pointer' : 'auto';
    }
  }, []);

  // Link styling
  const linkColor = useCallback(() => {
    return '#6b7280'; // gray-500
  }, []);

  const linkWidth = useCallback(() => {
    return 1;
  }, []);

  // Initialize graph on mount
  useEffect(() => {
    if (fgRef.current && data.nodes.length > 0) {
      // Zoom to fit all nodes
      fgRef.current.zoomToFit(1000, 50);
      
      // Set initial camera position for better viewing angle
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 300 });
    }
  }, [data]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (fgRef.current) {
        const newWidth = window.innerWidth - 64;
        fgRef.current.width(newWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="w-full h-full bg-background relative"
      data-testid="knowledge-graph-3d"
      style={{ height: `${height}px` }}
    >
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        width={graphWidth}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        showNavInfo={false}
        
        // Node configuration
        nodeVal={nodeVal}
        nodeColor={nodeColor}
        nodeThreeObject={nodeThreeObject}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodeLabel={(node: any) => {
          const graphNode = node as GraphNode;
          return `
            <div style="
              background: rgba(0, 0, 0, 0.8); 
              color: white; 
              padding: 8px 12px; 
              border-radius: 6px; 
              font-size: 12px;
              max-width: 200px;
              line-height: 1.4;
            ">
              <strong>${graphNode.name}</strong>
              ${graphNode.description ? `<br/><span style="opacity: 0.8;">${graphNode.description}</span>` : ''}
              <br/><span style="opacity: 0.6;">Type: ${graphNode.type}</span>
            </div>
          `;
        }}
        
        // Link configuration
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkOpacity={0.3}
        linkDirectionalParticles={0}
        
        // Forces configuration for better layout
        
        // Controls
        enableNodeDrag={false}
        enableNavigationControls={true}
        
        // Performance
        numDimensions={3}
        
        // Warm up the simulation
        warmupTicks={100}
        cooldownTicks={1000}
      />
      
      {/* Loading overlay for better UX */}
      {data.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Initializing graph...</p>
          </div>
        </div>
      )}
      
      
    </div>
  );
}