import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search, Tag, Grid3X3, List, Github, ExternalLink, Calendar } from "lucide-react";
import { getProjects } from "@/lib/staticDataLoader";
import { useState, useEffect, useMemo } from "react";
import { Project } from "@shared/schema";

const statusColors = {
  blooming: "bg-green-100 text-green-800",
  growing: "bg-yellow-100 text-yellow-800", 
  mature: "bg-blue-100 text-blue-800"
};

const statusLabels = {
  blooming: "🌱 Blooming",
  growing: "🌿 Growing", 
  mature: "🌳 Mature"
};

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  // Get all unique technologies as filterable topics (since GitHub topics are empty)
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    
    // First try to get actual GitHub topics
    projects.forEach(project => {
      project.topics?.forEach(topic => topics.add(topic));
    });
    
    // If no GitHub topics exist, use technologies as filterable topics
    if (topics.size === 0) {
      projects.forEach(project => {
        project.technologies?.forEach(tech => topics.add(tech));
      });
    }
    
    return Array.from(topics).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((project) => {
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some(tech => tech.toLowerCase().includes(query)) ||
          project.topics?.some(topic => topic.toLowerCase().includes(query)) ||
          project.status.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply topic filter (check both GitHub topics and technologies) - INTERSECTION (AND)
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((project) => {
        return selectedTopics.every(selectedTopic => 
          project.topics?.includes(selectedTopic) ||
          project.technologies?.includes(selectedTopic)
        );
      });
    }
    
    return filtered;
  }, [projects, searchQuery, selectedTopics]);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };
  
  const handleAddProject = () => {
    console.log('Add new project triggered');
    // Projects are now pulled from GitHub repositories
    alert('Projects are automatically pulled from your GitHub repositories. Create a new repository on GitHub to add it to your portfolio!');
  };

  return (
    <section className="pt-16 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Projects in the Garden
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each project represents a unique growth journey, from initial seedling ideas 
            to fully mature applications. Explore the diverse ecosystem of my work.
          </p>
        </div>
        
        {/* Search bar with view switcher */}
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects by name, description, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-border"
                data-testid="input-project-search"
              />
            </div>
            
            {/* View mode switcher */}
            <div className="flex border rounded-md p-1 bg-background">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3 py-1 h-8"
                data-testid="button-view-grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3 py-1 h-8"
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Topic filters */}
          {allTopics.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {allTopics.map((topic) => (
                  <Badge 
                    key={topic}
                    variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    className="text-xs hover-elevate cursor-pointer"
                    onClick={() => handleTopicToggle(topic)}
                    data-testid={`filter-topic-${topic}`}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
              
              {/* Clear filters button */}
              {selectedTopics.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedTopics([])}
                  className="text-xs"
                  data-testid="button-clear-topic-filters"
                >
                  Clear Topic Filters ({selectedTopics.length})
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Projects display - conditional based on view mode */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
              />
            ))}
            
            {/* Add new project card */}
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px] hover-elevate cursor-pointer transition-colors"
              onClick={handleAddProject}
              data-testid="card-add-project"
            >
              <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Plant New Idea
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Start growing your next project
              </p>
            </div>
          </div>
        ) : (
          /* List view */
          <div className="space-y-4 mb-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover-elevate transition-all duration-200" data-testid={`list-project-${project.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left side - Project info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                        <Badge 
                          className={`${statusColors[project.status]} text-xs whitespace-nowrap`}
                          data-testid={`status-${project.status}`}
                        >
                          {statusLabels[project.status]}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <Badge 
                              key={tech} 
                              variant="secondary" 
                              className="text-xs"
                              data-testid={`tech-${tech.toLowerCase()}`}
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.technologies.length - 4}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {project.lastUpdated}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Action buttons */}
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => window.open(project.githubUrl, '_blank')}
                          className="hover-elevate"
                          data-testid="button-github"
                        >
                          <Github className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {project.liveUrl && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => window.open(project.liveUrl, '_blank')}
                          className="hover-elevate"
                          data-testid="button-demo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add new project in list view */}
            <Card 
              className="border-2 border-dashed border-border hover-elevate cursor-pointer transition-colors"
              onClick={handleAddProject}
              data-testid="list-add-project"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3">
                  <PlusCircle className="h-6 w-6 text-muted-foreground" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-foreground">
                      Plant New Idea
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Start growing your next project
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="hover-elevate"
            data-testid="button-view-all"
          >
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}