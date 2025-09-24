import ProjectShowcase from "@/components/ProjectShowcase";

export default function Projects() {
  return (
    <div className="min-h-screen bg-background">
      <ProjectShowcase />
      
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