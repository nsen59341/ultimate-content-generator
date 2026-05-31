
import React from 'react';
import { Platform } from '../types';

interface PlatformSelectorProps {
  onSelect: (platform: Platform) => void;
  isGenerating: boolean;
}

const platforms = [
  { id: Platform.LinkedIn, icon: '💼', color: 'bg-blue-600' },
  { id: Platform.InstagramPost, icon: '📸', color: 'bg-pink-600' },
  { id: Platform.InstagramReel, icon: '🎬', color: 'bg-purple-600' },
  { id: Platform.Facebook, icon: '👥', color: 'bg-indigo-600' },
  { id: Platform.TweetThread, icon: '🐦', color: 'bg-sky-500' },
  { id: Platform.Email, icon: '📧', color: 'bg-orange-600' },
  { id: Platform.Image, icon: '🎨', color: 'bg-emerald-600' },
  { id: Platform.Video, icon: '🎞️', color: 'bg-rose-600' },
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ onSelect, isGenerating }) => {
  return (
    <section className="max-w-4xl mx-auto px-6 mb-20 text-center">
      <h3 className="text-2xl font-bold text-white mb-2">Which platform are we dominating today?</h3>
      <p className="text-slate-500 mb-8 uppercase tracking-widest text-xs font-semibold">Select your weapon</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {platforms.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            disabled={isGenerating}
            className="group relative bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300 disabled:opacity-50"
          >
            <div className={`w-12 h-12 ${p.color} rounded-xl flex items-center justify-center text-2xl mb-3 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
              {p.icon}
            </div>
            <span className="text-sm font-bold text-slate-300 group-hover:text-white">{p.id}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default PlatformSelector;
