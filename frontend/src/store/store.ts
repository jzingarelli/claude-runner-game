import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import usersReducer from '../slices/usersSlice';
import postsReducer from '../slices/postsSlice';
import commentsReducer from '../slices/commentsSlice';
import teamsReducer from '../slices/teamsSlice';
import permissionsReducer from '../slices/permissionsSlice';
import notificationsReducer from '../slices/notificationsSlice';
import reportsReducer from '../slices/reportsSlice';
import analyticsReducer from '../slices/analyticsSlice';
import billingReducer from '../slices/billingSlice';
import webhooksReducer from '../slices/webhooksSlice';
import filesReducer from '../slices/filesSlice';
import settingsReducer from '../slices/settingsSlice';
import chartsReducer from '../slices/chartsSlice';
import organizationsReducer from '../slices/organizationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
    teams: teamsReducer,
    permissions: permissionsReducer,
    notifications: notificationsReducer,
    reports: reportsReducer,
    analytics: analyticsReducer,
    billing: billingReducer,
    webhooks: webhooksReducer,
    files: filesReducer,
    settings: settingsReducer,
    charts: chartsReducer,
    organizations: organizationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
