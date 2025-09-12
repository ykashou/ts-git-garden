import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sprout, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Digital Garden</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate"
                data-testid="nav-portfolio"
              >
                <Sprout className="h-4 w-4 mr-2" />
                Portfolio
              </Button>
            </Link>
            
            <Link href="/research">
              <Button 
                variant={location === "/research" ? "default" : "ghost"}
                size="sm"
                className="hover-elevate"
                data-testid="nav-research"
              >
                <FileText className="h-4 w-4 mr-2" />
                Research
              </Button>
            </Link>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}