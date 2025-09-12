// This file is not used for static GitHub Pages deployment
// Data management is handled client-side through DataManager in client/src/lib/dataManager.ts

// Keeping minimal structure for compatibility
export interface IStorage {
  // No server-side storage needed for static site
}

export class MemStorage implements IStorage {
  constructor() {
    // Static site - no server storage
  }
}

export const storage = new MemStorage();
