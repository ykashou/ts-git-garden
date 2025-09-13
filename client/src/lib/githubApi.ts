// GitHub API integration for fetching repository data
import { Project } from "@shared/schema";

// Types for 3D Knowledge Graph
export interface GraphNode {
  id: string;
  name: string;
  val: number; // Size of the node
  color: string;
  type: 'repository' | 'topic' | 'technology' | 'status' | 'year';
  description?: string;
  url?: string;
  group?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number; // Link strength
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export type GroupingMode = 'topic' | 'status' | 'year' | 'technology';

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url: string;
  topics: string[];
  updated_at: string;
  created_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  fork: boolean;
  private: boolean;
}

export interface GitHubLanguages {
  [language: string]: number;
}

const GITHUB_API_BASE = 'https://api.github.com';

// Helper to determine project maturity based on various factors
const determineProjectStatus = (repo: GitHubRepo, languages: string[]): "blooming" | "growing" | "mature" => {
  const daysSinceCreation = (Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24);
  const daysSinceLastUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  
  // Consider it mature if:
  // - Has multiple languages, stars, or homepage
  // - Older than 6 months with recent activity
  if (
    (languages.length > 2 && repo.stargazers_count > 2) ||
    repo.homepage ||
    (daysSinceCreation > 180 && daysSinceLastUpdate < 30)
  ) {
    return "mature";
  }
  
  // Consider it growing if:
  // - Has some activity and is not too old
  if (daysSinceCreation > 30 && daysSinceCreation < 180) {
    return "growing";
  }
  
  // Otherwise it's blooming (new or actively developed)
  return "blooming";
};

// Format date for display
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Fetch languages for a repository
const fetchRepoLanguages = async (languagesUrl: string, token: string): Promise<string[]> => {
  try {
    const response = await fetch(languagesUrl, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) return [];
    
    const languages: GitHubLanguages = await response.json();
    return Object.keys(languages).slice(0, 5); // Limit to top 5 languages
  } catch (error) {
    console.warn('Failed to fetch languages:', error);
    return [];
  }
};

// Transform GitHub repo to Project format
const transformRepoToProject = async (repo: GitHubRepo, token: string): Promise<Project> => {
  const languages = await fetchRepoLanguages(repo.languages_url, token);
  
  return {
    id: repo.id.toString(),
    title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: repo.description || 'A GitHub repository project',
    technologies: languages.length > 0 ? languages : [repo.language || 'Code'].filter(Boolean),
    topics: repo.topics || [],
    githubUrl: repo.html_url,
    liveUrl: repo.homepage || undefined,
    status: determineProjectStatus(repo, languages),
    lastUpdated: formatDate(repo.updated_at),
    createdAt: formatDate(repo.created_at),
  };
};

