import React from 'react';
import ContributionCalendar from './ContributionCalendar';
import ContributionOverTimeGraph from './ContributionOverTimeGraphChart';
import PullRequestTable from './PullRequestTable';
import IssueCommentsTable from './IssueCommentsTable';
import SummaryInfo from './SummaryInfo';
import { EngineerBatchResult } from '../github/types';

interface EngineerResultProps {
  result: EngineerBatchResult;
}

export default function EngineerResult({ result }: EngineerResultProps) {
  return (
    <div>
      <h1>{result.githubUserId}</h1>
      <ContributionCalendar data={result.result} />
      <ContributionOverTimeGraph data={result.result} />
      <SummaryInfo engineerResult={result} />
      <PullRequestTable engineerResult={result} />
      <IssueCommentsTable engineerResult={result} />
    </div>
  );
}
