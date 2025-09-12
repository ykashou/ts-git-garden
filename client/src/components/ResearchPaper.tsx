import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink, Calendar, Users } from "lucide-react";
import { useState } from "react";

interface ResearchPaperProps {
  title: string;
  authors: string[];
  abstract: string;
  journal?: string;
  conference?: string;
  year: number;
  doi?: string;
  pdfUrl?: string;
  tags: string[];
  status: "published" | "preprint" | "in-review";
}

const statusColors = {
  published: "bg-green-100 text-green-800",
  preprint: "bg-yellow-100 text-yellow-800",
  "in-review": "bg-blue-100 text-blue-800"
};

export default function ResearchPaper({
  title,
  authors,
  abstract,
  journal,
  conference,
  year,
  doi,
  pdfUrl,
  tags,
  status
}: ResearchPaperProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handlePdfClick = () => {
    console.log(`Opening PDF for ${title}`);
    if (pdfUrl) window.open(pdfUrl, '_blank');
  };
  
  const handleDoiClick = () => {
    console.log(`Opening DOI for ${title}`);
    if (doi) window.open(`https://doi.org/${doi}`, '_blank');
  };
  
  const venue = journal || conference;
  const truncatedAbstract = abstract.length > 200 ? abstract.substring(0, 200) + "..." : abstract;

  return (
    <Card className="hover-elevate transition-all duration-200" data-testid={`paper-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl text-foreground mb-2 leading-tight">
              {title}
            </CardTitle>
            
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4 mr-1" />
              {authors.join(", ")}
            </div>
            
            {venue && (
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <FileText className="h-4 w-4 mr-1" />
                {venue} ({year})
              </div>
            )}
          </div>
          
          <Badge 
            className={`${statusColors[status]} text-xs whitespace-nowrap`}
            data-testid={`status-${status}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs"
              data-testid={`tag-${tag.toLowerCase()}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="mb-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isExpanded ? abstract : truncatedAbstract}
            {abstract.length > 200 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1 text-primary hover:underline text-sm"
                data-testid="button-expand"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {pdfUrl && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handlePdfClick}
              className="hover-elevate"
              data-testid="button-pdf"
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          )}
          
          {doi && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleDoiClick}
              className="hover-elevate"
              data-testid="button-doi"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              DOI
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}