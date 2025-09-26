import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PackageAttestation } from "@shared/schema";
import { ChevronDown, ChevronRight } from "lucide-react";

// Type for grouped packages
interface PackageGroup {
  packageName: string;
  registry: PackageAttestation['registry'];
  description: string;
  maintainers: string[];
  latestPublishedAt: string;
  versions: PackageAttestation[];
}

export default function Attestations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegistry, setSelectedRegistry] = useState<string>("all");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  
  // Fetch packages and attestations data
  const { data: packages = [], isLoading, error } = useQuery<PackageAttestation[]>({
    queryKey: ['/api/packages/attestations'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Group packages by name + registry
  const groupedPackages = useMemo(() => {
    const groups = new Map<string, PackageGroup>();
    
    packages.forEach((pkg: PackageAttestation) => {
      const groupKey = `${pkg.registry}|${pkg.packageName}`;
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          packageName: pkg.packageName,
          registry: pkg.registry,
          description: pkg.description || "",
          maintainers: pkg.maintainers,
          latestPublishedAt: pkg.publishedAt,
          versions: []
        });
      }
      
      const group = groups.get(groupKey)!;
      group.versions.push(pkg);
      
      // Update group metadata with latest version info
      if (new Date(pkg.publishedAt) > new Date(group.latestPublishedAt)) {
        group.latestPublishedAt = pkg.publishedAt;
        group.description = pkg.description || group.description;
        group.maintainers = pkg.maintainers.length > 0 ? pkg.maintainers : group.maintainers;
      }
    });
    
    // Sort versions within each group by publishedAt (newest first)
    groups.forEach(group => {
      group.versions.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    });
    
    // Convert to array and sort by latest published date
    return Array.from(groups.values())
      .sort((a, b) => new Date(b.latestPublishedAt).getTime() - new Date(a.latestPublishedAt).getTime());
  }, [packages]);

  // Apply filtering to groups
  const filteredGroups = useMemo(() => {
    return groupedPackages.filter((group: PackageGroup) => {
      const matchesSearch = 
        group.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.maintainers.some(maintainer => maintainer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        group.versions.some(version => 
          version.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          version.version.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesRegistry = selectedRegistry === "all" || group.registry === selectedRegistry;
      
      return matchesSearch && matchesRegistry;
    });
  }, [groupedPackages, searchTerm, selectedRegistry]);

  // Reset expanded group when filters change
  useEffect(() => {
    setExpandedGroup(null);
  }, [searchTerm, selectedRegistry]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroup(expandedGroup === groupKey ? null : groupKey);
  };

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
      case 'github':
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const registries = ["all", "npm", "pypi", "github"];

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

        {/* Packages Table */}
        {!isLoading && !error && (
          <>
            {filteredGroups.length === 0 ? (
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
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Package Name</TableHead>
                      <TableHead className="w-[100px]">Version</TableHead>
                      <TableHead className="w-[100px]">Registry</TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead className="w-[120px]">Published</TableHead>
                      <TableHead className="w-[120px]">Maintainer</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups.map((group: PackageGroup) => {
                      const groupKey = `${group.registry}|${group.packageName}`;
                      const isExpanded = expandedGroup === groupKey;
                      const latestVersion = group.versions[0]; // First version is the latest due to sorting
                      
                      return (
                        <React.Fragment key={groupKey}>
                          {/* Group Header Row */}
                          <TableRow 
                            className="hover:bg-muted/50 transition-colors cursor-pointer" 
                            onClick={() => toggleGroup(groupKey)}
                            data-testid={`group-toggle-${group.registry}-${group.packageName}`}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-foreground">{group.packageName}</span>
                                {group.versions.length > 1 && (
                                  <Badge variant="secondary" className="text-xs ml-2">
                                    {group.versions.length} versions
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {latestVersion.version}
                              </Badge>
                            </TableCell>
                            
                            <TableCell>
                              <Badge 
                                className={`text-xs ${getRegistryColor(group.registry)}`}
                                data-testid={`registry-${group.registry}`}
                              >
                                {group.registry.toUpperCase()}
                              </Badge>
                            </TableCell>
                            
                            <TableCell>
                              <Badge 
                                className={`text-xs flex items-center gap-1 w-fit ${getStatusColor(latestVersion.attestationStatus)}`}
                                data-testid={`status-${latestVersion.attestationStatus}`}
                              >
                                {getStatusIcon(latestVersion.attestationStatus)}
                                {latestVersion.attestationStatus}
                              </Badge>
                            </TableCell>
                            
                            <TableCell>
                              <div className="max-w-[300px] truncate text-muted-foreground text-sm">
                                {group.description || "-"}
                              </div>
                            </TableCell>
                            
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(group.latestPublishedAt).toLocaleDateString()}
                            </TableCell>
                            
                            <TableCell className="text-sm text-muted-foreground">
                              {group.maintainers.length > 0 ? group.maintainers[0] : "-"}
                            </TableCell>
                            
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(latestVersion.packageUrl, '_blank');
                                  }}
                                  data-testid="button-package"
                                  className="h-8 w-8 p-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                                
                                {latestVersion.attestationUrl && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(latestVersion.attestationUrl, '_blank');
                                    }}
                                    data-testid="button-attestation"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Shield className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                          
                          {/* Expanded Version Rows */}
                          {isExpanded && group.versions.map((version: PackageAttestation, index: number) => (
                            <TableRow 
                              key={version.id}
                              className="bg-muted/20 border-l-4 border-l-primary/30"
                              data-testid={`row-version-${version.packageName}-${version.version}`}
                            >
                              <TableCell className="pl-12 text-sm text-muted-foreground">
                                <span className="text-xs">└ v{version.version}</span>
                              </TableCell>
                              
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {version.version}
                                </Badge>
                              </TableCell>
                              
                              <TableCell>
                                <span className="text-xs text-muted-foreground">
                                  {version.registry.toUpperCase()}
                                </span>
                              </TableCell>
                              
                              <TableCell>
                                <Badge 
                                  className={`text-xs flex items-center gap-1 w-fit ${getStatusColor(version.attestationStatus)}`}
                                  data-testid={`status-${version.attestationStatus}`}
                                >
                                  {getStatusIcon(version.attestationStatus)}
                                  {version.attestationStatus}
                                </Badge>
                              </TableCell>
                              
                              <TableCell>
                                <div className="max-w-[300px] truncate text-muted-foreground text-xs">
                                  {version.description || "-"}
                                </div>
                              </TableCell>
                              
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(version.publishedAt).toLocaleDateString()}
                              </TableCell>
                              
                              <TableCell className="text-xs text-muted-foreground">
                                {version.maintainers.length > 0 ? version.maintainers[0] : "-"}
                              </TableCell>
                              
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => window.open(version.packageUrl, '_blank')}
                                    data-testid={`button-package-${version.version}`}
                                    className="h-8 w-8 p-0"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                  
                                  {version.attestationUrl && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => window.open(version.attestationUrl, '_blank')}
                                      data-testid={`button-attestation-${version.version}`}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Shield className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        {/* Summary Stats */}
        {!isLoading && !error && filteredGroups.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-foreground">{filteredGroups.length}</div>
              <div className="text-sm text-muted-foreground">Total Packages</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">
                {filteredGroups.filter((group: PackageGroup) => 
                  group.versions.some(v => v.attestationStatus === 'verified')
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredGroups.filter((group: PackageGroup) => 
                  group.versions.some(v => v.attestationStatus === 'pending')
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-red-600">
                {filteredGroups.filter((group: PackageGroup) => 
                  group.versions.some(v => v.attestationStatus === 'unverified' || v.attestationStatus === 'error')
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}