import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
  User,
  Filter,
  X
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

// FilterDropdown component for Excel-style column filtering
interface FilterDropdownProps {
  title: string;
  values: string[];
  selectedValues: string[];
  onSelectionChange: (selected: string[]) => void;
  isActive: boolean;
  isInitialized: boolean;
}

function FilterDropdown({ title, values, selectedValues, onSelectionChange, isActive, isInitialized }: FilterDropdownProps) {
  const [searchFilter, setSearchFilter] = useState("");
  
  const filteredValues = values.filter(value => 
    value.toLowerCase().includes(searchFilter.toLowerCase())
  );
  
  // For Excel-style filtering: if not initialized, all values are considered selected
  const effectiveSelectedValues = isInitialized ? selectedValues : values;
  
  const handleSelectAll = () => {
    onSelectionChange(values);
  };
  
  const handleClearAll = () => {
    onSelectionChange([]);
  };
  
  const handleValueToggle = (value: string) => {
    // Initialize with all values if this is the first interaction
    if (!isInitialized) {
      // Remove the clicked value from all values
      onSelectionChange(values.filter(v => v !== value));
    } else {
      if (selectedValues.includes(value)) {
        onSelectionChange(selectedValues.filter(v => v !== value));
      } else {
        onSelectionChange([...selectedValues, value]);
      }
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost" 
          size="sm"
          className={`h-6 w-6 p-0 ${isActive ? 'bg-primary/10 text-primary' : ''}`}
          data-testid={`filter-${title.toLowerCase().replace(' ', '-')}`}
        >
          <Filter className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Filter {title}</h4>
            {isActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          <Input
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="h-8 text-xs mb-3"
          />
          
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="h-7 px-2 text-xs flex-1"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="h-7 px-2 text-xs flex-1"
            >
              Clear All
            </Button>
          </div>
          
          <Separator className="mb-2" />
          
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredValues.map((value) => (
              <div key={value} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded">
                <Checkbox
                  id={`${title}-${value}`}
                  checked={effectiveSelectedValues.includes(value)}
                  onCheckedChange={(checked) => {
                    console.log(`Filter ${title} - ${value}: ${checked}`);
                    handleValueToggle(value);
                  }}
                  className="h-4 w-4"
                />
                <label
                  htmlFor={`${title}-${value}`}
                  className="text-xs cursor-pointer flex-1 truncate"
                  title={value}
                >
                  {value}
                </label>
              </div>
            ))}
            {filteredValues.length === 0 && (
              <div className="text-xs text-muted-foreground p-2 text-center">
                No items found
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Attestations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegistry, setSelectedRegistry] = useState<string>("all");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  
  // Column filters state - initialize with all values (Excel-style: all items checked initially)
  const [columnFilters, setColumnFilters] = useState({
    packageName: [] as string[],
    version: [] as string[],
    status: [] as string[],
    maintainer: [] as string[],
    publishedDateRange: null as { start: Date | null; end: Date | null } | null,
  });
  
  // Track if filters have been initialized (to distinguish between "not initialized" and "empty selection")
  const [filtersInitialized, setFiltersInitialized] = useState({
    packageName: false,
    version: false,
    status: false,
    maintainer: false,
  });
  
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

  // Extract unique values for column filters
  const uniqueValues = useMemo(() => {
    const packageNames = new Set<string>();
    const versions = new Set<string>();
    const statuses = new Set<string>();
    const maintainers = new Set<string>();
    
    groupedPackages.forEach(group => {
      packageNames.add(group.packageName);
      group.versions.forEach(version => {
        versions.add(version.version);
        statuses.add(version.attestationStatus);
        version.maintainers.forEach(maintainer => maintainers.add(maintainer));
      });
    });
    
    return {
      packageNames: Array.from(packageNames).sort(),
      versions: Array.from(versions).sort(),
      statuses: Array.from(statuses).sort(),
      maintainers: Array.from(maintainers).sort()
    };
  }, [groupedPackages]);

  // Apply filtering to groups
  const filteredGroups = useMemo(() => {
    return groupedPackages.filter((group: PackageGroup) => {
      // Search term filter
      const matchesSearch = 
        group.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.maintainers.some(maintainer => maintainer.toLowerCase().includes(searchTerm.toLowerCase())) ||
        group.versions.some(version => 
          version.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          version.version.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesRegistry = selectedRegistry === "all" || group.registry === selectedRegistry;
      
      // Excel-style column filters:
      // - Not initialized = show all (user hasn't interacted with filter yet)
      // - Initialized but empty = show none (user unchecked all items)
      // - Initialized with items = show only those items
      const matchesPackageName = !filtersInitialized.packageName || 
        columnFilters.packageName.includes(group.packageName);
      
      const matchesVersion = !filtersInitialized.version ||
        group.versions.some(version => columnFilters.version.includes(version.version));
      
      const matchesStatus = !filtersInitialized.status ||
        group.versions.some(version => columnFilters.status.includes(version.attestationStatus));
      
      const matchesMaintainer = !filtersInitialized.maintainer ||
        group.versions.some(version => 
          version.maintainers.some(maintainer => columnFilters.maintainer.includes(maintainer))
        );
      
      console.log('Filtering group:', group.packageName, {
        matchesPackageName,
        packageNameFilter: columnFilters.packageName,
        matchesSearch,
        matchesRegistry
      });
      
      return matchesSearch && matchesRegistry && matchesPackageName && 
             matchesVersion && matchesStatus && matchesMaintainer;
    });
  }, [groupedPackages, searchTerm, selectedRegistry, columnFilters, filtersInitialized]);

  // Reset expanded group when filters change
  useEffect(() => {
    setExpandedGroup(null);
  }, [searchTerm, selectedRegistry, columnFilters]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroup(expandedGroup === groupKey ? null : groupKey);
  };

  // Column filter handlers
  const handleColumnFilterChange = (column: keyof typeof columnFilters, values: string[]) => {
    console.log(`Column filter change: ${column}`, values);
    
    // Mark this filter as initialized when user first interacts with it
    setFiltersInitialized(prev => ({
      ...prev,
      [column]: true
    }));
    
    setColumnFilters(prev => {
      const newFilters = {
        ...prev,
        [column]: values
      };
      console.log('New column filters:', newFilters);
      return newFilters;
    });
  };

  // Check if any column filters are active (properly accounting for initialization state)
  const hasActiveFilters = (
    (filtersInitialized.packageName && columnFilters.packageName.length !== uniqueValues.packageNames.length) ||
    (filtersInitialized.version && columnFilters.version.length !== uniqueValues.versions.length) ||
    (filtersInitialized.status && columnFilters.status.length !== uniqueValues.statuses.length) ||
    (filtersInitialized.maintainer && columnFilters.maintainer.length !== uniqueValues.maintainers.length)
  );

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
          
          {/* Clear All Filters */}
          {hasActiveFilters && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setColumnFilters({
                    packageName: [],
                    version: [],
                    status: [],
                    maintainer: [],
                    publishedDateRange: null,
                  });
                  // Reset initialization state to show all items again
                  setFiltersInitialized({
                    packageName: false,
                    version: false,
                    status: false,
                    maintainer: false,
                  });
                }}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-clear-all-filters"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Column Filters
              </Button>
            </div>
          )}
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

        {/* Summary Stats */}
        {!isLoading && !error && filteredGroups.length > 0 && (
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      <TableHead className="w-[200px]">
                        <div className="flex items-center gap-2">
                          <span>Package Name</span>
                          <FilterDropdown
                            title="Package Name"
                            values={uniqueValues.packageNames}
                            selectedValues={columnFilters.packageName}
                            onSelectionChange={(values) => handleColumnFilterChange('packageName', values)}
                            isActive={filtersInitialized.packageName && columnFilters.packageName.length !== uniqueValues.packageNames.length}
                            isInitialized={filtersInitialized.packageName}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px]">
                        <div className="flex items-center gap-2">
                          <span>Version</span>
                          <FilterDropdown
                            title="Version"
                            values={uniqueValues.versions}
                            selectedValues={columnFilters.version}
                            onSelectionChange={(values) => handleColumnFilterChange('version', values)}
                            isActive={filtersInitialized.version && columnFilters.version.length !== uniqueValues.versions.length}
                            isInitialized={filtersInitialized.version}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="w-[100px]">Registry</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center gap-2">
                          <span>Status</span>
                          <FilterDropdown
                            title="Status"
                            values={uniqueValues.statuses}
                            selectedValues={columnFilters.status}
                            onSelectionChange={(values) => handleColumnFilterChange('status', values)}
                            isActive={filtersInitialized.status && columnFilters.status.length !== uniqueValues.statuses.length}
                            isInitialized={filtersInitialized.status}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="w-[300px]">Description</TableHead>
                      <TableHead className="w-[120px]">Published</TableHead>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center gap-2">
                          <span>Maintainer</span>
                          <FilterDropdown
                            title="Maintainer"
                            values={uniqueValues.maintainers}
                            selectedValues={columnFilters.maintainer}
                            onSelectionChange={(values) => handleColumnFilterChange('maintainer', values)}
                            isActive={filtersInitialized.maintainer && columnFilters.maintainer.length !== uniqueValues.maintainers.length}
                            isInitialized={filtersInitialized.maintainer}
                          />
                        </div>
                      </TableHead>
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
                                <span className="text-xs">└ {version.version}</span>
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

      </div>
    </div>
  );
}