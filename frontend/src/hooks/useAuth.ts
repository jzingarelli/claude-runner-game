/**
 * Authentication Hook
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { login, register, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      return dispatch(login({ email, password })).unwrap();
    },
    [dispatch]
  );

  const handleRegister = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      return dispatch(register({ email, password, firstName, lastName })).unwrap();
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    return dispatch(logout()).unwrap();
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
