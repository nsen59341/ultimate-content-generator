import React from 'react';
import { HistoryItem, Platform } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onLoadItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  isOpen,
  onClose,
  onLoadItem,
  onDeleteItem
}) => {
  if (!isOpen) return null;

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case Platform.LinkedIn:
        return (
          <span key={platform} className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md text-[10px] uppercase font-bold tracking-wider" title="LinkedIn">
            In
          </span>
        );
      case Platform.InstagramPost:
        return (
          <span key={platform} className="px-2 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-md text-[10px] uppercase font-bold tracking-wider" title="IG Post">
            IG Post
          </span>
        );
      case Platform.InstagramReel:
        return (
          <span key={platform} className="px-2 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-md text-[10px] uppercase font-bold tracking-wider" title="IG Reel">
            Reel
          </span>
        );
      case Platform.Facebook:
        return (
          <span key={platform} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-md text-[10px] uppercase font-bold tracking-wider" title="Facebook">
            FB
          </span>
        );
      case Platform.TweetThread:
        return (
          <span key={platform} className="px-2 py-1 bg-slate-500/10 border border-slate-400/30 text-slate-300 rounded-md text-[10px] uppercase font-bold tracking-wider" title="X / Twitter Thread">
            X
          </span>
        );
      case Platform.Email:
        return (
          <span key={platform} className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-md text-[10px] uppercase font-bold tracking-wider" title="Email Newsletter">
            Mail
          </span>
        );
      case Platform.Image:
        return (
          <span key={platform} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md text-[10px] uppercase font-bold tracking-wider" title="Generated Image">
            IMG
          </span>
        );
      case Platform.Video:
        return (
          <span key={platform} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-md text-[10px] uppercase font-bold tracking-wider" title="Generated Video">
            VID
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="history-overlay-container">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        id="history-backdrop"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-out bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History Logs
              </h2>
              <p className="text-xs text-slate-400 mt-1">Access your saved content and social strategies</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 px-3 self-center bg-slate-800 hover:bg-slate-700/80 rounded-lg text-slate-400 hover:text-white transition-all text-xs"
              id="history-close-btn"
            >
              Close
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/40">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2M9 5h6" />
                  </svg>
                </div>
                <h3 className="text-slate-300 font-medium mb-1">No conversion logs found</h3>
                <p className="text-slate-500 text-xs px-4">Analyze a blog link or video to form your workspace database strategy.</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 hover:border-slate-700/60 transition-all rounded-xl p-4 flex flex-col justify-between group"
                  id={`history-card-${item.id}`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        item.cardData.type === 'YouTube' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.cardData.type}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm line-clamp-1 text-slate-200 group-hover:text-white transition-colors">
                      {item.cardData.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 italic">
                      &ldquo;{item.cardData.summary}&rdquo;
                    </p>

                    {item.generations && item.generations.length > 0 && (
                      <div className="mt-3">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5">Conversions Generated</span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.generations.map((gen) => getPlatformIcon(gen.platform))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800/80">
                    <button 
                      onClick={() => onLoadItem(item)}
                      className="flex-1 bg-white hover:bg-indigo-50 text-slate-900 text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5"
                      id={`load-btn-${item.id}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Load Session
                    </button>
                    <button 
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-950/40 hover:border-red-900/45 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                      title="Delete log"
                      id={`delete-btn-${item.id}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-800 p-4 bg-slate-950/40 text-[10px] text-center text-slate-500">
            Backed up securely using dynamic server file-sync.
          </div>

        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
