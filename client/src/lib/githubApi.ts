// GitHub API integration for fetching repository data
import { Project } from "@shared/schema";

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