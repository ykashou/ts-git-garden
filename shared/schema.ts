import { z } from "zod";

// Static site data types for local JSON files
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  githubUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  status: z.enum(["blooming", "growing", "mature"]).default("growing"),
  lastUpdated: z.string(),
  createdAt: z.string(),
});

export const ResearchPaperSchema = z.object({
  id: z.string(),
  title: z.string(),
  authors: z.array(z.string()),
  abstract: z.string(),
  journal: z.string().optional(),
  conference: z.string().optional(),
  year: z.number(),
  doi: z.string().optional(),
  pdfUrl: z.string().optional(),
  tags: z.array(z.string()),
  status: z.enum(["published", "preprint", "in-review"]).default("preprint"),
  createdAt: z.string(),
});

export const PortfolioConfigSchema = z.object({
  name: z.string().default("Digital Garden"),
  tagline: z.string().default("A place where ideas grow and projects bloom"),
  bio: z.string(),
  skills: z.array(z.string()),
  location: z.string().default("Based in the Cloud"),
  bitcoinAddress: z.string().optional(),
  githubUsername: z.string().optional(),
  email: z.string().optional(),
});

// Types
export type Project = z.infer<typeof ProjectSchema>;
export type ResearchPaper = z.infer<typeof ResearchPaperSchema>;
export type PortfolioConfig = z.infer<typeof PortfolioConfigSchema>;

// Insert types (same as regular types for static site)
export type InsertProject = Omit<Project, "id" | "createdAt" | "lastUpdated">;
export type InsertResearchPaper = Omit<ResearchPaper, "id" | "createdAt">;
