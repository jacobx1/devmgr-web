export type PullRequestState = 'CLOSED' | 'MERGED' | 'OPEN';
export type PullRequestReviewState =
  | 'APPROVED'
  | 'CHANGES_REQUESTED'
  | 'COMMENTED'
  | 'DISMISSED'
  | 'PENDING';

interface FullReportQueryArgs {
  login: string;
  from: Date;
  to: Date;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
  startCursor: string;
  hasPreviousPage: boolean;
}

interface PagedNodes<T> {
  pageInfo: PageInfo;
  nodes: T[];
}

interface FullReportIssueCommentNode {
  createdAt: string;
  id: string;
  databaseId: number;
  reactions: {
    totalCount: number;
  };
  repository: {
    nameWithOwner: string;
    url: string;
  };
  pullRequest: {
    id: string;
  };
  issue: {
    id: string;
    url: string;
  };
  url: string;
  bodyText: string;
  author: {
    login: string;
  };
}

interface FullReportIssueNode {
  createdAt: string;
  closedAt: string;
  closed: boolean;
  id: string;
  databaseId: number;
  author: {
    login: string;
  };
  title: string;
  url: string;
  repository: {
    nameWithOwner: string;
    url: string;
  };
}

interface PullRequestReviewNode {
  state: PullRequestReviewState;
  author: {
    login: string;
  };
  bodyText: string;
  url: string;
  createdAt: string;
  id: string;
  databaseId: number;
}

interface FullReportPullRequestNode {
  createdAt: string;
  additions: number;
  deletions: number;
  merged: boolean;
  mergedAt: string;
  repository: {
    nameWithOwner: string;
    url: string;
  };
  author: {
    login: string;
  };
  url: string;
  title: string;
  state: PullRequestState;
  reviews: PagedNodes<PullRequestReviewNode>;
  id: string;
  databaseId: number;
}

interface FullReportContributionDay {
  contributionCount: number;
  color: string;
  date: string;
}

interface FullReportContributionWeek {
  contributionDays: FullReportContributionDay[];
}

export interface FullReportQueryResult {
  issueComments: PagedNodes<FullReportIssueCommentNode>;
  issues: PagedNodes<FullReportIssueNode>;
  pullRequests: PagedNodes<FullReportPullRequestNode>;
  contributionsCollection: {
    totalIssueContributions: number;
    totalCommitContributions: number;
    totalPullRequestContributions: number;
    totalPullRequestReviewContributions: number;
    totalRepositoriesWithContributedCommits: number;
    totalRepositoriesWithContributedIssues: number;
    totalRepositoriesWithContributedPullRequestReviews: number;
    totalRepositoriesWithContributedPullRequests: number;
    totalRepositoryContributions: number;
    contributionCalendar: {
      weeks: FullReportContributionWeek[];
    };
  };
}

export const fullReportQuery = async (
  client: any,
  args: FullReportQueryArgs
): Promise<FullReportQueryResult> => {
  const serializedArgs = {
    login: args.login,
    from: args.from.toISOString(),
    to: args.to.toISOString(),
  };

  console.log(serializedArgs);

  const res = await client(
    `query($login: String!, $from: DateTime!, $to: DateTime!) { 
    user(login:$login) {
      issueComments(last: 100) {
        pageInfo {
          endCursor
          hasNextPage
          startCursor
          hasPreviousPage
        }
        nodes {
          author {
            login
          }
          createdAt
          reactions {
            totalCount
          }
          repository {
            nameWithOwner
            url
          }
          pullRequest {
            id
          }
          issue {
            url
            id
          }
          id
          databaseId
          url
          bodyText
        }
      }
      
      issues(last: 100) {
        pageInfo {
          endCursor
          hasNextPage
          startCursor
          hasPreviousPage
        }
        nodes {
          createdAt
          closedAt
          closed
          id
          databaseId
          author {
            login
          }
          url
          title
          repository {
            nameWithOwner
            url
          }
        }
      }
      
      pullRequests(last: 100) {
        pageInfo {
          endCursor
          hasNextPage
          startCursor
          hasPreviousPage
        }
        nodes {
          createdAt
          additions
          deletions
          merged
          mergedAt
          id
          databaseId
          repository {
            nameWithOwner
            url
          }
          author {
            login
          }
          title
          state
          url
          reviews(first: 5) {
            nodes {
              bodyText
              author {
                login
              }
              id
              databaseId
              url
              createdAt
              state
            }
          }
        }
      }
      
      contributionsCollection(from:$from, to:$to) {
        totalIssueContributions
        totalCommitContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalRepositoriesWithContributedCommits
        totalRepositoriesWithContributedIssues
        totalRepositoriesWithContributedPullRequestReviews
        totalRepositoriesWithContributedPullRequests
        totalRepositoryContributions
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }`,
    serializedArgs
  );

  return res.user;
};

interface LastPageArgs {
  login: string;
  before: string;
}

interface IssueCommentsResult {
  issueComments: PagedNodes<FullReportIssueCommentNode>;
}

export const getNextIssueCommentsPage = async (
  client: any,
  args: LastPageArgs
): Promise<IssueCommentsResult> => {
  const res = await client(
    `query($login:String! $before: String!) { 
    user(login:$login) {
      issueComments(last: 100 before:$before) {
        pageInfo {
          endCursor
          hasNextPage
          startCursor
          hasPreviousPage
        }
        nodes {
          author {
            login
          }
          createdAt
          reactions {
            totalCount
          }
          repository {
            nameWithOwner
            url
          }
          pullRequest {
            id
          }
          issue {
            url
          }
          id
          databaseId
          url
          bodyText
        }
      }
    }
  }`,
    args
  );

  return res.user;
};

interface IssuesResult {
  issues: PagedNodes<FullReportIssueNode>;
}

export const getNextIssuePage = async (
  client: any,
  args: LastPageArgs
): Promise<IssuesResult> => {
  const res = await client(
    `query($login:String! $before: String!) { 
    user(login:$login) {
      issues(last: 100 before:$before) {
        pageInfo {
          endCursor
          hasNextPage
          startCursor
          hasPreviousPage
        }
        nodes {
          createdAt
          closedAt
          closed
          id
          databaseId
          author {
            login
          }
          repository {
            nameWithOwner
            url
          }
        }
      }
    }
  }`,
    args
  );

  return res.user;
};

interface PullRequestResult {
  pullRequests: PagedNodes<FullReportPullRequestNode>;
}

export const getNextPullRequestPage = async (
  client: any,
  args: LastPageArgs
): Promise<PullRequestResult> => {
  const res = await client(
    `query($login:String! $before: String!) { 
    user(login:$login) {
      pullRequests(last: 100 before:$before) {
        pageInfo {
          endCursor
          hasNextPage
          startCursor
          hasPreviousPage
        }
        nodes {
          createdAt
          additions
          deletions
          merged
          mergedAt
          repository {
            nameWithOwner
            url
          }
          author {
            login
          }
          title
          state
          url
          id
          databaseId
          reviews(first: 5) {
            nodes {
              bodyText
              author {
                login
              }
              url
              id
              databaseId
              createdAt
              state
            }
          }
        }
      }
    }
  }`,
    args
  );

  return res.user;
};
