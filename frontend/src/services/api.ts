/**
 * API Service
 * Centralized API calls with axios
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, User, Post, Report, Notification, Team } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Create axios instance with default config
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

const apiClient = createApiClient();

/**
 * Auth API
 */
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => apiClient.post('/auth/register', userData),
  
  logout: (refreshToken: string) => apiClient.post('/auth/logout', { refreshToken }),
  
  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
  
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/auth/reset-password', { token, newPassword }),
  
  verifyEmail: (token: string) => apiClient.post('/auth/verify-email', { token }),
  
  enable2FA: () => apiClient.post('/auth/2fa/enable'),
  
  verify2FA: (token: string) => apiClient.post('/auth/2fa/verify', { token }),
  
  disable2FA: (token: string) => apiClient.post('/auth/2fa/disable', { token }),
};

/**
 * User API
 */
export const userApi = {
  getProfile: () => apiClient.get<ApiResponse<{ user: User }>>('/users/me'),
  
  updateProfile: (data: Partial<User>) => apiClient.put('/users/me', data),
  
  uploadAvatar: (file: FormData) =>
    apiClient.post('/users/me/avatar', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updatePreferences: (preferences: User['preferences']) =>
    apiClient.put('/users/me/preferences', preferences),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/users/me/change-password', { currentPassword, newPassword }),
  
  getAllUsers: (params?: { page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<{ users: User[] }>>('/users', { params }),
  
  getUserById: (id: string) => apiClient.get<ApiResponse<{ user: User }>>(`/users/${id}`),
  
  updateUser: (id: string, data: Partial<User>) => apiClient.put(`/users/${id}`, data),
  
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
};

/**
 * Post API
 */
export const postApi = {
  createPost: (data: Partial<Post>) => apiClient.post<ApiResponse<{ post: Post }>>('/posts', data),
  
  getAllPosts: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<ApiResponse<{ posts: Post[] }>>('/posts', { params }),
  
  getPostById: (id: string) => apiClient.get<ApiResponse<{ post: Post }>>(`/posts/${id}`),
  
  updatePost: (id: string, data: Partial<Post>) => apiClient.put(`/posts/${id}`, data),
  
  deletePost: (id: string) => apiClient.delete(`/posts/${id}`),
  
  getPostAnalytics: (id: string) => apiClient.get(`/posts/${id}/analytics`),
  
  publishPost: (id: string) => apiClient.post(`/posts/${id}/publish`),
};

/**
 * Analytics API
 */
export const analyticsApi = {
  getDashboard: () => apiClient.get('/analytics/dashboard'),
  
  getPostAnalytics: (postId: string) => apiClient.get(`/analytics/posts/${postId}`),
  
  getTimeSeriesData: (params: { start: string; end: string; granularity: string }) =>
    apiClient.get('/analytics/time-series', { params }),
};

/**
 * Report API
 */
export const reportApi = {
  createReport: (data: Partial<Report>) => apiClient.post('/reports', data),
  
  getAllReports: () => apiClient.get<ApiResponse<{ reports: Report[] }>>('/reports'),
  
  getReportById: (id: string) => apiClient.get<ApiResponse<{ report: Report }>>(`/reports/${id}`),
  
  deleteReport: (id: string) => apiClient.delete(`/reports/${id}`),
};

/**
 * Notification API
 */
export const notificationApi = {
  getNotifications: () =>
    apiClient.get<ApiResponse<{ notifications: Notification[] }>>('/notifications'),
  
  getUnreadCount: () => apiClient.get('/notifications/unread'),
  
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
};

/**
 * Team API
 */
export const teamApi = {
  createTeam: (data: { name: string; description?: string }) => apiClient.post('/teams', data),
  
  getAllTeams: () => apiClient.get<ApiResponse<{ teams: Team[] }>>('/teams'),
  
  getTeamById: (id: string) => apiClient.get<ApiResponse<{ team: Team }>>(`/teams/${id}`),
  
  updateTeam: (id: string, data: Partial<Team>) => apiClient.put(`/teams/${id}`, data),
  
  addMember: (teamId: string, userId: string, role: string) =>
    apiClient.post(`/teams/${teamId}/members`, { userId, role }),
  
  removeMember: (teamId: string, userId: string) =>
    apiClient.delete(`/teams/${teamId}/members/${userId}`),
};

/**
 * Subscription API
 */
export const subscriptionApi = {
  createSubscription: (priceId: string) =>
    apiClient.post('/subscriptions/create', { priceId }),
  
  cancelSubscription: () => apiClient.post('/subscriptions/cancel'),
  
  updateSubscription: (priceId: string) =>
    apiClient.post('/subscriptions/update', { priceId }),
  
  getCurrentSubscription: () => apiClient.get('/subscriptions/current'),
  
  getInvoices: () => apiClient.get('/subscriptions/invoices'),
};

export default apiClient;
