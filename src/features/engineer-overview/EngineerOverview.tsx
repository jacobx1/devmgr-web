import React from 'react';
import { Jumbotron, Table, Nav } from 'react-bootstrap';
import Diff from './Diff';
import { LinkContainer } from 'react-router-bootstrap';
import SortToggle from './SortToggle';
import {
  averageCycleTimeSelector,
  averagePrsPerWeekSelector,
  codeLinesAddedSelector,
  codeLinesRemovedSelector,
} from '../github/engineerBatchResultSelectors';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { sortedOverviewRowsSelector } from './overviewSelectors';
import { EngineerBatchResult } from '../github/types';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import githubSlice from '../github/githubSlice';
import { getRecordsTable } from '../github/db';

const DateHeading = ({ results }: { results: EngineerBatchResult[] }) => {
  const dispatch = useAppDispatch();
  const handleApply = (event, picker) => {
    picker.element.val(
      picker.startDate.format('MM/DD/YYYY') +
        ' - ' +
        picker.endDate.format('MM/DD/YYYY')
    );
  };
  const handleCancel = (event, picker) => {
    picker.element.val('');
  };
  if (results.length === 0) {
    return null;
  }

  const startDate = moment(results[0].from);
  const endDate = moment(results[0].to);

  return (
    <DateRangePicker
      onApply={(evt, picker) => {
        getRecordsTable()
          .clear()
          .then(() => {
            dispatch(
              githubSlice.actions.setStartEndDate({
                start: moment(picker.startDate).toDate(),
                end: moment(picker.endDate).toDate(),
              })
            );
          });
      }}
      initialSettings={{
        startDate,
        endDate,
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, 'days'),
            moment().subtract(1, 'days'),
          ],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month'),
          ],
        },
      }}
    >
      <input type="text" className="form-control col-4" />
    </DateRangePicker>
  );
};

export default function EngineerOverview() {
  const data = useAppSelector(sortedOverviewRowsSelector);
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Jumbotron>
        <h1>Engineer Overview</h1>
        <DateHeading results={data} />
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
              <SortToggle id="cycle">avg cycle</SortToggle>
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
                <td>{averageCycleTimeSelector(result).toFixed(2)}</td>
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
