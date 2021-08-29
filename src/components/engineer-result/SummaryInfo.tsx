import React, { useMemo } from 'react';
import { EngineerBatchResult } from '../../github/EngineerBatchResult';
import { averagePrsPerWeekSelector } from '../../github/engineerBatchResultSelectors';
interface SummaryInfoProps {
  engineerResult: EngineerBatchResult;
}
export default function SummaryInfo({ engineerResult }: SummaryInfoProps) {
  const data = engineerResult.result;
  const averagePrsPerWeek = useMemo(
    () => averagePrsPerWeekSelector(engineerResult),
    [engineerResult]
  );
  return (
    <div>
      <ul>
        <li>
          <b>From: </b>
          {engineerResult.from}
        </li>
        <li>
          <b>To: </b>
          {engineerResult.to}
        </li>
      </ul>
      <ul>
        <li>
          Pull Requests:{' '}
          {data.contributionsCollection.totalPullRequestContributions}
        </li>
        <li>
          Reviews:{' '}
          {data.contributionsCollection.totalPullRequestReviewContributions}
        </li>
        <li>Issues: {data.contributionsCollection.totalIssueContributions}</li>
        <li>
          Repos PRd into:{' '}
          {
            data.contributionsCollection
              .totalRepositoriesWithContributedPullRequests
          }
        </li>
        <li>
          Commits: {data.contributionsCollection.totalCommitContributions}
        </li>
        <li>Prs per Week: {averagePrsPerWeek}</li>
      </ul>
    </div>
  );
}
