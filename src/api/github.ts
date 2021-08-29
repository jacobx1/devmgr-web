import { graphql } from '@octokit/graphql';
import { getSettings } from '../data/settings';
import { aggregateAllData } from '../github/aggregateReport';
import { getAuthedGraphqlClientWithToken } from '../github/client';

export function getPrsForUser(user: string, start: Date, end: Date) {
  const settings = getSettings();
  const client = getAuthedGraphqlClientWithToken({
    baseUrl: settings.githubBaseUrl,
    token: settings.githubToken,
  });

  return aggregateAllData(client, user, start, end);
}
