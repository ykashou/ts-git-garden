// Static data loader for GitHub Pages deployment
import { Project, ResearchPaper, PortfolioConfig } from "@shared/schema";

// Async data loaders for static JSON files
export const getConfig = async (): Promise<PortfolioConfig> => {
  try {
    const base = import.meta.env.BASE_URL || '';
    const response = await fetch(`${base}data/config.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load config:', error);
    // Return fallback config
    return {
      name: "Digital Garden",
      tagline: "A place where ideas grow, projects bloom, and knowledge is cultivated",
      bio: "I'm a passionate developer and researcher who believes in the power of open source and continuous learning.",
      skills: ["React", "TypeScript", "Python", "Node.js"],
      location: "Based in the Cloud",
      bitcoinAddress: "",
      githubUsername: "",
      email: ""
    };
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    // Try to fetch from GitHub API first (when available in development)
    try {
      const githubResponse = await fetch('/api/github/projects');
      if (githubResponse.ok) {
        const githubProjects = await githubResponse.json();
        console.log('Loaded projects from GitHub API:', githubProjects.length);
        return githubProjects;
      }
    } catch (githubError) {
      console.log('GitHub API not available, falling back to static data');
    }
    
    // Fallback to static JSON file (for GitHub Pages deployment)
    const base = import.meta.env.BASE_URL || '';
    const response = await fetch(`${base}data/projects.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const staticProjects = await response.json();
    console.log('Loaded projects from static data:', staticProjects.length);
    return staticProjects;
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
};

export const getPapers = async (): Promise<ResearchPaper[]> => {
  try {
    const base = import.meta.env.BASE_URL || '';
    const response = await fetch(`${base}data/papers.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load papers:', error);
    return [];
  }
};