import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TeamItem { id: string; name: string; }
export interface TeamsState { items: TeamItem[]; total: number; }

const initialState: TeamsState = { items: [], total: 0 };

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setTeams(state, action: PayloadAction<{ items: TeamItem[]; total: number }>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
  },
});

export const { setTeams } = teamsSlice.actions;
export default teamsSlice.reducer;
