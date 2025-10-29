import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserItem { id: string; email: string; name: string; roles: string[] }
export interface UsersState { items: UserItem[]; total: number; }

const initialState: UsersState = { items: [], total: 0 };

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<{ items: UserItem[]; total: number }>) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
  },
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
