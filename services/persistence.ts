
import { Platform } from "../types";

const DB_KEY = process.env.SUBDATABASE_API_KEY;
const DB_ENDPOINT = process.env.SUBDATABASE_ENDPOINT;

export interface ArchiveEntry {
  id: string;
  title: string;
  platform: Platform;
  content: string;
  timestamp: number;
  mediaUrl?: string;
}

export const persistenceService = {
  async archiveAsset(title: string, platform: Platform, content: string, mediaUrl?: string): Promise<boolean> {
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
          mediaUrl,
          timestamp: Date.now()
        });
        localStorage.setItem('repurposer_history', JSON.stringify(history));
        resolve(true);
      }, 1000);
    });
  },

  getHistory(): ArchiveEntry[] {
    try {
      const data = localStorage.getItem('repurposer_history');
      if (!data) return [];
      const history = JSON.parse(data);
      if (!Array.isArray(history)) return [];
      
      const sanitized: ArchiveEntry[] = [];
      history.forEach((entry, idx) => {
        if (entry && typeof entry === 'object') {
          const title = (entry.title || '').trim();
          const content = (entry.content || '').trim();
          
          // Only include if both title and content are actually present and not empty placeholder texts
          if (title && content && content !== 'No content written' && title !== 'Untitled Archive') {
            sanitized.push({
              id: entry.id || `entry-${idx}-${Math.random().toString(36).substr(2, 4)}`,
              title: title,
              platform: entry.platform || Platform.LinkedIn,
              content: content,
              timestamp: typeof entry.timestamp === 'number' ? entry.timestamp : Date.now(),
              mediaUrl: entry.mediaUrl || undefined
            });
          }
        }
      });

      // Sort by latest first
      return sanitized.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
      console.error("Error reading history", e);
      return [];
    }
  },

  deleteHistoryEntry(id: string): boolean {
    try {
      const history = this.getHistory();
      const updated = history.filter(entry => entry.id !== id);
      localStorage.setItem('repurposer_history', JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error("Error deleting history entry", e);
      return false;
    }
  }
};
