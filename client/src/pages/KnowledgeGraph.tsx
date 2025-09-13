import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Search, Filter, RotateCcw, Info } from "lucide-react";
import { getProjects } from "@/lib/staticDataLoader";
import { createKnowledgeGraph, GroupingMode, KnowledgeGraphData } from "@/lib/githubApi";
import { Project } from "@shared/schema";
import KnowledgeGraph3D from "../components/KnowledgeGraph3D";

export default function KnowledgeGraph() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [grouping, setGrouping] = useState<GroupingMode>("topic");
  const [researchOnly, setResearchOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          <div className="text-center mb-12">
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

          {/* Controls Panel */}
          <Card className="mb-8 hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Graph Controls & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Top row - Search and View Toggle */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search projects, technologies, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 border-border"
                    data-testid="input-graph-search"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="research-only"
                    checked={researchOnly}
                    onCheckedChange={setResearchOnly}
                    data-testid="switch-research-only"
                  />
                  <Label htmlFor="research-only" className="whitespace-nowrap">
                    Research Only
                  </Label>
                </div>
              </div>

              {/* Bottom row - Grouping and Actions */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-4">
                  <Label htmlFor="grouping-select" className="whitespace-nowrap font-medium">
                    Group by:
                  </Label>
                  <Select value={grouping} onValueChange={(value: GroupingMode) => setGrouping(value)}>
                    <SelectTrigger className="w-40" id="grouping-select" data-testid="select-grouping">
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

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="hover-elevate"
                    data-testid="button-reset-filters"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  <span data-testid="stat-total-nodes">Nodes: {stats.totalNodes}</span>
                </div>
                <div>
                  <span data-testid="stat-repo-nodes">Projects: {stats.repositoryNodes}</span>
                </div>
                <div>
                  <span data-testid="stat-group-nodes">Groups: {stats.groupNodes}</span>
                </div>
                <div>
                  <span data-testid="stat-total-links">Connections: {stats.totalLinks}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3D Graph Visualization */}
      <section className="py-8">
        <div className="container mx-auto max-w-full px-4">
          <Card className="min-h-[600px] overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center h-[600px]">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading knowledge graph...</p>
                  </div>
                </div>
              ) : graphData.nodes.length === 0 ? (
                <div className="flex items-center justify-center h-[600px]">
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
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Instructions/Help Section */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                How to Navigate the Knowledge Graph
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Node Types</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>🔵 <strong>Blue spheres</strong> - Development projects</li>
                    <li>🟢 <strong>Green spheres</strong> - Research projects</li>
                    <li>🟣 <strong>Purple nodes</strong> - Topics and themes</li>
                    <li>🟡 <strong>Yellow nodes</strong> - Technologies</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Interactions</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>🖱️ <strong>Drag</strong> to rotate and explore</li>
                    <li>🔗 <strong>Click projects</strong> to open repositories</li>
                    <li>🔍 <strong>Scroll</strong> to zoom in and out</li>
                    <li>⚙️ <strong>Use filters</strong> to focus exploration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Digital Garden. Visualizing the network of knowledge and innovation.
          </p>
        </div>
      </footer>
    </div>
  );
}