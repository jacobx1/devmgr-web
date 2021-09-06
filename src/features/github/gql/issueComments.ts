import { queryPageInfo } from './pageInfo';

export const getIssueCommentsQuery = (includeBefore = false) =>
  `issueComments(last: 100 ${includeBefore ? 'before:$before' : ''}) {
  ${queryPageInfo}
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
}`;
