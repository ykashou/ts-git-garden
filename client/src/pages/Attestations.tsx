import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Search, 
  ExternalLink, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Calendar,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PackageAttestation } from "@shared/schema";

export default function Attestations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegistry, setSelectedRegistry] = useState<string>("all");
  
  // Fetch packages and attestations data
  const { data: packages = [], isLoading, error } = useQuery<PackageAttestation[]>({
    queryKey: ['/api/packages/attestations'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filteredPackages = packages.filter((pkg: PackageAttestation) => {
    const matchesSearch = 
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.maintainers.some(maintainer => maintainer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRegistry = selectedRegistry === "all" || pkg.registry === selectedRegistry;
    
    return matchesSearch && matchesRegistry;
  });

  const getStatusIcon = (status: PackageAttestation['attestationStatus']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'unverified':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: PackageAttestation['attestationStatus']) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unverified':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRegistryColor = (registry: PackageAttestation['registry']) => {
    switch (registry) {
      case 'npm':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pypi':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cargo':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'nuget':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'maven':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const registries = ["all", "npm", "pypi", "cargo", "nuget", "maven"];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Package Attestations
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cryptographic proof of authenticity for all published packages across registries. 
            Ensuring supply chain security through verifiable attestations.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search packages by name, description, or maintainer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-border"
                data-testid="input-package-search"
              />
            </div>
            
            {/* Registry Filter */}
            <div className="flex gap-2">
              {registries.map((registry) => (
                <Button
                  key={registry}
                  variant={selectedRegistry === registry ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRegistry(registry)}
                  className="capitalize"
                  data-testid={`filter-registry-${registry}`}
                >
                  {registry}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Loading Packages...
            </h3>
            <p className="text-muted-foreground">
              Fetching attestation data from package registries.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Failed to Load Packages
            </h3>
            <p className="text-muted-foreground">
              There was an error fetching package attestation data.
            </p>
          </div>
        )}

        {/* Packages List */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {filteredPackages.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No packages found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or registry filter.
                </p>
              </div>
            ) : (
              filteredPackages.map((pkg: PackageAttestation) => (
                <Card 
                  key={pkg.id} 
                  className="hover-elevate transition-all duration-200" 
                  data-testid={`package-${pkg.packageName}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left side - Package info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold text-foreground">
                              {pkg.packageName}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              v{pkg.version}
                            </Badge>
                            <Badge 
                              className={`text-xs ${getRegistryColor(pkg.registry)}`}
                              data-testid={`registry-${pkg.registry}`}
                            >
                              {pkg.registry.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <Badge 
                            className={`text-xs flex items-center gap-1 ${getStatusColor(pkg.attestationStatus)}`}
                            data-testid={`status-${pkg.attestationStatus}`}
                          >
                            {getStatusIcon(pkg.attestationStatus)}
                            {pkg.attestationStatus}
                          </Badge>
                        </div>
                        
                        {pkg.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {pkg.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(pkg.publishedAt).toLocaleDateString()}
                            </div>
                            
                            {pkg.downloadCount && (
                              <div className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {pkg.downloadCount.toLocaleString()} downloads
                              </div>
                            )}
                            
                            {pkg.license && (
                              <div className="flex items-center gap-1">
                                <span>{pkg.license}</span>
                              </div>
                            )}
                          </div>
                          
                          {pkg.maintainers.length > 0 && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {pkg.maintainers.slice(0, 2).join(", ")}
                              {pkg.maintainers.length > 2 && ` +${pkg.maintainers.length - 2}`}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Right side - Action buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => window.open(pkg.packageUrl, '_blank')}
                          className="hover-elevate"
                          data-testid="button-package"
                        >
                          <Package className="h-4 w-4" />
                        </Button>
                        
                        {pkg.attestationUrl && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => window.open(pkg.attestationUrl, '_blank')}
                            className="hover-elevate"
                            data-testid="button-attestation"
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Summary Stats */}
        {!isLoading && !error && packages.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-foreground">{packages.length}</div>
              <div className="text-sm text-muted-foreground">Total Packages</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">
                {packages.filter((p: PackageAttestation) => p.attestationStatus === 'verified').length}
              </div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {packages.filter((p: PackageAttestation) => p.attestationStatus === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-red-600">
                {packages.filter((p: PackageAttestation) => p.attestationStatus === 'unverified' || p.attestationStatus === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}