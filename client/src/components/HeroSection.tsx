import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Mail, MapPin, Sprout } from "lucide-react";
import { getConfig } from "@/lib/staticDataLoader";
import { useState, useEffect } from "react";
import { PortfolioConfig } from "@shared/schema";

export default function HeroSection() {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  
  useEffect(() => {
    getConfig().then(setConfig);
  }, []); 
  
  if (!config) return null;
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Sprout className="h-12 w-12 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Welcome to My {config.name}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {config.tagline}. 
            Explore my collection of software projects and research discoveries.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="hover-elevate" data-testid="button-view-projects">
              <Sprout className="h-4 w-4 mr-2" />
              Explore Projects
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg" 
              className="hover-elevate" 
              data-testid="button-contact"
              onClick={() => {
                if (config.email) {
                  window.open(`mailto:${config.email}?subject=Hello from your Digital Garden`, '_blank');
                }
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Get in Touch
            </Button>
          </div>
        </div>
        
        <Card className="p-8 hover-elevate">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                About the Gardener
              </h2>
              
              <p className="text-muted-foreground mb-6">
                {config.bio}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {config.location}
                </div>
                
                {config.githubUsername && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Github className="h-4 w-4 mr-2" />
                    github.com/{config.githubUsername}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground mb-4">
                Cultivated Skills
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {config.skills.map((skill) => (
                  <div 
                    key={skill}
                    className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm text-center"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}