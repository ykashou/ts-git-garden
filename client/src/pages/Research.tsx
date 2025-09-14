import ResearchPaper from "@/components/ResearchPaper";
import { Button } from "@/components/ui/button";
import { FileText, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { getPapers } from "@/lib/staticDataLoader";
import { ResearchPaper as ResearchPaperType } from "@shared/schema";

export default function Research() {
  const [searchTerm, setSearchTerm] = useState("");
  const [papers, setPapers] = useState<ResearchPaperType[]>([]);
  
  useEffect(() => {
    getPapers().then(setPapers);
  }, []); 
  
  const filteredPapers = papers.filter(paper => 
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    paper.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <FileText className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Research Papers
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Exploring the intersection of technology, society, and innovation through 
            academic research and scientific discovery.
          </p>
          
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search papers by title, author, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              data-testid="input-search"
            />
          </div>
        </div>
        
        {/* Papers Grid */}
        <div className="space-y-6">
          {filteredPapers.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No papers found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all papers.
              </p>
            </div>
          ) : (
            filteredPapers.map((paper) => (
              <ResearchPaper
                key={paper.id}
                {...paper}
              />
            ))
          )}
        </div>
        
        {/* Additional Actions */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="hover-elevate"
            data-testid="button-view-more"
          >
            View More on Google Scholar
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border mt-16">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Digital Garden. Research contributions to the academic community.
          </p>
        </div>
      </footer>
    </div>
  );
}