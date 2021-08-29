import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EngineerBatchResult } from '../github/EngineerBatchResult';
import { FullReportQueryResult } from '../github/fullReportQuery';

const githubSlice = createSlice({
  name: 'github',
  initialState: {
    data: [] as EngineerBatchResult[],
  },
  reducers: {
    addData(state, action: PayloadAction<EngineerBatchResult>) {
      state.data.push(action.payload);
    },
    setData(state, action: PayloadAction<EngineerBatchResult[]>) {
      state.data = action.payload;
    },
  },
});

export default githubSlice;
