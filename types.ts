export interface GroundingSource {
  uri: string;
  title: string;
}

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
  groundingSources: GroundingSource[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  preview: string;
  result: AnalysisResult;
}