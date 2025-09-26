import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { fetchGitHubProjects, getGitHubUser } from "../client/src/lib/githubApi";
import { PackageAttestation } from "../shared/schema";

// Helper function to fetch package data from npm registry
async function fetchNpmPackages(username: string): Promise<PackageAttestation[]> {
  try {
    const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=maintainer:${username}&size=100`);
    if (!response.ok) return [];
    
    const data = await response.json();
    const packages: PackageAttestation[] = [];
    
    for (const pkg of data.objects || []) {
      try {
        // Fetch package details for latest version
        const detailResponse = await fetch(`https://registry.npmjs.org/${pkg.package.name}`);
        if (!detailResponse.ok) continue;
        
        const detail = await detailResponse.json();
        const latestVersion = detail['dist-tags']?.latest;
        
        if (!latestVersion) continue;
        
        // Check for npm attestations (SLSA provenance)
        const attestationStatus = await checkNpmAttestation(pkg.package.name, latestVersion);
        
        packages.push({
          id: `npm-${pkg.package.name}-${latestVersion}`,
          packageName: pkg.package.name,
          version: latestVersion,
          registry: "npm",
          publishedAt: detail.time?.[latestVersion] || new Date().toISOString(),
          attestationStatus: attestationStatus.status,
          attestationUrl: attestationStatus.url,
          attestationDetails: attestationStatus.details,
          packageUrl: `https://www.npmjs.com/package/${pkg.package.name}`,
          downloadCount: pkg.package.date ? undefined : pkg.searchScore, // Approximate
          description: pkg.package.description,
          license: detail.versions?.[latestVersion]?.license,
          maintainers: (detail.maintainers || []).map((m: any) => m.name || m)
        });
      } catch (err) {
        console.warn(`Error processing npm package ${pkg.package.name}:`, err);
      }
    }
    
    return packages;
  } catch (error) {
    console.error("Error fetching npm packages:", error);
    return [];
  }
}

// Helper function to check npm package attestations
async function checkNpmAttestation(packageName: string, version: string) {
  try {
    // Try to fetch npm attestation data
    const response = await fetch(`https://registry.npmjs.org/-/npm/v1/attestations/${packageName}@${version}`);
    
    if (response.ok) {
      const attestationData = await response.json();
      return {
        status: "verified" as const,
        url: `https://www.npmjs.com/package/${packageName}/v/${version}#attestations`,
        details: {
          issuer: attestationData.attestations?.[0]?.bundle?.payload?.subject?.[0]?.name,
          subject: `${packageName}@${version}`,
          predicate: {
            type: "https://slsa.dev/provenance/v0.2",
          },
          verificationTimestamp: new Date().toISOString()
        }
      };
    }
    
    return {
      status: "unverified" as const,
      url: undefined,
      details: undefined
    };
  } catch (error) {
    return {
      status: "error" as const,
      url: undefined,
      details: undefined
    };
  }
}

// Helper function to fetch package data from PyPI
async function fetchPyPiPackages(username: string): Promise<PackageAttestation[]> {
  try {
    // PyPI doesn't have a direct maintainer search API, so we'll search for packages with the username in the name
    const response = await fetch(`https://pypi.org/search/?q=${username}&o=&c=`);
    if (!response.ok) return [];
    
    // Since PyPI search returns HTML, we'll use a simple approach and check common Python package patterns
    // For a real implementation, you might want to scrape the user's PyPI profile or cross-reference with GitHub
    
    // Alternative approach: Check if the user has Python repositories on GitHub that might be published to PyPI
    const packages: PackageAttestation[] = [];
    
    // This is a basic implementation - in production you'd want a more robust way to discover PyPI packages
    const commonPythonPackages = [`${username}`, `python-${username}`, `${username}-py`];
    
    for (const packageName of commonPythonPackages) {
      try {
        const packageResponse = await fetch(`https://pypi.org/pypi/${packageName}/json`);
        if (packageResponse.ok) {
          const packageData = await packageResponse.json();
          const latestVersion = packageData.info.version;
          
          packages.push({
            id: `pypi-${packageName}-${latestVersion}`,
            packageName: packageName,
            version: latestVersion,
            registry: "pypi",
            publishedAt: new Date().toISOString(), // PyPI API doesn't provide upload date in this endpoint
            attestationStatus: "unverified", // PyPI doesn't have built-in attestations yet
            attestationUrl: undefined,
            attestationDetails: undefined,
            packageUrl: `https://pypi.org/project/${packageName}/`,
            description: packageData.info.summary,
            license: packageData.info.license,
            maintainers: packageData.info.author ? [packageData.info.author] : []
          });
        }
      } catch (err) {
        // Package doesn't exist, continue
      }
    }
    
    console.log(`Found ${packages.length} PyPI packages for ${username}`);
    return packages;
  } catch (error) {
    console.error("Error fetching PyPI packages:", error);
    return [];
  }
}

