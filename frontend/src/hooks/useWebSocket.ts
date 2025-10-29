/**
 * WebSocket Hook
 */

import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './redux';
import { addNotification } from '../store/slices/notificationSlice';

let socket: Socket | null = null;

export const useWebSocket = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken) return;

    socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
      auth: { token: accessToken },
      path: '/socket.io',
    });

    socket.on('connected', (data) => {
      console.log('WebSocket connected:', data);
    });

    socket.on('notification', (notification) => {
      dispatch(addNotification(notification));
    });

    socket.on('analytics:update', (data) => {
      console.log('Analytics update:', data);
    });

    socket.on('post:update', (data) => {
      console.log('Post update:', data);
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [accessToken, dispatch]);

  const joinTeam = useCallback((teamId: string) => {
    socket?.emit('join:team', teamId);
  }, []);

  const leaveTeam = useCallback((teamId: string) => {
    socket?.emit('leave:team', teamId);
  }, []);

  return { joinTeam, leaveTeam };
};
