import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCredentials, setUser, logout } from '@/slices/authSlice';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';

export function useAuth() {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((s: RootState) => s.auth);

  const login = useMutation({
    mutationFn: async (payload: { email: string; password: string; twoFactorToken?: string }) => {
      const { data } = await api.post('/auth/login', payload);
      dispatch(setCredentials({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
      return data;
    },
  });

  const register = useMutation({
    mutationFn: async (payload: { email: string; name: string; password: string }) => {
      const { data } = await api.post('/auth/register', payload);
      return data;
    },
  });

  const setUserInfo = (u: any) => dispatch(setUser(u));
  const doLogout = () => dispatch(logout());

  return { accessToken, user, login, register, setUserInfo, logout: doLogout };
}
