import { graphql } from '@octokit/graphql';

export const getAuthedGraphqlClientWithToken = ({ baseUrl, token }) =>
  graphql.defaults({
    baseUrl,
    headers: {
      authorization: `token ${token}`,
    },
  });
