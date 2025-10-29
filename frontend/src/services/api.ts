import axios from 'axios';
import { store } from '@/store/store';
import { setCredentials, logout } from '@/slices/authSlice';

export const api = axios.create({ baseURL: '/api/v1' });

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err;
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const refreshToken = store.getState().auth.refreshToken;
        if (!refreshToken) throw new Error('no refresh token');
        const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
        store.dispatch(setCredentials({ accessToken: data.accessToken }));
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(config);
      } catch {
        store.dispatch(logout());
      }
    }
    return Promise.reject(err);
  },
);
