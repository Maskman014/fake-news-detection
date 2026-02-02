import React, { useState, useEffect } from 'react';
import { AnalysisResult } from './types';
import { APP_NAME, MOCK_LOADING_STEPS } from './constants';
import { analyzeContent } from './services/gemini';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { Activity, ShieldCheck, Siren, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Default to Light Mode (false)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply theme class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Loading step animation
  useEffect(() => {
    let interval: number;
    if (loading) {
      setLoadingStep(0);
      interval = window.setInterval(() => {
        setLoadingStep((prev) => (prev < MOCK_LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeContent(url);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-brand-500/30">
      {/* Background Grid Pattern - Adaptive */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-20 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{APP_NAME}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
             <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 hidden md:block" />
            <span className="hidden md:flex items-center gap-2">
              <Activity size={16} className="text-brand-600 dark:text-brand-500" />
              v3.0 Live
            </span>
            <span className="text-xs font-mono px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 hidden sm:block">
              Gemini 3 Pro
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-6">
        {!result ? (
          <div className="flex flex-col items-center justify-center space-y-12">
            
            {/* Hero Text */}
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-brand-600 dark:text-brand-400 text-sm font-medium mb-2 shadow-sm">
                <Siren size={14} />
                <span>Forensic Fake News Detection</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
                Fake or Real? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-emerald-600 dark:from-brand-400 dark:to-emerald-400">Veritas Knows.</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Paste an article URL to instantly expose misinformation, detect political bias, and verify source credibility with forensic AI.
              </p>
            </div>

            {/* Input Form */}
            <InputSection onAnalyze={handleAnalyze} isLoading={loading} />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
               <FeatureCard 
                 title="Is It Fake?" 
                 desc="Instant verdict on whether the content is Satire, Fake, Misleading, or Factual."
                 color="bg-rose-500"
               />
               <FeatureCard 
                 title="Political Bias" 
                 desc="Detects hidden agendas and political leanings (Left, Right, Corporate)."
                 color="bg-purple-500"
               />
               <FeatureCard 
                 title="Fact Verification" 
                 desc="Deep analysis of domain history, author reputation, and factual accuracy."
                 color="bg-emerald-500"
               />
            </div>

            {/* Loading Overlay */}
            {loading && (
              <div className="fixed inset-0 z-[60] bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <ShieldCheck className="absolute inset-0 m-auto text-brand-500 animate-pulse" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Veritas Running...</h3>
                    <p className="text-brand-600 dark:text-brand-400 text-sm font-mono h-6">
                      {MOCK_LOADING_STEPS[loadingStep]}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-rose-950/90 text-rose-600 dark:text-rose-200 px-6 py-4 rounded-xl border border-rose-200 dark:border-rose-500/20 shadow-xl backdrop-blur-md flex items-center gap-3 animate-fade-in-up z-50 max-w-md w-full">
                <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-full">
                  <Activity size={20} />
                </div>
                <p className="text-sm font-medium">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-rose-400 hover:text-rose-600 dark:hover:text-rose-100"
                >
                  ✕
                </button>
              </div>
            )}

          </div>
        ) : (
          <AnalysisDashboard result={result} onReset={resetAnalysis} />
        )}
      </main>
    </div>
  );
};

const FeatureCard: React.FC<{title: string, desc: string, color: string}> = ({ title, desc, color }) => (
  <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:translate-y-[-2px]">
    <div className={`w-10 h-1 mb-4 rounded-full ${color}`} />
    <h3 className="text-slate-900 dark:text-white font-semibold mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm">{desc}</p>
  </div>
);

export default App;