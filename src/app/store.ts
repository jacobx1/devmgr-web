import { configureStore } from '@reduxjs/toolkit';
import { engineerOverviewSlice } from '../features/engineer-overview/engineerOverviewSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { settingsReducerSlice } from '../features/settings/settingsSlice';
import githubSlice from '../features/github/githubSlice';

export const store = configureStore({
  reducer: {
    github: githubSlice.reducer,
    overview: engineerOverviewSlice.reducer,
    settings: settingsReducerSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppGetState = typeof store.getState;
export type AppState = ReturnType<AppGetState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
