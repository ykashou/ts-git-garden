import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Github, Mail, MapPin, Sprout, Send } from "lucide-react";
import { getConfig, getProjects } from "@/lib/staticDataLoader";
import { useState, useEffect } from "react";
import { PortfolioConfig, Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function HeroSection() {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', project: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    getConfig().then(setConfig);
    getProjects().then(setProjects);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show a success message
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    setContactForm({ name: '', email: '', message: '', project: '' });
    setIsDialogOpen(false);
  }; 
  
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
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="hover-elevate" 
                  data-testid="button-contact"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Get in Touch
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Get in Touch
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      required
                      data-testid="input-name"
                      className="bg-secondary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      required
                      data-testid="input-email"
                      className="bg-secondary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="project">Project (Optional)</Label>
                    <Select 
                      value={contactForm.project} 
                      onValueChange={(value) => setContactForm(prev => ({ ...prev, project: value }))}
                    >
                      <SelectTrigger data-testid="select-project" className="bg-secondary">
                        <SelectValue placeholder="Select a project to discuss" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Hello! I'd like to connect about..."
                      rows={4}
                      required
                      data-testid="input-message"
                      className="bg-secondary"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 hover-elevate"
                      data-testid="button-send"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
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