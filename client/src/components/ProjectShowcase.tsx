import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { getProjects } from "@/lib/staticDataLoader";
import { useState, useEffect, useMemo } from "react";
import { Project } from "@shared/schema";

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    
    const query = searchQuery.toLowerCase();
    return projects.filter((project) => {
      return (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query)) ||
        project.status.toLowerCase().includes(query)
      );
    });
  }, [projects, searchQuery]);
  
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
        <div className="max-w-md mx-auto mb-8">
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