// Fetch user's public repositories
export const fetchGitHubProjects = async (username: string, token: string): Promise<Project[]> => {
  try {
    console.log(`Fetching repositories for user: ${username}`);
    
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?type=owner&sort=updated&per_page=20`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const repos: GitHubRepo[] = await response.json();
    
    // Filter out forks and archived repos, focus on meaningful projects
    const activeRepos = repos.filter(repo => 
      !repo.fork && 
      !repo.archived && 
      !repo.private &&
      repo.name !== username // Exclude profile README repo
    );
    
    console.log(`Found ${activeRepos.length} active repositories`);
    
    // Transform repos to project format (with rate limiting consideration)
    const projects = await Promise.all(
      activeRepos.slice(0, 12).map(repo => transformRepoToProject(repo, token))
    );
    
    return projects;
  } catch (error) {
    console.error('Failed to fetch GitHub projects:', error);
    throw error;
  }
};

// Get GitHub username from the API (useful if not sure about the username)
export const getGitHubUser = async (token: string): Promise<{ login: string; name: string | null }> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const user = await response.json();
    return { login: user.login, name: user.name };
  } catch (error) {
    console.error('Failed to fetch GitHub user:', error);
    throw error;
  }
};


// Generate color based on node type and content
const getNodeColor = (type: GraphNode['type'], name: string, group?: string): string => {
  switch (type) {
    case 'repository':
      // Blue for development, Green for research
      return group === 'research' ? '#10b981' : '#3b82f6'; // emerald-500 : blue-500
    case 'topic':
      return '#8b5cf6'; // violet-500
    case 'technology':
      return '#f59e0b'; // amber-500
    case 'status':
      return '#ef4444'; // red-500
    case 'year':
      return '#6366f1'; // indigo-500
    default:
      return '#6b7280'; // gray-500
  }
};

// Create knowledge graph data from projects
export const createKnowledgeGraph = (
  projects: Project[], 
  grouping: GroupingMode = 'topic',
  researchOnly: boolean = false
): KnowledgeGraphData => {
  // Filter projects if research only mode
  const filteredProjects = researchOnly 
    ? projects.filter(project => {
        // Simulate classification since we don't have raw repo data here
        const text = `${project.title} ${project.description} ${project.topics.join(' ')}`.toLowerCase();
        const researchKeywords = ['research', 'thesis', 'theory', 'article', 'paper', 'study', 'analysis'];
        return researchKeywords.some(keyword => text.includes(keyword));
      })
    : projects;

  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeIds = new Set<string>();

  // Create repository nodes
  filteredProjects.forEach(project => {
    const repoNodeId = `repo_${project.id}`;
    
    if (!nodeIds.has(repoNodeId)) {
      const repoType = classifyRepositoryFromProject(project);
      nodes.push({
        id: repoNodeId,
        name: project.title,
        val: 8 + (project.technologies.length * 2), // Size based on technologies
        color: getNodeColor('repository', project.title, repoType),
        type: 'repository',
        description: project.description,
        url: project.githubUrl || project.liveUrl,
        group: repoType
      });
      nodeIds.add(repoNodeId);
    }

    // Create group nodes and links based on grouping mode
    let groupItems: string[] = [];
    let groupType: GraphNode['type'] = 'topic';

    switch (grouping) {
      case 'topic':
        groupItems = project.topics?.length > 0 ? project.topics : project.technologies || [];
        groupType = 'topic';
        break;
      case 'technology':
        groupItems = project.technologies || [];
        groupType = 'technology';
        break;
      case 'status':
        // Provide fallback for missing status values
        const status = project.status || 'unknown';
        groupItems = [status];
        groupType = 'status';
        break;
      case 'year':
        // Check if createdAt exists, use lastUpdated as fallback, skip if both missing
        let yearString: string | null = null;
        if (project.createdAt) {
          const year = new Date(project.createdAt).getFullYear();
          if (!isNaN(year)) {
            yearString = year.toString();
          }
        }
        if (!yearString && project.lastUpdated) {
          const year = new Date(project.lastUpdated).getFullYear();
          if (!isNaN(year)) {
            yearString = year.toString();
          }
        }
        // Use current year as ultimate fallback
        if (!yearString) {
          yearString = new Date().getFullYear().toString();
        }
        groupItems = [yearString];
        groupType = 'year';
        break;
    }

    // Create group nodes and links - filter out undefined/empty items
    groupItems.filter(item => item && typeof item === 'string' && item.trim().length > 0).forEach(item => {
      const sanitizedItem = item.trim();
      const groupNodeId = `${grouping}_${sanitizedItem}`;
      
      if (!nodeIds.has(groupNodeId)) {
        nodes.push({
          id: groupNodeId,
          name: sanitizedItem,
          val: 15, // Larger than repo nodes
          color: getNodeColor(groupType, sanitizedItem),
          type: groupType,
          description: `${groupType.charAt(0).toUpperCase() + groupType.slice(1)}: ${sanitizedItem}`
        });
        nodeIds.add(groupNodeId);
      }

      // Create link between repo and group
      links.push({
        source: repoNodeId,
        target: groupNodeId,
        value: 1
      });
    });
  });

  return { nodes, links };
};

// Helper function to classify project from Project type (since we don't have raw repo data)
const classifyRepositoryFromProject = (project: Project): 'research' | 'development' => {
  const researchKeywords = ['research', 'thesis', 'theory', 'article', 'paper', 'study', 'analysis', 'academic', 'science'];
  const text = `${project.title} ${project.description} ${project.topics.join(' ')}`.toLowerCase();
  
  const hasResearchKeywords = researchKeywords.some(keyword => text.includes(keyword));
  return hasResearchKeywords ? 'research' : 'development';
};

// Enhanced fetch function that also fetches repository details for classification
export const fetchGitHubProjectsWithDetails = async (username: string, token: string): Promise<{ projects: Project[], rawRepos: GitHubRepo[] }> => {
  try {
    console.log(`Fetching repositories for user: ${username}`);
    
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?type=owner&sort=updated&per_page=20`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const repos: GitHubRepo[] = await response.json();
    
    // Filter out forks and archived repos, focus on meaningful projects
    const activeRepos = repos.filter(repo => 
      !repo.fork && 
      !repo.archived && 
      !repo.private &&
      repo.name !== username // Exclude profile README repo
    );
    
    console.log(`Found ${activeRepos.length} active repositories`);
    
    // Transform repos to project format (with rate limiting consideration)
    const projects = await Promise.all(
      activeRepos.slice(0, 12).map(repo => transformRepoToProject(repo, token))
    );
    
    return { projects, rawRepos: activeRepos.slice(0, 12) };
  } catch (error) {
    console.error('Failed to fetch GitHub projects:', error);
    throw error;
  }
};