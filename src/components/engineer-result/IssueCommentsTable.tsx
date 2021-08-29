import React from 'react';
import { Table } from 'react-bootstrap';
import { EngineerBatchResult } from '../../github/EngineerBatchResult';

interface IssueCommentsTableProps {
  engineerResult: EngineerBatchResult;
}

export default function IssueCommentsTable({
  engineerResult,
}: IssueCommentsTableProps) {
  const data = engineerResult.result;
  return (
    <div>
      <h2>Issues</h2>
      <p>
        <b>{data.issues.nodes.length}</b>
      </p>
      <h2>Issue Comments</h2>
      <ul>
        <li>
          <b>Total:</b> {data.issueComments.nodes.length}
        </li>
      </ul>
      <Table>
        <thead>
          <tr>
            <th>Date Created</th>
            <th>Repository</th>
            <th>Context</th>
            <th>Text</th>
          </tr>
        </thead>
        <tbody>
          {data.issueComments.nodes.map((node, idx) => (
            <tr key={idx}>
              <td>{node.createdAt}</td>
              <td>
                <a href={node.repository.url}>
                  {node.repository.nameWithOwner}
                </a>
              </td>
              <td>
                <a href={node.issue.url}>Issue</a>
              </td>
              <td>{node.bodyText}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
