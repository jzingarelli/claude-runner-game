import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  user?: { id: string; email: string; name: string; roles: string[] };
}

const initialState: AuthState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setUser(state, action: PayloadAction<AuthState['user']>) {
      state.user = action.payload || undefined;
    },
    logout() {
      return {};
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
