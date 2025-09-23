import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Github, Mail, MapPin, Sprout, Send, User, UserX, ChevronDown, Zap } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { getConfig, getProjects } from "@/lib/staticDataLoader";
import { useState, useEffect } from "react";
import { PortfolioConfig, Project } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function HeroSection() {
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '', project: '' });
  const [contactType, setContactType] = useState<'identified' | 'anonymous' | null>(null);
  const [contactMethod, setContactMethod] = useState<'email' | 'nostr' | 'discord'>('email');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    getConfig().then(setConfig);
    getProjects().then(setProjects);
  }, []);

  const scrollToProjects = () => {
    const element = document.getElementById('projects-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show a success message
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    setContactForm({ name: '', email: '', message: '', project: '' });
    setContactType(null);
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
            <Button size="lg" className="hover-elevate" onClick={scrollToProjects} data-testid="button-view-projects">
              <Sprout className="h-4 w-4 mr-2" />
              Explore Projects
            </Button>
            
            <div className="flex">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="hover-elevate rounded-r-none" 
                    data-testid="button-contact"
                  >
                    {contactMethod === 'email' && <Mail className="h-4 w-4 mr-2" />}
                    {contactMethod === 'nostr' && <Zap className="h-4 w-4 mr-2" />}
                    {contactMethod === 'discord' && <SiDiscord className="h-4 w-4 mr-2" />}
                    Get in Touch
                  </Button>
                </DialogTrigger>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="hover-elevate rounded-l-none border-l-2 border-l-border px-3"
                      data-testid="button-contact-method"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => setContactMethod('email')}
                      data-testid="method-email"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setContactMethod('nostr')}
                      data-testid="method-nostr"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Nostr
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setContactMethod('discord')}
                      data-testid="method-discord"
                    >
                      <SiDiscord className="h-4 w-4 mr-2" />
                      Discord
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {contactMethod === 'email' && <Mail className="h-5 w-5" />}
                    {contactMethod === 'nostr' && <Zap className="h-5 w-5" />}
                    {contactMethod === 'discord' && <SiDiscord className="h-5 w-5" />}
                    Get in Touch via {contactMethod.charAt(0).toUpperCase() + contactMethod.slice(1)}
                  </DialogTitle>
                </DialogHeader>
                
                {/* Contact Type Selection */}
                <div className="space-y-4">
                  <div className="text-sm font-medium text-foreground mb-3">How would you like to get in touch?</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setContactType('identified')}
                      className={`p-4 rounded-lg border-2 transition-all hover-elevate ${
                        contactType === 'identified'
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-secondary hover:border-primary/50'
                      }`}
                      data-testid="button-contact-identified"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium">With Contact Info</span>
                        <span className="text-xs text-muted-foreground text-center">Share your details for follow-up</span>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setContactType('anonymous')}
                      className={`p-4 rounded-lg border-2 transition-all hover-elevate ${
                        contactType === 'anonymous'
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-secondary hover:border-primary/50'
                      }`}
                      data-testid="button-contact-anonymous"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <UserX className="h-5 w-5" />
                        <span className="text-sm font-medium">Send Anonymously</span>
                        <span className="text-xs text-muted-foreground text-center">No contact details required</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* Form appears when contact type is selected */}
                {contactType && (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                  {/* Name and Email fields - only show for identified contact */}
                  {contactType === 'identified' && (
                    <>
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
                    </>
                  )}
                  
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
                          <SelectItem key={project.id} value={project.id} className="h-16 p-3">
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm truncate max-w-[180px]">{project.title}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground shrink-0 ml-2">
                                  {project.status === 'blooming' && '🌱'}
                                  {project.status === 'growing' && '🌿'}
                                  {project.status === 'mature' && '🌳'}
                                  {project.status}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground data-[highlighted]:text-primary-foreground">
                                <span className="truncate max-w-[150px]">{project.description}</span>
                                <span className="shrink-0 ml-2">
                                  {project.technologies.slice(0, 2).join(', ')}
                                  {project.technologies.length > 2 && ` +${project.technologies.length - 2}`}
                                </span>
                              </div>
                            </div>
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
                )}
              </DialogContent>
            </Dialog>
            </div>
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