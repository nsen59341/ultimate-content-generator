
import React from 'react';
import { ContentCardData } from '../types';

interface ContentCardProps {
  data: ContentCardData;
  impact: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ data, impact }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 mb-12">
      <div className="group relative bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-slate-700">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-80"></div>
        
        <div className="p-10 md:p-14 flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                data.type === 'YouTube' 
                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
              }`}>
                {data.type} Source
              </span>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold tracking-wide">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {data.duration || data.readTime}
              </div>
            </div>

            <h3 className="text-4xl font-extrabold text-white mb-6 leading-[1.15] tracking-tight group-hover:text-indigo-50 transition-colors">
              {data.title}
            </h3>
            
            <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light">
              {data.summary}
            </p>
            
            <div className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-indigo-500/30 rounded-full"></div>
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                The Big Idea
              </h4>
              <p className="text-xl text-slate-100 font-medium leading-relaxed italic">
                "{impact}"
              </p>
            </div>
          </div>
          
          <div className="md:w-72 flex flex-col justify-center items-center text-center p-8 bg-slate-800/40 rounded-[2rem] border border-slate-700/50 backdrop-blur-sm self-start">
             <div className="relative mb-6">
               <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
               <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
                 <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
             </div>
             <p className="text-white text-lg font-bold mb-2">Analysis Complete</p>
             <p className="text-slate-500 text-sm leading-relaxed font-medium px-4">Our premium extraction logic has successfully mapped the core narrative.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
