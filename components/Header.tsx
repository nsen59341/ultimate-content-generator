
import React from 'react';

const Header: React.FC = () => {
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
      <div className="hidden md:flex items-center gap-4">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">Premium Strategist Agent</span>
      </div>
    </header>
  );
};

export default Header;
