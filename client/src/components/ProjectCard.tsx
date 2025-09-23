import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Calendar } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: "blooming" | "growing" | "mature";
  lastUpdated: string;
}

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

export default function ProjectCard({ 
  title, 
  description, 
  technologies, 
  githubUrl, 
  liveUrl, 
  status,
  lastUpdated 
}: ProjectCardProps) {
  const handleGithubClick = () => {
    console.log(`Opening GitHub for ${title}`);
    if (githubUrl) window.open(githubUrl, '_blank');
  };
  
  const handleLiveClick = () => {
    console.log(`Opening live demo for ${title}`);
    if (liveUrl) window.open(liveUrl, '_blank');
  };

  return (
    <Card className="h-full flex flex-col hover-elevate transition-all duration-200" data-testid={`card-project-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl text-foreground">{title}</CardTitle>
          <Badge 
            className={`${statusColors[status]} text-xs whitespace-nowrap`}
            data-testid={`status-${status}`}
          >
            {statusLabels[status]}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge 
                key={tech} 
                variant="secondary" 
                className="text-xs"
                data-testid={`tech-${tech.toLowerCase()}`}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            Last tended: {lastUpdated}
          </div>
          
          <div className="flex gap-2">
            {githubUrl && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleGithubClick}
                className="flex-1 hover-elevate"
                data-testid="button-github"
              >
                <Github className="h-4 w-4 mr-2" />
                Code
              </Button>
            )}
            
            {liveUrl && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleLiveClick}
                className="flex-1 hover-elevate"
                data-testid="button-demo"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Demo
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}