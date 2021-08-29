import { configureStore } from '@reduxjs/toolkit';
import githubSlice from './github';
import { engineerOverviewSlice } from './engineerOverviewReducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { settingsReducerSlice } from './settingsReducer';

export const store = configureStore({
  reducer: {
    github: githubSlice.reducer,
    overview: engineerOverviewSlice.reducer,
    settings: settingsReducerSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
