import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Organization { id: string; name: string }
export interface OrganizationsState { items: Organization[] }

const initialState: OrganizationsState = { items: [] };

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setOrganizations(state, action: PayloadAction<Organization[]>) {
      state.items = action.payload;
    },
  },
});

export const { setOrganizations } = organizationsSlice.actions;
export default organizationsSlice.reducer;
