import React, { useReducer } from 'react';
import { useMemo } from 'react';
import { Table } from 'react-bootstrap';

import {
  codeLinesAddedSelector,
  codeLinesRemovedSelector,
} from '../github/engineerBatchResultSelectors';

import Diff, { Added, Removed } from '../engineer-overview/Diff';
import { SortToggleBase } from '../engineer-overview/SortToggle';
import { Direction, EngineerBatchResult } from '../github/types';
import {
  compareNumbers,
  compareStrings,
  swapDirection,
} from '../engineer-overview/compare';

interface PullRequestTableProps {
  engineerResult: EngineerBatchResult;
}

type PRColumnType = 'opened' | 'merged' | 'added' | 'removed';

interface ColumnState {
  orderBy: PRColumnType;
  direction: Direction;
}

function columnStateReducer(
  state: ColumnState,
  columnType: PRColumnType
): ColumnState {
  if (state.orderBy === columnType && state.direction === 'asc') {
    return {
      ...state,
      direction: 'desc',
    };
  }

  return {
    orderBy: columnType,
    direction: 'asc',
  };
}

export default function PullRequestTable({
  engineerResult,
}: PullRequestTableProps) {
  const addedLoc = codeLinesAddedSelector(engineerResult);
  const removedLoc = codeLinesRemovedSelector(engineerResult);
  const [columnState, toggleColumn] = useReducer(columnStateReducer, {
    orderBy: 'opened',
    direction: 'asc',
  });
  const data = engineerResult.result;
  const sortedPrs = useMemo(
    () =>
      [...data.pullRequests.nodes].sort((e1, e2) => {
        const [item1, item2] = swapDirection(columnState.direction, e1, e2);
        switch (columnState.orderBy) {
          case 'added':
            return compareNumbers(item1.additions, item2.additions);
          case 'removed':
            return compareNumbers(item1.deletions, item2.deletions);
          case 'opened':
            return compareStrings(item1.createdAt, item2.createdAt);
          case 'merged':
            return compareStrings(item1.mergedAt || '', item2.mergedAt || '');
        }
      }),
    [columnState, data.pullRequests.nodes]
  );

  return (
    <div>
      <h2>Pull Requests</h2>
      <ul>
        <li>
          <b>Impact:</b> <Diff added={addedLoc} removed={removedLoc} />
        </li>
        <li>
          <b>Total:</b> {data.pullRequests.nodes.length}
        </li>
      </ul>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Repo</th>
            <th>
              <SortToggleBase
                id="opened"
                orderBy={columnState.orderBy}
                direction={columnState.direction}
                onClick={toggleColumn}
              >
                Opened
              </SortToggleBase>
            </th>
            <th>
              <SortToggleBase
                id="merged"
                orderBy={columnState.orderBy}
                direction={columnState.direction}
                onClick={toggleColumn}
              >
                Merged
              </SortToggleBase>
            </th>
            <th>
              <SortToggleBase
                id="added"
                orderBy={columnState.orderBy}
                direction={columnState.direction}
                onClick={toggleColumn}
              >
                Added
              </SortToggleBase>
            </th>
            <th>
              <SortToggleBase
                id="removed"
                orderBy={columnState.orderBy}
                direction={columnState.direction}
                onClick={toggleColumn}
              >
                Removed
              </SortToggleBase>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPrs.map((node, idx) => (
            <tr key={idx}>
              <td>
                <a href={node.url}>{node.title}</a>
              </td>
              <td>
                <a href={node.repository.url}>
                  {node.repository.nameWithOwner}
                </a>
              </td>
              <td>{node.createdAt}</td>
              <td>{node.mergedAt}</td>
              <td>
                <Added added={node.additions} />
              </td>
              <td>
                <Removed removed={node.deletions} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
