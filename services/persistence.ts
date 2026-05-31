
import { Platform } from "../types";

const DB_KEY = process.env.SUBDATABASE_API_KEY;
const DB_ENDPOINT = process.env.SUBDATABASE_ENDPOINT;

export interface ArchiveEntry {
  id: string;
  title: string;
  platform: Platform;
  content: string;
  timestamp: number;
}

export const persistenceService = {
  async archiveAsset(title: string, platform: Platform, content: string): Promise<boolean> {
    console.log(`[Persistence] Archiving to subdatabase using key: ${DB_KEY?.slice(0, 4)}...`);
    
    // Simulate a database call
    return new Promise((resolve) => {
      setTimeout(() => {
        const history = JSON.parse(localStorage.getItem('repurposer_history') || '[]');
        history.push({
          id: Math.random().toString(36).substr(2, 9),
          title,
          platform,
          content,
          timestamp: Date.now()
        });
        localStorage.setItem('repurposer_history', JSON.stringify(history));
        resolve(true);
      }, 1000);
    });
  }
};
