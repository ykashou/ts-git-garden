import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Search, Filter, RotateCcw, Mouse, Link, ZoomIn, AlertTriangle } from "lucide-react";
import { getProjects } from "@/lib/staticDataLoader";
import { createKnowledgeGraph, GroupingMode } from "@/lib/githubApi";
import { Project } from "@shared/schema";
import KnowledgeGraph3D from "../components/KnowledgeGraph3D";


export default function KnowledgeGraph() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [grouping, setGrouping] = useState<GroupingMode>("topic");
  const [researchOnly, setResearchOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // SEO enhancement - update document title and meta description
  useEffect(() => {
    document.title = "3D Knowledge Graph - Digital Garden | Interactive Project Explorer";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore projects, technologies, and research through an interactive 3D knowledge graph. Discover connections between development work, academic papers, and innovative ideas in a visual network format.');
    }

    // Cleanup function to restore original SEO elements when component unmounts
    return () => {
      document.title = "Digital Garden - Personal Portfolio";
      
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Explore my digital garden of projects and research. A creative portfolio showcasing development work, academic papers, and innovative ideas in an exploration-themed format.');
      }
    };
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const projectData = await getProjects();
        setProjects(projectData);
      } catch (error) {
        console.error('Failed to load projects for knowledge graph:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    
    const query = searchQuery.toLowerCase();
    return projects.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query)) ||
      project.topics?.some(topic => topic.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  // Generate graph data
  const graphData = useMemo(() => {
    if (filteredProjects.length === 0) {
      return { nodes: [], links: [] };
    }
    return createKnowledgeGraph(filteredProjects, grouping, researchOnly);
  }, [filteredProjects, grouping, researchOnly]);

  const handleReset = () => {
    setSearchQuery("");
    setGrouping("topic");
    setResearchOnly(false);
  };

  // Count stats for display
  const stats = useMemo(() => {
    const totalNodes = graphData.nodes.length;
    const repositoryNodes = graphData.nodes.filter(node => node.type === 'repository').length;
    const groupNodes = graphData.nodes.filter(node => node.type !== 'repository').length;
    const totalLinks = graphData.links.length;

    return {
      totalNodes,
      repositoryNodes,
      groupNodes,
      totalLinks
    };
  }, [graphData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Network className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Knowledge Graph
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Explore the interconnected ecosystem of projects, technologies, and research areas. 
              Navigate through the digital garden as a living network of ideas and implementations.
            </p>
          </div>
        </div>
      </section>

      {/* Graph Visualization */}
      <div className="w-full h-[600px] relative overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading knowledge graph...</p>
            </div>
          </div>
        ) : graphData.nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Network className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium text-foreground">No data to visualize</h3>
              <p className="text-muted-foreground max-w-md">
                Try adjusting your search terms or filters to see the knowledge graph.
              </p>
            </div>
          </div>
        ) : (
          <KnowledgeGraph3D
            data={graphData}
            onNodeClick={(node: any) => {
              if (node.url) {
                window.open(node.url, '_blank');
              }
            }}
          />
        )}
        
        {/* Controls Overlay - Top Left */}
        <Card className="absolute top-4 left-4 w-80 bg-background/95 backdrop-blur-sm border shadow-lg z-10">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Controls</span>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-8 text-sm"
                data-testid="input-graph-search"
              />
            </div>
            
            {/* Research Only Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="research-only" className="text-sm">
                Research Only
              </Label>
              <Switch
                id="research-only"
                checked={researchOnly}
                onCheckedChange={setResearchOnly}
                data-testid="switch-research-only"
              />
            </div>
            
            {/* Grouping */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Group by:</Label>
              <Select value={grouping} onValueChange={(value: GroupingMode) => setGrouping(value)}>
                <SelectTrigger className="w-28 h-8 text-xs" data-testid="select-grouping">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="topic">Topic</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="w-full h-8 text-xs"
              data-testid="button-reset-filters"
            >
              <RotateCcw className="h-3 w-3 mr-2" />
              Reset
            </Button>
            
            {/* Stats */}
            <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
              <div className="flex justify-between">
                <span>Nodes:</span>
                <span data-testid="stat-total-nodes">{stats.totalNodes}</span>
              </div>
              <div className="flex justify-between">
                <span>Projects:</span>
                <span data-testid="stat-repo-nodes">{stats.repositoryNodes}</span>
              </div>
              <div className="flex justify-between">
                <span>Connections:</span>
                <span data-testid="stat-total-links">{stats.totalLinks}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Legend Overlay - Bottom Right */}
        <Card className="absolute bottom-4 right-4 w-72 bg-background/95 backdrop-blur-sm border shadow-lg z-10">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Network className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Navigation Guide</span>
            </div>
            
            {/* Node Types */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-foreground">Node Types</h4>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500 hover:bg-blue-500 text-white w-2 h-2 p-0 rounded-full" />
                  <span>Development projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 hover:bg-green-500 text-white w-2 h-2 p-0 rounded-full" />
                  <span>Research projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-500 hover:bg-purple-500 text-white w-2 h-2 p-0 rounded-full" />
                  <span>Topics and themes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white w-2 h-2 p-0 rounded-full" />
                  <span>Technologies</span>
                </div>
              </div>
            </div>
            
            {/* Interactions */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-foreground">Interactions</h4>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mouse className="h-3 w-3" />
                  <span>Drag to rotate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link className="h-3 w-3" />
                  <span>Click projects to open</span>
                </div>
                <div className="flex items-center gap-2">
                  <ZoomIn className="h-3 w-3" />
                  <span>Scroll to zoom</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}