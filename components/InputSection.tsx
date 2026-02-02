import React, { useState } from 'react';
import { Search, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAnalyze(content);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden p-6 md:p-8 transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">
              Enter Article URL
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LinkIcon className="text-slate-400 dark:text-slate-500" size={20} />
              </div>
              <input
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://example.com/article..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-mono text-sm transition-colors"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2 text-brand-600 dark:text-brand-400 text-xs bg-brand-50 dark:bg-brand-950/20 p-3 rounded-lg border border-brand-100 dark:border-brand-900/50 items-start">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <p>Veritas Engine analyzes the URL structure, domain reputation, and cross-references web data to verify authenticity.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform ${
              isLoading || !content.trim()
                ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed opacity-50'
                : 'bg-brand-600 hover:bg-brand-500 hover:shadow-brand-500/25 active:scale-[0.99]'
            } flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <Search size={20} />
                Verify Article
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};