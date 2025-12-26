export interface DataFile {
  id: string;
  name: string;
  type: 'csv' | 'json' | 'xlsx' | 'txt';
  size: number;
  content: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

export interface ApiRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  createdAt: Date;
}

export interface DataQualityIssue {
  type: 'missing' | 'duplicate' | 'invalid' | 'inconsistent';
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedRows: number[];
  suggestion?: string;
}

export interface FileMergeConfig {
  files: DataFile[];
  mergeKey: string;
  mergeStrategy: 'inner' | 'left' | 'right' | 'outer';
}
