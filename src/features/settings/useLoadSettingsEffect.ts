import { useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { getSettings } from './appSettingsStorage';
import { settingsReducerSlice } from './settingsSlice';

export default function useLoadSettingsEffect() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const lsSettings = getSettings();
    dispatch(settingsReducerSlice.actions.updateSettings(lsSettings));
  }, []);
}
