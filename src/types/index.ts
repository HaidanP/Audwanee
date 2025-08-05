export interface AnalysisResult {
  overallRisk: 'low' | 'medium' | 'high';
  riskScore: number;
  findings: Finding[];
  suggestions: Suggestion[];
  summary: string;
}

export interface Finding {
  id: string;
  type: 'warning' | 'success';
  category: string;
  message: string;
  details?: string;
}

export interface Suggestion {
  id: string;
  category: string;
  issue: string;
  instead_of: string;
  try_this: string;
  explanation: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64
}