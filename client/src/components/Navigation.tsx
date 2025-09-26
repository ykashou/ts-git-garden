import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sprout, FileText, Heart, Network, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <div className="w-full flex justify-center pt-4 px-2 sm:px-4">
      <nav id="site-nav" className="w-full max-w-[95%] sm:max-w-[85%] lg:max-w-[60%] border border-border rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Sprout className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              <h1 className="text-lg sm:text-xl font-semibold text-foreground hidden sm:block">Digital Garden</h1>
              <h1 className="text-sm font-semibold text-foreground sm:hidden">Garden</h1>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate px-2 sm:px-3"
                data-testid="nav-portfolio"
              >
                <Sprout className="h-4 w-4 sm:mr-2 text-green-500" />
                <span className="hidden sm:inline">Portfolio</span>
              </Button>
            </Link>
            
            <Link href="/research">
              <Button 
                variant={location === "/research" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate px-2 sm:px-3"
                data-testid="nav-research"
              >
                <FileText className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Research</span>
              </Button>
            </Link>
            
            <Link href="/graph">
              <Button 
                variant={location === "/graph" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate px-2 sm:px-3"
                data-testid="nav-graph"
              >
                <Network className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Graph</span>
              </Button>
            </Link>
            
            <Link href="/attestations">
              <Button 
                variant={location === "/attestations" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate px-2 sm:px-3"
                data-testid="nav-attestations"
              >
                <Shield className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Attestations</span>
              </Button>
            </Link>
            
            <Link href="/sponsor">
              <Button 
                variant={location === "/sponsor" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate px-2 sm:px-3"
                data-testid="nav-sponsor"
              >
                <Heart className="h-4 w-4 sm:mr-2 text-pink-500" />
                <span className="hidden sm:inline">Sponsor</span>
              </Button>
            </Link>
            
            <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}