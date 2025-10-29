import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Presign { url: string; key: string }
export interface FilesState { lastPresign?: Presign }

const initialState: FilesState = {};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setPresign(state, action: PayloadAction<Presign>) {
      state.lastPresign = action.payload;
    },
  },
});

export const { setPresign } = filesSlice.actions;
export default filesSlice.reducer;
