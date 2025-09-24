import HeroSection from "@/components/HeroSection";
import ProjectShowcase from "@/components/ProjectShowcase";
import BitcoinDonation from "@/components/BitcoinDonation";
import { Card } from "@/components/ui/card";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ProjectShowcase />
      
      {/* Bitcoin Donation Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-md">
          <Card className="p-8">
            <BitcoinDonation />
          </Card>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Digital Garden. Cultivated with ❤️ and open source tools.
          </p>
        </div>
      </footer>
    </div>
  );
}