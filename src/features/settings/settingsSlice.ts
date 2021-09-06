import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings } from './types';

export const settingsReducerSlice = createSlice({
  name: 'settings',
  initialState: {
    pendingEngineers: [] as string[],
    dirty: true,
    engineers: [] as string[],
    githubBaseUrl: '',
    githubToken: '',
  },
  reducers: {
    addEngineer(state, { payload }: PayloadAction<string>) {
      state.pendingEngineers.push(payload);
      state.dirty = true;
    },
    removeEngineer(state, { payload }: PayloadAction<string>) {
      const idx = state.pendingEngineers.indexOf(payload);
      if (idx >= 0) {
        state.pendingEngineers.splice(idx, 1);
        state.dirty = true;
      }
    },

    updateSettings(state, { payload }: PayloadAction<AppSettings>) {
      state.engineers = payload.engineers;
      state.pendingEngineers = payload.engineers;
      state.githubBaseUrl = payload.githubBaseUrl;
      state.githubToken = payload.githubToken;
      state.dirty = false;
    },
  },
});
