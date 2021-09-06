import { graphql } from '@octokit/graphql/dist-types/types';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../../app/store';
import { getRecordsTable } from './db';
import githubSlice from './githubSlice';
import { aggregateAllData } from './gql/aggregateReport';
import { EngineerBatchResult } from './types';

const getRecordsForEngineers = async (
  client: graphql,
  userIds: string[],
  startDate: Date,
  endDate: Date
) => {
  const recordsRaw = await getRecordsTable().toArray();

  const records = recordsRaw.filter((rec) =>
    userIds.find((id) => id === rec.result.githubUserId)
  );

  const toFetchIds = userIds.filter(
    (id) => records.findIndex((record) => record.result.githubUserId === id) < 0
  );

  const getResultForUser = (id: string, start: Date, end: Date) =>
    aggregateAllData(client, id, start, end).then(
      (res) =>
        ({
          from: start.toISOString(),
          to: end.toISOString(),
          githubUserId: id,
          result: res,
        } as EngineerBatchResult)
    );

  const fetchedResults = await Promise.all(
    toFetchIds.map((engineer) => getResultForUser(engineer, startDate, endDate))
  );

  await getRecordsTable().bulkAdd(
    fetchedResults.map((res) => ({
      result: res,
    }))
  );

  return [...records.map((record) => record.result), ...fetchedResults];
};

export default function useLoadRecordsEffect(
  client: graphql,
  userIds: string[],
  startDate: Date,
  endDate: Date
) {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    getRecordsForEngineers(client, userIds, startDate, endDate).then((res) => {
      dispatch(githubSlice.actions.setData(res));
      setLoading(false);
    });
  }, [userIds, startDate, endDate, client]);
  return loading;
}
