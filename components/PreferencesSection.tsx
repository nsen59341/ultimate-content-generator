import React from 'react';
import { UserPreferences } from '../types';

interface PreferencesSectionProps {
  preferences: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
}

const AUDIENCE_SUGGESTIONS = [
  'Tech Professionals',
  'Founders & Investors',
  'Marketing Generalists',
  'Student Learners',
  'General Public'
];

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ preferences, onChange }) => {
  const handleUpdate = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    onChange({
      ...preferences,
      [key]: value
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="relative bg-slate-900 border border-slate-800/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all duration-500 hover:border-slate-700/80">
        <div className="absolute top-0 right-12 w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-65"></div>
        
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                Agent Customization
              </span>
              <span className="text-slate-600 font-light">|</span>
              <span className="text-slate-400 text-xs">Aesthetic & Professional Alignment</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Aesthetic & Content Preferences
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mt-1">
              Fine-tune how the Gemini strategic engine repurposes the source content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Complexity Selectors */}
            <div className="space-y-4">
              <label className="block text-slate-300 font-semibold text-sm">
                Complexity & Depth
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleUpdate('complexity', 'simple')}
                  className={`py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    preferences.complexity === 'simple'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  🌱 Simple / Accessible
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate('complexity', 'complex')}
                  className={`py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    preferences.complexity === 'complex'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  🧬 Complex / Nuanced
                </button>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                {preferences.complexity === 'simple'
                  ? 'Stripped of heavy jargon, highly digestible, focusing on core lessons and direct summaries.'
                  : 'Multi-layered analysis, in-depth breakdowns, exploring advanced implications & systematic concepts.'}
              </p>
            </div>

            {/* Tone Selectors */}
            <div className="space-y-4">
              <label className="block text-slate-300 font-semibold text-sm">
                Technical Mastery
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => handleUpdate('tone', 'basic')}
                  className={`py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    preferences.tone === 'basic'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  🗣️ Basic / Conversational
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate('tone', 'technical')}
                  className={`py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    preferences.tone === 'technical'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  💻 Technical % Expert
                </button>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                {preferences.tone === 'basic'
                  ? 'Highly relatable, friendly, focus on real-world analogies and simple daily scenarios.'
                  : 'Professional-grade terminology, deep domain-specific references, and high expertise standard.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Length Selectors */}
            <div className="space-y-4">
              <label className="block text-slate-300 font-semibold text-sm">
                Asset Target Length
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                {(['short', 'medium', 'long'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleUpdate('length', l)}
                    className={`py-3 px-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                      preferences.length === l
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                {preferences.length === 'short' && 'Max punchiness, crisp micro-insights, stops the scroll instantly.'}
                {preferences.length === 'medium' && 'Perfect balance of thorough insights and digestible reader attention spans.'}
                {preferences.length === 'long' && 'Comprehensive strategy layouts, rich sub-points, high depth-value ratio.'}
              </p>
            </div>

            {/* Audience Fields */}
            <div className="space-y-4">
              <label className="block text-slate-300 font-semibold text-sm">
                Target Audience Profile
              </label>
              <input
                type="text"
                value={preferences.audience}
                onChange={(e) => handleUpdate('audience', e.target.value)}
                placeholder="e.g. Tech Leaders, Creators, Beginners..."
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
              <div className="flex flex-wrap gap-2">
                {AUDIENCE_SUGGESTIONS.map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => handleUpdate('audience', aud)}
                    className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md border transition-all ${
                      preferences.audience === aud
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-400/40'
                        : 'bg-slate-950 text-slate-500 border-slate-800/80 hover:bg-slate-900/60 hover:text-slate-400'
                    }`}
                  >
                    + {aud}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Instructions Textarea */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-slate-300 font-semibold text-sm">
                Guiding Style & Instructions (Optional)
              </label>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Custom Prompt Injector
              </span>
            </div>
            <textarea
              value={preferences.customInstructions}
              onChange={(e) => handleUpdate('customInstructions', e.target.value)}
              placeholder="e.g., 'Make it sound exactly like Paul Graham', 'Insert an expert metaphor about chess', 'Write in first person perspective of an executioner', 'Use minimal formatting with zero emojis...'"
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700 resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;
