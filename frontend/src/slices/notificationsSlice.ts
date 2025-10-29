import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem { id: string; title: string; read: boolean }
export interface NotificationsState { items: NotificationItem[]; unread: number }

const initialState: NotificationsState = { items: [], unread: 0 };

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationItem[]>) {
      state.items = action.payload;
      state.unread = action.payload.filter((n) => !n.read).length;
    },
    markRead(state, action: PayloadAction<string>) {
      state.items = state.items.map((n) => (n.id === action.payload ? { ...n, read: true } : n));
      state.unread = state.items.filter((n) => !n.read).length;
    },
  },
});

export const { setNotifications, markRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
