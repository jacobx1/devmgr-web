import { FullReportQueryResult } from './fullReportQuery';

export interface EngineerBatchResult {
  from: string;
  to: string;
  githubUserId: string;
  result: FullReportQueryResult;
}
