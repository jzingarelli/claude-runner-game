/**
 * Analytics Model
 * Stores time-series analytics data with aggregations
 */

import mongoose, { Document, Schema } from 'mongoose';

/**
 * Analytics document interface
 */
export interface IAnalytics extends Document {
  userId: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  postId?: mongoose.Types.ObjectId;
  date: Date;
  granularity: 'hour' | 'day' | 'week' | 'month';
  metrics: {
    views: number;
    uniqueViews: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    reach: number;
    impressions: number;
    engagementRate: number;
    clickThroughRate: number;
    bounceRate: number;
    avgTimeOnPage: number;
  };
  demographics: {
    ageGroups: Map<string, number>;
    genders: Map<string, number>;
    countries: Map<string, number>;
    devices: Map<string, number>;
  };
  platforms: Map<string, number>;
  sources: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Analytics schema definition
 */
const analyticsSchema = new Schema<IAnalytics>(
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
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      default: null,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    granularity: {
      type: String,
      enum: ['hour', 'day', 'week', 'month'],
      required: true,
      index: true,
    },
    metrics: {
      views: {
        type: Number,
        default: 0,
      },
      uniqueViews: {
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
      clickThroughRate: {
        type: Number,
        default: 0,
      },
      bounceRate: {
        type: Number,
        default: 0,
      },
      avgTimeOnPage: {
        type: Number,
        default: 0,
      },
    },
    demographics: {
      ageGroups: {
        type: Map,
        of: Number,
        default: {},
      },
      genders: {
        type: Map,
        of: Number,
        default: {},
      },
      countries: {
        type: Map,
        of: Number,
        default: {},
      },
      devices: {
        type: Map,
        of: Number,
        default: {},
      },
    },
    platforms: {
      type: Map,
      of: Number,
      default: {},
    },
    sources: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
analyticsSchema.index({ userId: 1, date: -1, granularity: 1 });
analyticsSchema.index({ teamId: 1, date: -1, granularity: 1 });
analyticsSchema.index({ postId: 1, date: -1, granularity: 1 });
analyticsSchema.index({ date: 1, granularity: 1 });

export default mongoose.model<IAnalytics>('Analytics', analyticsSchema);
