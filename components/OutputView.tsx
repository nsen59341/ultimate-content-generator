
import React, { useState, useEffect } from 'react';
import { Platform } from '../types';
import { persistenceService } from '../services/persistence';

interface OutputViewProps {
  platform: Platform;
  content: string;
  mediaUrl?: string;
  onReset: () => void;
  isMedia: boolean;
  isLoading: boolean;
  sourceTitle: string;
}

const REASSURING_MESSAGES = [
  "Our cinematic directors are rendering your scene...",
  "Applying professional color grading and physics realism...",
  "Orchestrating the perfect camera motion...",
  "Almost there, finalizing high-fidelity frames...",
  "Synthesizing background audio vibes..."
];

const OutputView: React.FC<OutputViewProps> = ({ platform, content, mediaUrl, onReset, isMedia, isLoading, sourceTitle }) => {
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archived, setArchived] = useState(false);

  useEffect(() => {
    if (isLoading && platform === Platform.Video) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % REASSURING_MESSAGES.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isLoading, platform]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert('Strategist content copied to clipboard.');
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    const success = await persistenceService.archiveAsset(sourceTitle, platform, content, mediaUrl);
    setIsArchiving(false);
    if (success) {
      setArchived(true);
      setTimeout(() => setArchived(false), 3000);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 pb-20">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px]">Premium Asset</span>
            <span className="text-slate-600 font-light">|</span>
            <span className="text-white font-medium text-sm">{platform}</span>
          </div>
          <div className="flex gap-3">
            {!isLoading && (
              <>
                <button 
                  onClick={handleArchive}
                  disabled={isArchiving || archived}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-xs font-bold uppercase tracking-wider border border-slate-700 ${
                    archived ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isArchiving ? (
                     <div className="w-3 h-3 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                  ) : archived ? (
                    'Archived'
                  ) : (
                    'Save to DB'
                  )}
                </button>
                {!isMedia && (
                  <button 
                    onClick={copyToClipboard}
                    className="group flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg transition-all duration-300 border border-slate-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <span className="text-xs font-bold uppercase tracking-wider">Copy</span>
                  </button>
                )}
              </>
            )}
            <button 
              onClick={onReset}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors uppercase tracking-widest border border-slate-700"
            >
              New Strategy
            </button>
          </div>
        </div>
        
        <div className="p-8 md:p-16 min-h-[450px] flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="relative w-20 h-20 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-white text-xl font-medium mb-3 tracking-tight">
                {platform === Platform.Video ? REASSURING_MESSAGES[loadingMessageIndex] : "Crafting your high-converting asset..."}
              </p>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                {platform === Platform.Video ? "Cinematic generation takes a moment. Perfection can't be rushed." : "Applying advanced platform-specific copywriting rules."}
              </p>
            </div>
          ) : (
            <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {isMedia ? (
                <div className="w-full">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    {platform === Platform.Image ? (
                      <img src={mediaUrl} alt="Generated asset" referrerPolicy="no-referrer" className="relative w-full rounded-2xl shadow-2xl border border-slate-800" />
                    ) : (
                      <video src={mediaUrl} controls autoPlay muted playsInline loop className="relative w-full rounded-2xl shadow-2xl border border-slate-800" />
                    )}
                  </div>
                  <div className="mt-10 p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <h4 className="text-[10px] text-indigo-400 uppercase tracking-[0.3em] mb-4 font-black">Strategist's Creative Direction</h4>
                    <p className="text-slate-300 text-lg italic leading-relaxed font-light">"{content}"</p>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-slate-800/20 p-8 md:p-12 rounded-3xl border border-slate-700/30">
                  <div className="prose prose-invert prose-indigo max-w-none whitespace-pre-wrap text-slate-200 text-xl leading-[1.8] font-normal tracking-tight">
                    {content}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OutputView;
