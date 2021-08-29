import { useEffect, useState } from 'react';
import db, { getRecordsTable } from '../data/db';
import { getSettings } from '../data/settings';
import { aggregateAllData } from '../github/aggregateReport';
import { getAuthedGraphqlClientWithToken } from '../github/client';
import { subtractDays } from '../github/date';
import { EngineerBatchResult } from '../github/EngineerBatchResult';
import githubSlice from '../reducers/github';
import { useAppDispatch } from '../reducers/root';
import { settingsReducerSlice } from '../reducers/settingsReducer';

const getRecordsForEngineers = async (
  client: any,
  userIds: string[],
  startDate: Date,
  endDate: Date
) => {
  const records = await getRecordsTable().toArray();

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

export default function usePrimeApp() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const settings = getSettings();
    dispatch(settingsReducerSlice.actions.loadedEngineers(settings.engineers));
    const endDate = new Date();
    const startDate = subtractDays(endDate, 90);
    const client = getAuthedGraphqlClientWithToken({
      baseUrl: settings.githubBaseUrl,
      token: settings.githubToken,
    });

    getRecordsForEngineers(client, settings.engineers, startDate, endDate).then(
      (res) => {
        dispatch(githubSlice.actions.setData(res));
        setLoading(false);
      }
    );
  }, []);

  return { loading };
}
