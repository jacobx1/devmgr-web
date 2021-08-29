import React from 'react';
import { Jumbotron, Table, Nav } from 'react-bootstrap';
import Diff from './Diff';
import { LinkContainer } from 'react-router-bootstrap';
import SortToggle from './SortToggle';
import {
  averagePrsPerWeekSelector,
  codeLinesAddedSelector,
  codeLinesRemovedSelector,
} from '../github/engineerBatchResultSelectors';
import { useAppSelector } from '../reducers/root';
import { sortedOverviewRowsSelector } from '../reducers/overviewSelectors';

export default function EngineerOverview() {
  const data = useAppSelector(sortedOverviewRowsSelector);
  if (!data) {
    return <div>Loading...</div>;
  }
  const to = new Date(data[0].to);
  const from = new Date(data[0].from);
  return (
    <div>
      <Jumbotron>
        <h1>Engineer Overview</h1>
        <h2>
          {from.toLocaleDateString()} to {to.toLocaleDateString()}
        </h2>
      </Jumbotron>
      <Table>
        <thead>
          <tr>
            <th>
              <SortToggle id="id">id</SortToggle>
            </th>
            <th>
              <SortToggle id="prs">prs</SortToggle>
            </th>
            <th>
              <SortToggle id="reviews">reviews</SortToggle>
            </th>
            <th>
              <SortToggle id="issues">issues</SortToggle>
            </th>
            <th>
              <SortToggle id="repoCount">repos contributed</SortToggle>
            </th>
            <th>
              <SortToggle id="commits">commits</SortToggle>
            </th>
            <th>
              <SortToggle id="prsPerWeek">prs per week</SortToggle>
            </th>
            <th>
              <SortToggle id="code">code</SortToggle>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((result, idx) => {
            const data = result.result;
            const totalPrAdded = codeLinesAddedSelector(result);
            const totalPrRemoved = codeLinesRemovedSelector(result);
            return (
              <tr key={idx}>
                <td>
                  <LinkContainer to={`/user/${result.githubUserId}`}>
                    <Nav.Link>{result.githubUserId}</Nav.Link>
                  </LinkContainer>
                </td>
                <td>
                  {data.contributionsCollection.totalPullRequestContributions}
                </td>
                <td>
                  {
                    data.contributionsCollection
                      .totalPullRequestReviewContributions
                  }
                </td>
                <td>{data.contributionsCollection.totalIssueContributions}</td>
                <td>
                  {
                    data.contributionsCollection
                      .totalRepositoriesWithContributedPullRequests
                  }
                </td>
                <td>{data.contributionsCollection.totalCommitContributions}</td>
                <td>{averagePrsPerWeekSelector(result).toFixed(2)}</td>
                <td>
                  <Diff added={totalPrAdded} removed={totalPrRemoved} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
