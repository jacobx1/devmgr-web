import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EngineerBatchResult } from './types';

const githubSlice = createSlice({
  name: 'github',
  initialState: {
    data: null as EngineerBatchResult[],
    pickedStartDate: null,
    pickedEndDate: null,
  },
  reducers: {
    addData(state, action: PayloadAction<EngineerBatchResult>) {
      state.data.push(action.payload);
    },
    setData(state, action: PayloadAction<EngineerBatchResult[]>) {
      state.data = action.payload;
    },
    setStartEndDate(state, action: PayloadAction<{ start: Date; end: Date }>) {
      state.pickedEndDate = action.payload.end;
      state.pickedStartDate = action.payload.start;
    },
  },
});

export default githubSlice;
