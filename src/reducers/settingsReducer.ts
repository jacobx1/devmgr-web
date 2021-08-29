import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const settingsReducerSlice = createSlice({
  name: 'settings',
  initialState: {
    pendingEngineers: [] as string[],
    dirty: false,
    engineers: [] as string[],
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
    loadedEngineers(state, { payload }: PayloadAction<string[]>) {
      state.pendingEngineers = payload;
      state.engineers = payload;
      state.dirty = false;
    },
    savedEngineers(state) {
      state.engineers = state.pendingEngineers;
      state.dirty = false;
    },
  },
});
