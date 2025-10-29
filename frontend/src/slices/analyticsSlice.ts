import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SummaryItem { type: string; count: number }
export interface AnalyticsState { summary: SummaryItem[] }

const initialState: AnalyticsState = { summary: [] };

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setSummary(state, action: PayloadAction<SummaryItem[]>) {
      state.summary = action.payload;
    },
  },
});

export const { setSummary } = analyticsSlice.actions;
export default analyticsSlice.reducer;
