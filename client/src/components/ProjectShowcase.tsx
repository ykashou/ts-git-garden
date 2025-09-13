import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Search, Tag } from "lucide-react";
import { getProjects } from "@/lib/staticDataLoader";
import { useState, useEffect, useMemo } from "react";
import { Project } from "@shared/schema";

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  // Get all unique topics from all projects
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    projects.forEach(project => {
      project.topics?.forEach(topic => topics.add(topic));
    });
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
    
    // Apply topic filter
    if (selectedTopics.length > 0) {
      filtered = filtered.filter((project) => {
        return selectedTopics.some(selectedTopic => 
          project.topics?.includes(selectedTopic)
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
    <section className="py-16 px-4">
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
        
        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects by name, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-project-search"
            />
          </div>
          
          {/* Topic filters */}
          {allTopics.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Filter by GitHub Topics:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTopics.map((topic) => (
                  <div key={topic} className="flex items-center space-x-2">
                    <Checkbox
                      id={`topic-${topic}`}
                      checked={selectedTopics.includes(topic)}
                      onCheckedChange={() => handleTopicToggle(topic)}
                      data-testid={`checkbox-topic-${topic}`}
                    />
                    <label 
                      htmlFor={`topic-${topic}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      data-testid={`label-topic-${topic}`}
                    >
                      <Badge 
                        variant="outline" 
                        className="text-xs hover-elevate"
                      >
                        {topic}
                      </Badge>
                    </label>
                  </div>
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