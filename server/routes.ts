import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { fetchGitHubProjects, getGitHubUser } from "../client/src/lib/githubApi";

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
  
  app.get("/data/projects.json", (req, res) => {
    try {
      const projectsPath = path.resolve(import.meta.dirname, "..", "public", "data", "projects.json");
      const projects = JSON.parse(fs.readFileSync(projectsPath, "utf-8"));
      res.json(projects);
    } catch (error) {
      console.error("Error loading projects:", error);
      res.status(404).json({ error: "Projects not found" });
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

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
