import moment from 'moment';
import { EngineerBatchResult } from './types';
import { averageCollection, getPrsPerWeek } from './util/calculations';

export const totalCommitsSelector = (er: EngineerBatchResult) =>
  er.result.contributionsCollection.totalCommitContributions;
export const reposWithPrsSelector = (er: EngineerBatchResult) =>
  er.result.contributionsCollection
    .totalRepositoriesWithContributedPullRequests;
export const issueContributionsSelector = (er: EngineerBatchResult) =>
  er.result.contributionsCollection.totalIssueContributions;
export const reviewContributionsSelector = (er: EngineerBatchResult) =>
  er.result.contributionsCollection.totalPullRequestReviewContributions;
export const totalPrContributionsSelector = (er: EngineerBatchResult) =>
  er.result.contributionsCollection.totalPullRequestContributions;

export const averagePrsPerWeekSelector = (er: EngineerBatchResult) =>
  averageCollection(getPrsPerWeek(er.result).map((item) => item.prs.length));

export const averageCycleTimeSelector = (er: EngineerBatchResult) =>
  averageCollection(
    er.result.pullRequests.nodes
      .map((node) =>
        node.merged
          ? moment(node.mergedAt).diff(node.createdAt, 'h') / 24
          : undefined
      )
      .filter((item) => item !== undefined)
  );

export const codeLinesAddedSelector = (er: EngineerBatchResult) =>
  er.result.pullRequests.nodes.reduce(
    (added, node) => added + node.additions,
    0
  );

export const codeLinesRemovedSelector = (er: EngineerBatchResult) =>
  er.result.pullRequests.nodes.reduce(
    (removed, node) => removed + node.deletions,
    0
  );

export const codeLinesChangesSelector = (er: EngineerBatchResult) =>
  codeLinesAddedSelector(er) + codeLinesRemovedSelector(er);
