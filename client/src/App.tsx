import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Portfolio from "@/pages/Portfolio";
import Projects from "@/pages/Projects";
import Research from "@/pages/Research";
import Sponsorships from "@/pages/Sponsorships";
import KnowledgeGraph from "@/pages/KnowledgeGraph";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/projects" component={Projects} />
      <Route path="/research" component={Research} />
      <Route path="/graph" component={KnowledgeGraph} />
      <Route path="/sponsor" component={Sponsorships} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
