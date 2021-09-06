import { graphql } from '@octokit/graphql';
import { createSelector } from '@reduxjs/toolkit';
import { AppState } from './store';

const settingsSelector = (state: AppState) => state.settings;

export const authedGraphqlClientSelector = createSelector(
  settingsSelector,
  ({ githubBaseUrl, githubToken }) =>
    graphql.defaults({
      baseUrl: githubBaseUrl,
      headers: {
        authorization: `token ${githubToken}`,
      },
    })
);
