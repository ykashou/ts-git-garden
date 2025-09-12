import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

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

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