// Helper function to fetch packages from GitHub and check if they have releases/packages
async function fetchGitHubPackages(username: string): Promise<PackageAttestation[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return [];
    
    // Fetch repositories that might have packages
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) return [];
    
    const repos = await response.json();
    const packages: PackageAttestation[] = [];
    
    for (const repo of repos) {
      try {
        // Check if repo has releases
        const releasesResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/releases`, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });
        
        if (releasesResponse.ok) {
          const releases = await releasesResponse.json();
          
          if (releases.length > 0) {
            const latestRelease = releases[0];
            
            // Check for GitHub attestations
            const attestationStatus = await checkGitHubAttestation(username, repo.name, latestRelease.tag_name);
            
            packages.push({
              id: `github-${repo.name}-${latestRelease.tag_name}`,
              packageName: repo.name,
              version: latestRelease.tag_name,
              registry: "github",
              publishedAt: latestRelease.published_at || repo.updated_at,
              attestationStatus: attestationStatus.status,
              attestationUrl: attestationStatus.url,
              attestationDetails: attestationStatus.details,
              packageUrl: repo.html_url,
              description: repo.description,
              license: repo.license?.name,
              maintainers: [repo.owner.login]
            });
          }
        }
      } catch (err) {
        console.warn(`Error processing GitHub repo ${repo.name}:`, err);
      }
    }
    
    return packages;
  } catch (error) {
    console.error("Error fetching GitHub packages:", error);
    return [];
  }
}

// Helper function to check GitHub package attestations
async function checkGitHubAttestation(owner: string, repo: string, version: string) {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return { status: "error" as const, url: undefined, details: undefined };
    }
    
    // Check for GitHub attestations API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/attestations`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (response.ok) {
      const attestations = await response.json();
      
      if (attestations.length > 0) {
        return {
          status: "verified" as const,
          url: `https://github.com/${owner}/${repo}/attestations`,
          details: {
            issuer: "GitHub",
            subject: `${owner}/${repo}@${version}`,
            predicate: {
              type: "https://slsa.dev/provenance/v1",
            },
            verificationTimestamp: new Date().toISOString()
          }
        };
      }
    }
    
    return {
      status: "unverified" as const,
      url: undefined,
      details: undefined
    };
  } catch (error) {
    return {
      status: "error" as const,
      url: undefined,
      details: undefined
    };
  }
}

// Main function to fetch all package attestations
async function fetchAllPackageAttestations(username: string): Promise<PackageAttestation[]> {
  try {
    console.log(`Fetching packages from all registries for user: ${username}`);
    
    // Fetch packages from all registries in parallel
    const [npmPackages, pypiPackages, githubPackages] = await Promise.all([
      fetchNpmPackages(username),
      fetchPyPiPackages(username),
      fetchGitHubPackages(username)
    ]);
    
    // Combine all packages
    const allPackages = [...npmPackages, ...pypiPackages, ...githubPackages];
    
    // Sort by published date (newest first)
    allPackages.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    console.log(`Found ${allPackages.length} packages total (npm: ${npmPackages.length}, pypi: ${pypiPackages.length}, github: ${githubPackages.length})`);
    
    return allPackages;
  } catch (error) {
    console.error("Error in fetchAllPackageAttestations:", error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Static data endpoints for GitHub Pages compatibility
  app.get("/data/config.json", (req, res) => {
    try {
      const configPath = path.resolve(import.meta.dirname, "..", "public", "data", "config.json");
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      res.json(config);
    } catch (error) {
      console.error("Error loading config:", error);
      res.status(404).json({ error: "Config not found" });
    }
  });
  
  
  app.get("/data/papers.json", (req, res) => {
    try {
      const papersPath = path.resolve(import.meta.dirname, "..", "public", "data", "papers.json");
      const papers = JSON.parse(fs.readFileSync(papersPath, "utf-8"));
      res.json(papers);
    } catch (error) {
      console.error("Error loading papers:", error);
      res.status(404).json({ error: "Papers not found" });
    }
  });

  // GitHub API integration routes
  app.get("/api/github/projects", async (req, res) => {
    try {
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        return res.status(500).json({ error: "GitHub token not configured" });
      }

      // Get username from config
      const configPath = path.resolve(import.meta.dirname, "..", "public", "data", "config.json");
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const username = config.githubUsername;
      
      if (!username) {
        return res.status(500).json({ error: "GitHub username not configured in config.json" });
      }

      console.log(`Fetching GitHub projects for user: ${username}`);
      const projects = await fetchGitHubProjects(username, token);
      
      res.json(projects);
    } catch (error) {
      console.error("Error fetching GitHub projects:", error);
      res.status(500).json({ 
        error: "Failed to fetch GitHub projects",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/github/user", async (req, res) => {
    try {
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        return res.status(500).json({ error: "GitHub token not configured" });
      }

      const user = await getGitHubUser(token);
      res.json(user);
    } catch (error) {
      console.error("Error fetching GitHub user:", error);
      res.status(500).json({ 
        error: "Failed to fetch GitHub user",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Package attestation endpoints
  app.get("/api/packages/attestations", async (req, res) => {
    try {
      // Get username from config
      const configPath = path.resolve(import.meta.dirname, "..", "public", "data", "config.json");
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const username = config.githubUsername;
      
      if (!username) {
        return res.status(500).json({ error: "GitHub username not configured in config.json" });
      }

      console.log(`Fetching package attestations for user: ${username}`);
      const packages = await fetchAllPackageAttestations(username);
      
      res.json(packages);
    } catch (error) {
      console.error("Error fetching package attestations:", error);
      res.status(500).json({ 
        error: "Failed to fetch package attestations",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Health check endpoint for Replit platform monitoring
  app.get("/api", (req, res) => {
    res.status(200).json({ status: "healthy" });
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
