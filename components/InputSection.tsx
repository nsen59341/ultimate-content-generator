
import React, { useState } from 'react';

interface InputSectionProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
    }
  };

  return (
    <section className="max-w-4xl mx-auto py-16 px-6 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        Transform Content into <br/> Social Media Gold.
      </h2>
      <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
        Paste a YouTube URL, Blog link, or raw article text. Our AI agent extracts the core value and prepares it for multi-platform dominance.
      </p>
      
      <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
        <div className="relative flex flex-col md:flex-row gap-3">
          <input
            type="text"
            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all text-lg"
            placeholder="Paste URL or text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-white text-slate-900 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Analyze Content
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-medium uppercase tracking-widest text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> YouTube</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Blog Articles</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Raw Text</span>
      </div>
    </section>
  );
};

export default InputSection;
