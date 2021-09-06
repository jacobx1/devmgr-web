import { queryPageInfo } from './pageInfo';

export const getPullRequestsQuery = (includeBefore = false) =>
  `pullRequests(last: 100 ${includeBefore ? 'before:$before' : ''}) {
  ${queryPageInfo}
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
}`;
