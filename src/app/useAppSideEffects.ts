import { useMemo } from 'react';
import { subtractDays } from '../features/github/util/calculations';

import { useAppSelector } from './store';
import useLoadSettingsEffect from '../features/settings/useLoadSettingsEffect';
import { authedGraphqlClientSelector } from './selectors';
import useLoadRecordsEffect from '../features/github/useLoadRecordsEffect';

export default function useAppSideEffects() {
  useLoadSettingsEffect();
  const settings = useAppSelector((state) => state.settings);
  const github = useAppSelector((state) => state.github);
  const client = useAppSelector(authedGraphqlClientSelector);

  const endDate = useMemo(
    () => github.pickedEndDate || new Date(),
    [github.pickedEndDate]
  );
  const startDate = useMemo(
    () => github.pickedStartDate || subtractDays(endDate, 90),
    [github.pickedStartDate, endDate]
  );

  const loading = useLoadRecordsEffect(
    client,
    settings.engineers,
    startDate,
    endDate
  );

  return { loading };
}
