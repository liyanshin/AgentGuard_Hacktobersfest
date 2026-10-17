export type RiskLevel = 'safe' | 'caution' | 'high_risk';

export interface FlaggedItem {
  category: string;
  detail: string;
}

export interface ScanResult {
  risk_level: RiskLevel;
  flagged_items: FlaggedItem[];
  summary: string;
  explanation: string;
  latency_ms?: number;
  timestamp?: string;
  character?: string;
}

export interface DemoExample {
  id: string;
  label: string;
  tag: string;
  category: 'safe' | 'pii' | 'credentials';
  title: string;
  description: string;
  text: string;
  badgeStyle: string;
}
