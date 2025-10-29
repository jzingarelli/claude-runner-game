/**
 * Subscription Model
 * Manages user/team subscription details and billing history
 */

import mongoose, { Document, Schema } from 'mongoose';
import { SubscriptionTier } from '../types';

export interface ISubscription extends Document {
  userId?: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  features: {
    maxPosts: number;
    maxTeamMembers: number;
    analyticsRetentionDays: number;
    advancedReports: boolean;
    apiAccess: boolean;
    webhooks: boolean;
    prioritySupport: boolean;
  };
  usage: {
    posts: number;
    teamMembers: number;
    apiCalls: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      index: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      enum: Object.values(SubscriptionTier),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'incomplete'],
      required: true,
      index: true,
    },
    currentPeriodStart: {
      type: Date,
      required: true,
    },
    currentPeriodEnd: {
      type: Date,
      required: true,
      index: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    canceledAt: Date,
    trialStart: Date,
    trialEnd: Date,
    features: {
      maxPosts: {
        type: Number,
        default: 100,
      },
      maxTeamMembers: {
        type: Number,
        default: 5,
      },
      analyticsRetentionDays: {
        type: Number,
        default: 30,
      },
      advancedReports: {
        type: Boolean,
        default: false,
      },
      apiAccess: {
        type: Boolean,
        default: false,
      },
      webhooks: {
        type: Boolean,
        default: false,
      },
      prioritySupport: {
        type: Boolean,
        default: false,
      },
    },
    usage: {
      posts: {
        type: Number,
        default: 0,
      },
      teamMembers: {
        type: Number,
        default: 0,
      },
      apiCalls: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({ status: 1, currentPeriodEnd: 1 });

export default mongoose.model<ISubscription>('Subscription', subscriptionSchema);
