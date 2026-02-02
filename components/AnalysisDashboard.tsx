import React from 'react';
import { AnalysisResult } from '../types';
import { ShieldCheck, ShieldAlert, ShieldX, TrendingUp, AlertTriangle, BookOpen, Target, CheckCircle2, XCircle, HelpCircle, Siren } from 'lucide-react';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const RiskVisualizer: React.FC<{ level: string }> = ({ level }) => {
  let Icon = HelpCircle;
  let bgClass = "bg-slate-100 dark:bg-slate-800";
  let iconClass = "text-slate-500";

  if (level === 'Reliable') {
    Icon = ShieldCheck;
    bgClass = "bg-emerald-100 dark:bg-emerald-500/20";
    iconClass = "text-emerald-600 dark:text-emerald-500";
  } else if (level === 'Questionable') {
    Icon = ShieldAlert;
    bgClass = "bg-amber-100 dark:bg-amber-500/20";
    iconClass = "text-amber-600 dark:text-amber-500";
  } else if (level === 'Misleading') {
    Icon = Siren;
    bgClass = "bg-rose-100 dark:bg-rose-500/20";
    iconClass = "text-rose-600 dark:text-rose-500";
  }

  return (
    <div className={`relative w-32 h-32 rounded-full ${bgClass} flex items-center justify-center shadow-inner`}>
      <div className={`absolute inset-0 rounded-full ${bgClass} animate-pulse-slow opacity-50`}></div>
      <Icon className={`w-16 h-16 ${iconClass} relative z-10`} strokeWidth={1.5} />
    </div>
  );
};

const VerdictStamp: React.FC<{ level: string }> = ({ level }) => {
  let text = "UNCERTAIN";
  let color = "text-amber-600 border-amber-600 dark:text-amber-500 dark:border-amber-500";
  let rotate = "-rotate-3";
  let Icon = HelpCircle;
  
  if (level === 'Reliable') {
    text = "REAL NEWS";
    color = "text-emerald-600 border-emerald-600 dark:text-emerald-500 dark:border-emerald-500";
    rotate = "-rotate-6";
    Icon = CheckCircle2;
  } else if (level === 'Misleading') {
    text = "FAKE / MISLEADING";
    color = "text-rose-600 border-rose-600 dark:text-rose-500 dark:border-rose-500";
    rotate = "rotate-6";
    Icon = XCircle;
  }

  return (
    <div className={`flex items-center gap-3 border-4 ${color} px-6 py-2 rounded-lg font-black text-xl md:text-2xl uppercase tracking-widest transform ${rotate} shadow-lg mb-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm`}>
      <Icon size={32} strokeWidth={3} />
      <span>{text}</span>
    </div>
  );
};

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          {/* Visual Icon Section (Replaces Score Gauge) */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <RiskVisualizer level={result.riskLevel} />
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
               result.riskLevel === 'Reliable' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400' :
               result.riskLevel === 'Misleading' ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400' :
               'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'
            }`}>
              {result.riskLevel} Level
            </div>
          </div>
          
          <div className="hidden md:block w-px h-32 bg-slate-200 dark:bg-slate-800"></div>

          {/* Verdict Section */}
          <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left space-y-4">
             <VerdictStamp level={result.riskLevel} />
             
             <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  "{result.verdict}"
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium border-l-4 border-brand-500 pl-3">
                  Context: {result.publisherContext}
                </p>
             </div>

             <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                   <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Bias</span>
                   <span className={`text-sm font-bold ${
                     result.biasScore === 'High' ? 'text-rose-600 dark:text-rose-400' : 
                     result.biasScore === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 
                     'text-emerald-600 dark:text-emerald-400'
                   }`}>
                     {result.biasScore}
                   </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                   <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Orientation</span>
                   <span className="text-brand-600 dark:text-brand-400 text-sm font-bold capitalize">{result.biasType}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Claims */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-brand-600 dark:text-brand-400">
            <Target size={20} />
            <h3 className="font-bold text-lg">Main Claims & Facts</h3>
          </div>
          <ul className="space-y-3">
            {result.mainClaims.map((claim, idx) => (
              <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm group">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0 group-hover:scale-125 transition-transform" />
                {claim}
              </li>
            ))}
          </ul>
        </div>

        {/* Bias Analysis */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400">
            <TrendingUp size={20} />
            <h3 className="font-bold text-lg">Bias & Narrative</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
            {result.biasAnalysis}
          </p>
           {result.loadedLanguageExamples.length > 0 && (
             <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800">
               <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Loaded Language Detected</span>
               <div className="flex flex-wrap gap-2">
                 {result.loadedLanguageExamples.map((ex, i) => (
                   <span key={i} className="px-2 py-1 bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs rounded border border-rose-200 dark:border-rose-500/20 font-medium">
                     "{ex}"
                   </span>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* Logical Fallacies */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-rose-600 dark:text-rose-400">
            <AlertTriangle size={20} />
            <h3 className="font-bold text-lg">Logical Fallacies</h3>
          </div>
          {result.fallacies.length > 0 ? (
            <ul className="space-y-3">
              {result.fallacies.map((fallacy, idx) => (
                <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm bg-rose-50 dark:bg-slate-800/30 p-2 rounded border border-rose-100 dark:border-transparent">
                  <ShieldAlert size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  {fallacy}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
              <ShieldCheck size={16} /> No major logical fallacies detected.
            </p>
          )}
        </div>

        {/* Source Reliability */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
            <BookOpen size={20} />
            <h3 className="font-bold text-lg">Source Reliability</h3>
          </div>
          <div className="flex items-center justify-between mb-3">
             <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Quality Assessment:</span>
             <span className={`text-sm font-bold px-2 py-0.5 rounded ${
               result.sourceQuality === 'High' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
               result.sourceQuality === 'Mixed' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' :
               'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
             }`}>{result.sourceQuality}</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
            {result.reliabilityReasoning}
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-bold transition-colors border border-slate-200 dark:border-slate-700 shadow-md"
        >
          Analyze Another Article
        </button>
      </div>
    </div>
  );
};