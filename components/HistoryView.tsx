import React, { useState, useEffect } from 'react';
import { persistenceService, ArchiveEntry } from '../services/persistence';
import { Platform } from '../types';

interface HistoryViewProps {
  onClose: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onClose }) => {
  const [history, setHistory] = useState<ArchiveEntry[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = persistenceService.getHistory();
    setHistory(data);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this strategist asset from the database?')) {
      persistenceService.deleteHistoryEntry(id);
      loadHistory();
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Content copied to clipboard!');
  };

  const filteredHistory = history.filter((entry) => {
    if (!entry) return false;
    const titleVal = entry.title || '';
    const contentVal = entry.content || '';
    const matchesSearch =
      titleVal.toLowerCase().includes(search.toLowerCase()) ||
      contentVal.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || entry.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case Platform.LinkedIn: return '💼';
      case Platform.InstagramPost: return '📸';
      case Platform.InstagramReel: return '🎬';
      case Platform.Facebook: return '👥';
      case Platform.TweetThread: return '🐦';
      case Platform.Email: return '✉️';
      case Platform.Image: return '🎨';
      case Platform.Video: return '🎥';
      default: return '📄';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div id="history-container" className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-850 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Saved Assets Library</h2>
              <p className="text-xs text-slate-400">View and manage history archived securely in your database</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Region */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 bg-slate-950/20">
          
          {/* Left panel - Archives Grid */}
          <div className="w-full md:w-[40%] flex flex-col border-r border-slate-850 p-6 overflow-hidden">
            
            {/* Filter controls */}
            <div className="space-y-3 mb-4">
              <input 
                type="text"
                placeholder="Search database entries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="all">All Platforms</option>
                {Object.values(Platform).map((plat) => (
                  <option key={plat} value={plat}>{plat}</option>
                ))}
              </select>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                  <span className="text-4xl mb-3">📁</span>
                  <p className="text-slate-400 text-sm font-medium">No archived assets found</p>
                  <p className="text-slate-500 text-xs px-6 mt-1">Generate social assets or copy instructions and click "Save to DB" to archive them here.</p>
                </div>
              ) : (
                filteredHistory.map((entry) => (
                  <div 
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className={`p-4 border rounded-xl cursor-pointer text-left transition-all duration-300 relative group overflow-hidden ${
                      selectedEntry?.id === entry.id 
                        ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/5' 
                        : 'bg-slate-900/50 hover:bg-slate-800/50 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPlatformIcon(entry.platform)}</span>
                        <span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">
                          {entry.platform}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 className="text-white text-sm font-bold tracking-tight line-clamp-1 mb-1">
                      {entry.title}
                    </h3>
                    
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {entry.content}
                    </p>

                    <button 
                      onClick={(e) => handleDelete(entry.id, e)}
                      className="absolute bottom-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-950/40 rounded-md border border-slate-800/50"
                      title="Delete Entry"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v1a3 3 0 003 3h10M9 3h6" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right panel - Detail Preview */}
          <div className="flex-1 flex flex-col p-6 overflow-hidden min-w-0 bg-slate-950/45">
            {selectedEntry ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getPlatformIcon(selectedEntry.platform)}</span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                        {selectedEntry.platform}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">{selectedEntry.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => copyToClipboard(selectedEntry.content)}
                      className="bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      Copy
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                  {selectedEntry.mediaUrl && (
                    <div className="max-w-md mx-auto relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-2xl blur opacity-15 group-hover:opacity-30 transition"></div>
                      {selectedEntry.platform === Platform.Image ? (
                        <img 
                          src={selectedEntry.mediaUrl} 
                          alt="Saved visual" 
                          referrerPolicy="no-referrer"
                          className="relative w-full rounded-2xl shadow-xl border border-slate-800 max-h-[250px] object-cover" 
                        />
                      ) : (
                        <video 
                          src={selectedEntry.mediaUrl} 
                          controls 
                          muted 
                          playsInline 
                          loop 
                          className="relative w-full rounded-2xl shadow-xl border border-slate-800 max-h-[250px] object-cover" 
                        />
                      )}
                    </div>
                  )}

                  <div className="bg-slate-900/60 border border-slate-850 p-6 md:p-8 rounded-2xl">
                    <h4 className="text-[10px] text-indigo-400 uppercase tracking-[0.25em] mb-4 font-black">
                      {selectedEntry.mediaUrl ? "Saved Creative Prompt / Directive" : "Repurposed Content"}
                    </h4>
                    <p className="text-slate-200 text-base md:text-lg leading-[1.8] whitespace-pre-wrap font-normal selection:bg-indigo-600">
                      {selectedEntry.content}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 shadow-inner mb-4">
                  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm font-medium">Select an asset from the list to preview</p>
                <p className="text-slate-500 text-xs mt-1">Review the fully generated platform content, prompts, or media backdrops.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default HistoryView;
