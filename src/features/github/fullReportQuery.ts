import {
  ContributionsCollection,
  IssueCommentConnection,
  IssueConnection,
  PullRequestConnection,
} from '@octokit/graphql-schema';
import { graphql } from '@octokit/graphql/dist-types/types';
import { getContributionCalendarQuery } from './gql/contributions';
import { getIssueCommentsQuery } from './gql/issueComments';
import { getIssuesQuery } from './gql/issues';
import { getPullRequestsQuery } from './gql/pulls';
export interface FullReportQueryResult {
  issueComments: IssueCommentConnection;
  issues: IssueConnection;
  pullRequests: PullRequestConnection;
  contributionsCollection: ContributionsCollection;
}

export const fullReportQuery = (
  client: graphql,
  args: {
    login: string;
    from: Date;
    to: Date;
  }
) =>
  client<{ user: FullReportQueryResult }>(
    `query($login: String!, $from: DateTime!, $to: DateTime!) { 
  user(login:$login) {
    ${getIssueCommentsQuery()}
    ${getIssuesQuery()}
    ${getPullRequestsQuery()}
    ${getContributionCalendarQuery()}
  }
}`,
    {
      login: args.login,
      from: args.from.toISOString(),
      to: args.to.toISOString(),
    }
  ).then((res) => res.user);

interface LastPageArgs extends Record<string, string> {
  login: string;
  before: string;
}

const getUserNextPageQuery = (queryFn: (includeBefore: boolean) => string) =>
  `query($login:String! $before: String!) { 
  user(login:$login) {
    ${queryFn(true)}
  }
}`;

export const getNextIssueCommentsPage = (client: graphql, args: LastPageArgs) =>
  client<{
    user: { issueComments: IssueCommentConnection };
  }>(getUserNextPageQuery(getIssueCommentsQuery), args).then((res) => res.user);

export const getNextIssuePage = (client: graphql, args: LastPageArgs) =>
  client<{ user: { issues: IssueConnection } }>(
    getUserNextPageQuery(getIssuesQuery),
    args
  ).then((res) => res.user);

export const getNextPullRequestPage = (client: graphql, args: LastPageArgs) =>
  client<{ user: { pullRequests: PullRequestConnection } }>(
    getUserNextPageQuery(getPullRequestsQuery),
    args
  ).then((res) => res.user);
