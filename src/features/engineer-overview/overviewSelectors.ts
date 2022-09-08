import { createSelector } from '@reduxjs/toolkit';
import { compareValues, swapDirection } from './compare';
import {
  averageCycleTimeSelector,
  averagePrsPerWeekSelector,
  codeLinesChangesSelector,
  issueContributionsSelector,
  reposWithPrsSelector,
  reviewContributionsSelector,
  totalCommitsSelector,
  totalPrContributionsSelector,
} from '../github/engineerBatchResultSelectors';
import { EngineerBatchResult } from '../github/types';
import { AppState } from '../../app/store';

const overviewSelector = (state: AppState) => state.overview;
const userIdSelector = (er: EngineerBatchResult) => er.githubUserId;

const compareMap = {
  id: userIdSelector,
  prs: totalPrContributionsSelector,
  reviews: reviewContributionsSelector,
  issues: issueContributionsSelector,
  repoCount: reposWithPrsSelector,
  commits: totalCommitsSelector,
  prsPerWeek: averagePrsPerWeekSelector,
  code: codeLinesChangesSelector,
  cycle: averageCycleTimeSelector,
};

export const sortedOverviewRowsSelector = createSelector(
  [overviewSelector, (state) => state.github.data],
  (overview, data) => {
    if (!data) {
      return [];
    }

    return [...data].sort((e1, e2) => {
      const [item1, item2] = swapDirection(overview.direction, e1, e2);
      const fn = compareMap[overview.orderBy];
      if (fn) {
        return compareValues(fn(item1), fn(item2));
      }

      return 0;
    });
  }
);

const userIdPropSelector = (state: AppState, props: { userId: string }) =>
  props.userId;

export const reportForUserSelector = createSelector(
  [(state: AppState) => state.github.data, userIdPropSelector],
  (data, userId) => data.find((item) => item.githubUserId === userId)
);
