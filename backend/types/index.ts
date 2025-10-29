/**
 * Type definitions for the Social Media Analytics Platform
 * Provides comprehensive TypeScript types for all entities
 */

import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

/**
 * User role enumeration
 * Defines hierarchy: VIEWER < EDITOR < MODERATOR < ADMIN < SUPER_ADMIN
 */
export enum UserRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

/**
 * Subscription tier enumeration
 */
export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

/**
 * Post status enumeration
 */
export enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * Notification type enumeration
 */
export enum NotificationType {
  MENTION = 'mention',
  COMMENT = 'comment',
  LIKE = 'like',
  FOLLOW = 'follow',
  REPORT_READY = 'report_ready',
  SYSTEM = 'system',
}

/**
 * Report status enumeration
 */
export enum ReportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    teamId?: string;
  };
}

/**
 * JWT token payload structure
 */
export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
}

/**
 * Pagination options for list queries
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response structure
 */
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

/**
 * Analytics time range
 */
export interface TimeRange {
  start: Date;
  end: Date;
}

/**
 * Analytics metrics structure
 */
export interface AnalyticsMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  engagementRate: number;
  reach: number;
  impressions: number;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

/**
 * File upload metadata
 */
export interface FileMetadata {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  key?: string;
}

/**
 * Email template data
 */
export interface EmailTemplateData {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Webhook payload
 */
export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Job data for background processing
 */
export interface JobData {
  type: string;
  payload: Record<string, unknown>;
  userId?: string;
  priority?: number;
}

/**
 * Cache options
 */
export interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

/**
 * API error response
 */
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
    stack?: string;
  };
}

/**
 * Success response
 */
export interface SuccessResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}
