import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Github, ExternalLink, Calendar, Heart, ChevronDown, MessageSquare } from "lucide-react";

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
  
  const handleSupportProject = () => {
    console.log(`Support project: ${title}`);
    // Navigate to sponsor page - could be enhanced to pass project context
    window.open('/sponsor', '_blank');
  };
  
  const handleRequestFeature = () => {
    console.log(`Request feature for: ${title}`);
    // Could open contact form or GitHub issues - for now, navigate to contact
    if (githubUrl) {
      window.open(`${githubUrl}/issues/new`, '_blank');
    }
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
          
          {/* Bitcoin Orange Sponsor Dropdown Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600 hover-elevate"
                size="sm"
                data-testid="button-sponsor"
              >
                <Heart className="h-4 w-4 mr-2" />
                Sponsor
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem 
                onClick={handleSupportProject}
                data-testid="sponsor-support"
              >
                <Heart className="h-4 w-4 mr-2" />
                Support the Project
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleRequestFeature}
                data-testid="sponsor-feature"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Request a Feature
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}