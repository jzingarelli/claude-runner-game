import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChartConfig { id: string; type: 'line' | 'bar' | 'pie' | 'area' | 'radar'; title: string }
export interface ChartsState { configs: ChartConfig[] }

const initialState: ChartsState = { configs: [] };

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setCharts(state, action: PayloadAction<ChartConfig[]>) {
      state.configs = action.payload;
    },
  },
});

export const { setCharts } = chartsSlice.actions;
export default chartsSlice.reducer;
