import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Direction } from '../github/compare';
export type ColumnType =
  | 'id'
  | 'prs'
  | 'reviews'
  | 'issues'
  | 'repoCount'
  | 'commits'
  | 'prsPerWeek'
  | 'code';

export const engineerOverviewSlice = createSlice({
  name: 'engineerOverview',
  initialState: {
    orderBy: 'id' as ColumnType,
    direction: 'asc' as Direction,
  },
  reducers: {
    toggleColumn(state, action: PayloadAction<ColumnType>) {
      if (state.orderBy === action.payload && state.direction === 'asc') {
        state.direction = 'desc';
      } else {
        state.orderBy = action.payload;
        state.direction = 'asc';
      }
    },
  },
});
