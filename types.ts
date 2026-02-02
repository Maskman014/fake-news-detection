export interface AnalysisResult {
  credibilityScore: number;
  biasScore: 'Low' | 'Medium' | 'High';
  riskLevel: 'Reliable' | 'Questionable' | 'Misleading';
  verdict: string;
  publisherContext: string;
  mainClaims: string[];
  fallacies: string[];
  biasAnalysis: string;
  biasType: string;
  loadedLanguageExamples: string[];
  reliabilityReasoning: string;
  sourceQuality: 'High' | 'Mixed' | 'Low' | 'Unverifiable';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  preview: string;
  result: AnalysisResult;
}