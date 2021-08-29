import { FullReportQueryResult } from '../github/fullReportQuery';

export const addDays = (date: Date, days: number) => {
  const msDifference = date.getTime() + days * 24 * 60 * 60 * 1000;
  return new Date(msDifference);
};

interface CollectedPerWeek {
  prs: FullReportQueryResult['pullRequests']['nodes'];
  weekof: Date;
}

export const getPrsPerWeek = (result: FullReportQueryResult) => {
  let cutoffDate: Date = null;
  let startDate: Date = null;

  const collectedPerWeek: CollectedPerWeek[] = [];
  let collected: typeof result.pullRequests.nodes = [];
  for (const pr of result.pullRequests.nodes) {
    if (cutoffDate === null || pr.createdAt > cutoffDate.toISOString()) {
      if (startDate) {
        collectedPerWeek.push({
          weekof: startDate,
          prs: collected,
        });
        collected = [];
      }
      startDate = new Date(pr.createdAt);
      cutoffDate = addDays(startDate, 7);
    }
    collected.push(pr);
  }

  return collectedPerWeek;
};

export const averageCollection = (collection: number[]) =>
  collection.reduce((prev, curr) => prev + curr, 0) / collection.length;
