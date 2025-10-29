import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PermissionItem { key: string; description?: string }
export interface PermissionsState { items: PermissionItem[]; }

const initialState: PermissionsState = { items: [] };

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setPermissions(state, action: PayloadAction<PermissionItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { setPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
