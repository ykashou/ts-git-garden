import { useRef, useEffect, useCallback, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { KnowledgeGraphData, GraphNode } from "@/lib/githubApi";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Github, Copy, Filter, ExternalLink, Calendar, Eye } from "lucide-react";
import { useLocation } from "wouter";

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
  height 
}: KnowledgeGraph3DProps) {
  const fgRef = useRef<any>();
  const [, navigate] = useLocation();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    node: GraphNode | null;
  }>({ visible: false, x: 0, y: 0, node: null });

  // Calculate responsive dimensions for fullscreen
  const graphWidth = width || (typeof window !== 'undefined' ? window.innerWidth : 1200);
  const graphHeight = height || (typeof window !== 'undefined' ? window.innerHeight : 800);

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
    
    // Add borders to cubic nodes (technology type)
    if (node.type === 'technology') {
      // Create wireframe edges for better definition
      const edges = new THREE.EdgesGeometry(geometry);
      const edgeMaterial = new THREE.LineBasicMaterial({ 
        color: 0x000000, // Black borders
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });
      const wireframe = new THREE.LineSegments(edges, edgeMaterial);
      
      // Create a group to contain both the mesh and wireframe
      const group = new THREE.Group();
      group.add(mesh);
      group.add(wireframe);
      
      // Add subtle hover effect through scaling
      group.userData = { originalScale: 1, node };
      
      return group;
    }
    
    // Add subtle hover effect through scaling
    mesh.userData = { originalScale: 1, node };
    
    return mesh;
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: any) => {
    const graphNode = node as GraphNode;
    
    // Toggle selection - if same node clicked, deselect it
    setSelectedNode(prevSelected => 
      prevSelected?.id === graphNode.id ? null : graphNode
    );
    
    if (onNodeClick) {
      onNodeClick(graphNode);
    }
  }, [onNodeClick]);

  // Handle node right-click for context menu
  const handleNodeRightClick = useCallback((node: any, event: MouseEvent) => {
    event.preventDefault();
    const graphNode = node as GraphNode;
    
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      node: graphNode
    });
  }, []);

  // Handle context menu actions
  const handleContextMenuAction = useCallback((action: string, node: GraphNode) => {
    switch (action) {
      case 'viewOnGitHub':
        if (node.type === 'repository' && node.url) {
          window.open(node.url, '_blank');
        }
        break;
      case 'viewInPortfolio':
        if (node.type === 'repository') {
          navigate('/');
        }
        break;
      case 'copyName':
        navigator.clipboard.writeText(node.name);
        break;
      case 'copyUrl':
        if (node.url) {
          navigator.clipboard.writeText(node.url);
        }
        break;
      case 'filter':
        // For now, just log the filter action - this could be extended to actually filter
        console.log(`Filter by ${node.type}: ${node.name}`);
        break;
    }
    
    // Close context menu after action
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  }, [navigate]);

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, node: null });
      }
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('contextmenu', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [contextMenu.visible]);

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

  // Set up zoom and pan limits
  useEffect(() => {
    if (fgRef.current) {
      const controls = fgRef.current.controls();
      
      if (controls) {
        // Set zoom limits to prevent getting too close or too far
        controls.minDistance = 50;   // Minimum zoom distance (closer view)
        controls.maxDistance = 1500; // Maximum zoom distance (farther view)
        
        // Set up pan limits to keep the graph centered and usable
        const handleControlsChange = () => {
          const target = controls.target;
          const maxPanDistance = 400; // Maximum distance from center
          
          // Constrain target position to prevent losing the graph
          target.x = Math.max(-maxPanDistance, Math.min(maxPanDistance, target.x));
          target.y = Math.max(-maxPanDistance, Math.min(maxPanDistance, target.y));
          target.z = Math.max(-maxPanDistance, Math.min(maxPanDistance, target.z));
        };
        
        // Listen for control changes to enforce limits
        controls.addEventListener('change', handleControlsChange);
        
        // Cleanup event listener
        return () => {
          controls.removeEventListener('change', handleControlsChange);
        };
      }
    }
  }, []);

  // Handle window resize - ForceGraph3D handles dimensions via props, not ref methods
  useEffect(() => {
    const handleResize = () => {
      // Force re-render by triggering a resize event on the ForceGraph3D component
      if (fgRef.current && fgRef.current.refresh) {
        fgRef.current.refresh();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="w-full h-full bg-background relative"
      data-testid="knowledge-graph-3d"
    >
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        width={graphWidth}
        height={graphHeight}
        backgroundColor="rgba(0,0,0,0)"
        showNavInfo={false}
        
        // Node configuration
        nodeVal={nodeVal}
        nodeColor={nodeColor}
        nodeThreeObject={nodeThreeObject}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onNodeRightClick={handleNodeRightClick}
        nodeLabel={(node: any) => {
          const graphNode = node as GraphNode;
          
          // Show label for selected node (clicked) OR research project nodes on hover
          const isSelected = selectedNode && selectedNode.id === graphNode.id;
          const isResearchProject = graphNode.type === 'repository' && graphNode.group === 'research';
          
          if (!isSelected && !isResearchProject) {
            return '';
          }
          
          // Different styling for selected vs hover states
          const isHoverOnly = isResearchProject && !isSelected;
          const borderColor = isHoverOnly ? '#10b981' : '#3b82f6'; // Green for research, blue for selected
          const dismissText = isSelected ? 'Click to dismiss' : 'Click to pin details';
          
          return `
            <div style="
              background: rgba(0, 0, 0, 0.9); 
              color: white; 
              padding: 10px 14px; 
              border-radius: 8px; 
              font-size: 13px;
              max-width: 220px;
              line-height: 1.4;
              border: 2px solid ${borderColor};
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            ">
              <strong style="font-size: 14px;">${graphNode.name}</strong>
              ${graphNode.description ? `<br/><span style="opacity: 0.85; margin-top: 4px; display: block;">${graphNode.description}</span>` : ''}
              ${graphNode.group === 'research' ? '<br/><span style="opacity: 0.8; font-size: 11px; color: #10b981; margin-top: 4px; display: block;">📚 Research Project</span>' : ''}
              <br/><span style="opacity: 0.7; font-size: 11px; margin-top: 6px; display: block;">Type: ${graphNode.type} • ${dismissText}</span>
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
      
      {/* Context Menu */}
      {contextMenu.visible && contextMenu.node && (
        <div 
          className="fixed bg-card border border-border rounded-lg shadow-lg py-1 z-50 min-w-[160px]"
          style={{ 
            left: Math.min(contextMenu.x, window.innerWidth - 200), 
            top: Math.min(contextMenu.y, window.innerHeight - 200)
          }}
          data-testid="context-menu"
        >
          {contextMenu.node.type === 'repository' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-3 py-2 h-auto font-normal"
                onClick={() => handleContextMenuAction('viewInPortfolio', contextMenu.node!)}
                data-testid="context-menu-portfolio"
              >
                <Eye className="h-4 w-4 mr-2" />
                View in Portfolio
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-3 py-2 h-auto font-normal"
                onClick={() => handleContextMenuAction('viewOnGitHub', contextMenu.node!)}
                data-testid="context-menu-github"
              >
                <Github className="h-4 w-4 mr-2" />
                View on GitHub
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start px-3 py-2 h-auto font-normal"
                onClick={() => handleContextMenuAction('copyUrl', contextMenu.node!)}
                data-testid="context-menu-copy-url"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
            </>
          )}
          
          {(contextMenu.node.type === 'topic' || contextMenu.node.type === 'technology' || 
            contextMenu.node.type === 'status' || contextMenu.node.type === 'year') && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-3 py-2 h-auto font-normal"
              onClick={() => handleContextMenuAction('filter', contextMenu.node!)}
              data-testid="context-menu-filter"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter by {contextMenu.node.type}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start px-3 py-2 h-auto font-normal"
            onClick={() => handleContextMenuAction('copyName', contextMenu.node!)}
            data-testid="context-menu-copy-name"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Name
          </Button>
        </div>
      )}
      
    </div>
  );
}