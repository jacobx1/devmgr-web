import { queryPageInfo } from './pageInfo';

export const getIssuesQuery = (includeBefore = false) =>
  `issues(last: 100 ${includeBefore ? 'before:$before' : ''}) {
  ${queryPageInfo}
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
}`;
