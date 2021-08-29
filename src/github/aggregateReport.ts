import {
  fullReportQuery,
  FullReportQueryResult,
  getNextIssueCommentsPage,
  getNextIssuePage,
  getNextPullRequestPage,
} from './fullReportQuery';

export const aggregateAllData = async (
  client: any,
  user: string,
  start: Date,
  end: Date
) => {
  const endString = end.toISOString();
  const startString = start.toISOString();

  const res = await fullReportQuery(client, {
    from: start,
    to: end,
    login: user,
  });

  const issueCommentsSelector = (
    queryRespons: Partial<FullReportQueryResult>
  ) => queryRespons.issueComments;
  const issuesSelector = (queryResponse: Partial<FullReportQueryResult>) =>
    queryResponse.issues;
  const pullRequestsSelector = (
    queryResponse: Partial<FullReportQueryResult>
  ) => queryResponse.pullRequests;

  const pageProcessors = [
    {
      selector: issueCommentsSelector,
      getNext: getNextIssueCommentsPage,
    },
    {
      selector: issuesSelector,
      getNext: getNextIssuePage,
    },
    {
      selector: pullRequestsSelector,
      getNext: getNextPullRequestPage,
    },
  ];

  for (const { selector, getNext } of pageProcessors) {
    const obj = selector(res);
    const haveEnough = () => obj.nodes.some((x) => x.createdAt < startString);
    while (obj.pageInfo.hasPreviousPage && !haveEnough()) {
      const nextSet = await getNext(client, {
        login: user,
        before: obj.pageInfo.startCursor,
      });

      obj.pageInfo = selector(nextSet).pageInfo;
      obj.nodes = [...selector(nextSet).nodes, ...obj.nodes] as any;
    }

    obj.nodes = (obj.nodes as any[]).filter(
      (n) => n.createdAt >= startString && n.createdAt <= endString
    );
  }

  return res;
};
