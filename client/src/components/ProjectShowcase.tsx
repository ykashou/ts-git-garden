import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getProjects } from "@/lib/staticDataLoader";
import { useState, useEffect } from "react";
import { Project } from "@shared/schema";

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    getProjects().then(setProjects);
  }, []); 
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project) => (
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