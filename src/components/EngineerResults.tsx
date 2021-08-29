import React from 'react';
import EngineerResult from './engineer-result/EngineerResult';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../reducers/root';
import { reportForUserSelector } from '../reducers/overviewSelectors';
export default function EngineerResults() {
  const { id } = useParams<{ id: string }>();
  const data = useAppSelector((state) =>
    reportForUserSelector(state, { userId: id })
  );
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <EngineerResult result={data} />
    </div>
  );
}
