import { FullReportQueryResult } from './fullReportQuery';

export interface CollectedPerWeek {
  prs: FullReportQueryResult['pullRequests']['nodes'];
  weekof: Date;
}

export interface EngineerBatchResult {
  from: string;
  to: string;
  githubUserId: string;
  result: FullReportQueryResult;
}

export type Direction = 'asc' | 'desc';
