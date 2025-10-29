/**
 * Post Model
 * Defines schema for social media posts with scheduling and analytics
 */

import mongoose, { Document, Schema } from 'mongoose';
import { PostStatus } from '../types';

/**
 * Social media platform configuration
 */
export interface IPlatformConfig {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';
  accountId: string;
  postId?: string;
  published: boolean;
  publishedAt?: Date;
  error?: string;
}

/**
 * Post media attachment
 */
export interface IMediaAttachment {
  type: 'image' | 'video' | 'gif';
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  size: number;
  alt?: string;
}

/**
 * Post document interface
 */
export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  content: string;
  platforms: IPlatformConfig[];
  media: IMediaAttachment[];
  status: PostStatus;
  scheduledFor?: Date;
  publishedAt?: Date;
  tags: string[];
  analytics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    reach: number;
    impressions: number;
    engagementRate: number;
    lastUpdated?: Date;
  };
  metadata: {
    draft: boolean;
    version: number;
    previousVersions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  canEdit(userId: string): boolean;
  updateAnalytics(metrics: Partial<IPost['analytics']>): Promise<void>;
}

/**
 * Post schema definition
 */
const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    platforms: [
      {
        platform: {
          type: String,
          enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok'],
          required: true,
        },
        accountId: {
          type: String,
          required: true,
        },
        postId: String,
        published: {
          type: Boolean,
          default: false,
        },
        publishedAt: Date,
        error: String,
      },
    ],
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video', 'gif'],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        thumbnail: String,
        width: Number,
        height: Number,
        size: {
          type: Number,
          required: true,
        },
        alt: String,
      },
    ],
    status: {
      type: String,
      enum: Object.values(PostStatus),
      default: PostStatus.DRAFT,
      index: true,
    },
    scheduledFor: {
      type: Date,
      default: null,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      reach: {
        type: Number,
        default: 0,
      },
      impressions: {
        type: Number,
        default: 0,
      },
      engagementRate: {
        type: Number,
        default: 0,
      },
      lastUpdated: Date,
    },
    metadata: {
      draft: {
        type: Boolean,
        default: true,
      },
      version: {
        type: Number,
        default: 1,
      },
      previousVersions: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
postSchema.index({ userId: 1, status: 1, createdAt: -1 });
postSchema.index({ teamId: 1, status: 1, createdAt: -1 });
postSchema.index({ scheduledFor: 1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'platforms.platform': 1, status: 1 });

/**
 * Check if user can edit post
 */
postSchema.methods.canEdit = function (userId: string): boolean {
  return this.userId.toString() === userId;
};

/**
 * Update post analytics
 */
postSchema.methods.updateAnalytics = async function (
  metrics: Partial<IPost['analytics']>
): Promise<void> {
  Object.assign(this.analytics, metrics);
  this.analytics.lastUpdated = new Date();

  // Calculate engagement rate
  const totalEngagements =
    (this.analytics.likes || 0) + (this.analytics.comments || 0) + (this.analytics.shares || 0);
  const impressions = this.analytics.impressions || 1;
  this.analytics.engagementRate = (totalEngagements / impressions) * 100;

  await this.save();
};

export default mongoose.model<IPost>('Post', postSchema);
