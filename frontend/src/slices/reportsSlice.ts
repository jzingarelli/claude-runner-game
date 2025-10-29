import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReportItem { id: string; name: string; status: string }
export interface ReportsState { items: ReportItem[]; total: number }

const initialState: ReportsState = { items: [], total: 0 };

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReports(state, action: PayloadAction<{ items: ReportItem[]; total: number }>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
  },
});

export const { setReports } = reportsSlice.actions;
export default reportsSlice.reducer;
