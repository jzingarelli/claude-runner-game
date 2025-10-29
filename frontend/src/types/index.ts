/**
 * TypeScript type definitions for frontend
 */

export enum UserRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  status: PostStatus;
  platforms: Array<{
    platform: string;
    accountId: string;
    published: boolean;
  }>;
  media: Array<{
    type: 'image' | 'video' | 'gif';
    url: string;
    thumbnail?: string;
  }>;
  scheduledFor?: string;
  publishedAt?: string;
  tags: string[];
  analytics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  reach: number;
  impressions: number;
  engagementRate: number;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  members: Array<{
    userId: string;
    role: UserRole;
    joinedAt: string;
  }>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}
