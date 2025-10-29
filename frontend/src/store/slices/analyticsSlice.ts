/**
 * Analytics Redux Slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Analytics } from '../../types';

interface AnalyticsState {
  overview: Analytics | null;
  timeSeriesData: Array<{ date: string; [key: string]: number | string }>;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  overview: null,
  timeSeriesData: [],
  isLoading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setOverview: (state, action: PayloadAction<Analytics>) => {
      state.overview = action.payload;
    },
    setTimeSeriesData: (
      state,
      action: PayloadAction<Array<{ date: string; [key: string]: number | string }>>
    ) => {
      state.timeSeriesData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setOverview, setTimeSeriesData, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
