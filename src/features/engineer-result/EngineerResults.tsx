import React from 'react';
import EngineerResult from './EngineerResult';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/store';
import { reportForUserSelector } from '../engineer-overview/overviewSelectors';
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
