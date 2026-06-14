
import React from 'react';

interface HeaderProps {
  onViewHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ onViewHistory }) => {
  return (
    <header className="py-6 px-8 flex justify-between items-center border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Content <span className="text-indigo-400">Repurposer</span></h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onViewHistory}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 hover:border-slate-600 px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-200 transition-all active:scale-95 shadow-md shadow-slate-950/20"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          Saved DB Library
        </button>
        <span className="hidden md:inline-block text-xs font-medium text-slate-400 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">Premium Strategist Agent</span>
      </div>
    </header>
  );
};

export default Header;
