import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Heart, Github, Wallet, CheckCircle } from "lucide-react";
import { getProjects } from "@/lib/staticDataLoader";
import { Project, SponsorshipTier } from "@shared/schema";
import BitcoinDonation from "@/components/BitcoinDonation";

export default function Sponsorships() {
  const [wizardStep, setWizardStep] = useState(1);
  const [sponsorshipType, setSponsorshipType] = useState<"general" | "project">("general");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTier, setSelectedTier] = useState<SponsorshipTier | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tiers, setTiers] = useState<SponsorshipTier[]>([]);
  const [showBitcoin, setShowBitcoin] = useState(false);

  useEffect(() => {
    // Load projects and sponsorship tiers
    getProjects().then(setProjects);
    
    fetch('/data/sponsorships.json')
      .then(res => {
        console.log('Sponsorships response:', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Sponsorships data loaded:', data);
        setTiers(data.tiers);
      })
      .catch(error => {
        console.error('Failed to load sponsorships:', error);
        // Fallback to hardcoded tiers
        setTiers([
          {
            id: "seedling",
            name: "🌱 Seedling",
            amount: 5,
            description: "Plant seeds for future growth",
            benefits: ["Supporter badge on GitHub", "Early access to updates", "Community Discord access"],
            githubSponsorsUrl: "https://github.com/sponsors/ykashou?tier_id=seedling"
          },
          {
            id: "growing", 
            name: "🌿 Growing",
            amount: 15,
            description: "Nurture ongoing development",
            benefits: ["Priority issue responses", "Name in project credits", "Monthly progress reports", "All Seedling benefits"],
            githubSponsorsUrl: "https://github.com/sponsors/ykashou?tier_id=growing"
          },
          {
            id: "mature",
            name: "🌳 Mature", 
            amount: 25,
            description: "Support established projects",
            benefits: ["Feature request priority", "1-on-1 monthly calls", "Logo/link on project pages", "All previous benefits"],
            githubSponsorsUrl: "https://github.com/sponsors/ykashou?tier_id=mature"
          },
          {
            id: "bespoke",
            name: "🌺 Bespoke",
            amount: 50,
            description: "Custom sponsorship arrangement", 
            benefits: ["Custom sponsorship terms", "Direct collaboration opportunities", "Dedicated support channel", "All previous benefits"],
            githubSponsorsUrl: "https://github.com/sponsors/ykashou?tier_id=bespoke"
          }
        ]);
      });
  }, []);

  const nextStep = () => {
    if (wizardStep < 4) setWizardStep(wizardStep + 1);
  };

  const prevStep = () => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1);
  };

  const resetWizard = () => {
    setWizardStep(1);
    setSponsorshipType("general");
    setSelectedProject(null);
    setSelectedTier(null);
    setShowBitcoin(false);
  };

  const canContinue = () => {
    switch (wizardStep) {
      case 1: return true;
      case 2: return sponsorshipType === "general" || selectedProject !== null;
      case 3: return selectedTier !== null;
      case 4: return true;
      default: return false;
    }
  };

  const getSponsorshipSummary = () => {
    const type = sponsorshipType === "project" && selectedProject 
      ? selectedProject.title 
      : "General Support";
    const amount = selectedTier ? `$${selectedTier.amount}/month` : "";
    return `${type} ${amount}`.trim();
  };


  return (
    <section className="py-16 px-4 min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Heart className="h-12 w-12 text-pink-500" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Support the Digital Garden
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Help cultivate open source projects and research initiatives
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step <= wizardStep
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                />
                {step < 4 && (
                  <div
                    className={`w-8 h-0.5 mx-2 transition-colors ${
                      step < wizardStep
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <Card className="flex flex-col min-h-[500px]">
          <CardContent className="flex-1 p-8">
            {/* Step 1: Sponsorship Intent */}
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">How would you like to help?</h2>
                  <p className="text-muted-foreground">Choose your sponsorship focus</p>
                </div>
                
                <div className="space-y-4">
                  <Card 
                    className={`cursor-pointer transition-all hover-elevate ${
                      sponsorshipType === "general" ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSponsorshipType("general")}
                    data-testid="card-general-support"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          sponsorshipType === "general" 
                            ? "bg-primary border-primary" 
                            : "border-muted-foreground"
                        }`} />
                        <div>
                          <h3 className="text-lg font-medium">🌱 General Support</h3>
                          <p className="text-sm text-muted-foreground">
                            Support all projects and research initiatives
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all hover-elevate ${
                      sponsorshipType === "project" ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSponsorshipType("project")}
                    data-testid="card-project-support"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          sponsorshipType === "project" 
                            ? "bg-primary border-primary" 
                            : "border-muted-foreground"
                        }`} />
                        <div>
                          <h3 className="text-lg font-medium">🎯 Sponsor a Project</h3>
                          <p className="text-sm text-muted-foreground">
                            Focus support on a specific project you care about
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 2: Project Selection */}
            {wizardStep === 2 && sponsorshipType === "project" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Choose Your Project</h2>
                  <p className="text-muted-foreground">Select the project you'd like to sponsor</p>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {projects.map((project) => (
                    <Card 
                      key={project.id}
                      className={`cursor-pointer transition-all hover-elevate ${
                        selectedProject?.id === project.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedProject(project)}
                      data-testid={`card-project-${project.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{project.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 3).map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ml-3 transition-colors ${
                            selectedProject?.id === project.id
                              ? "bg-primary border-primary"
                              : "border-muted-foreground"
                          }`} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 Skip for General Support */}
            {wizardStep === 2 && sponsorshipType === "general" && (
              <div className="text-center space-y-6">
                <div>
                  <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Supporting All Projects</h2>
                  <p className="text-muted-foreground">
                    Your contribution will support the entire digital garden ecosystem
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Amount Selection */}
            {wizardStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Choose Support Level</h2>
                  <p className="text-muted-foreground">Select your monthly contribution amount</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tiers.map((tier) => (
                    <Card 
                      key={tier.id}
                      className={`cursor-pointer transition-all hover-elevate ${
                        selectedTier?.id === tier.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedTier(tier)}
                      data-testid={`card-tier-${tier.id}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{tier.name}</CardTitle>
                          <div className="text-right">
                            <div className="text-xl font-bold">${tier.amount}</div>
                            <div className="text-xs text-muted-foreground">per month</div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="text-sm space-y-1">
                          {tier.benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Payment Method */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Complete Your Sponsorship</h2>
                  <p className="text-muted-foreground mb-4">
                    Supporting: {getSponsorshipSummary()}
                  </p>
                </div>
                
                {!showBitcoin ? (
                  <div className="space-y-4">
                    <Card className="hover-elevate transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Github className="h-6 w-6" />
                            <div>
                              <h3 className="font-medium">GitHub Sponsors</h3>
                              <p className="text-sm text-muted-foreground">Recurring monthly payments</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => selectedTier?.githubSponsorsUrl && window.open(selectedTier.githubSponsorsUrl, '_blank')}
                            data-testid="button-github-sponsors"
                          >
                            Sponsor via GitHub <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover-elevate transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Wallet className="h-6 w-6" />
                            <div>
                              <h3 className="font-medium">Bitcoin</h3>
                              <p className="text-sm text-muted-foreground">One-time payment</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline"
                            onClick={() => setShowBitcoin(true)}
                            data-testid="button-show-bitcoin"
                          >
                            Show QR Code
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <h3 className="font-medium mb-2">Bitcoin Payment</h3>
                          <p className="text-sm text-muted-foreground">
                            Scan QR code or copy address for one-time payment
                          </p>
                        </div>
                        <BitcoinDonation 
                          suggestedAmount={selectedTier?.amount}
                          label={sponsorshipType === "project" && selectedProject 
                            ? `Digital Garden - ${selectedProject.title}` 
                            : "Digital Garden Sponsorship"
                          }
                        />
                      </CardContent>
                    </Card>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBitcoin(false)}
                      className="w-full"
                    >
                      ← Back to Payment Options
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          {/* Navigation */}
          <div className="border-t p-6 bg-background">
            <div className="flex justify-between items-center">
              <div>
                {wizardStep > 1 ? (
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    data-testid="button-prev-step"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <div /> 
                )}
              </div>
              
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetWizard}
                  className="text-xs text-muted-foreground"
                  data-testid="button-start-over"
                >
                  Start Over
                </Button>
              </div>

              <div>
                {wizardStep < 4 ? (
                  <Button 
                    onClick={nextStep}
                    disabled={!canContinue()}
                    data-testid="button-next-step"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}