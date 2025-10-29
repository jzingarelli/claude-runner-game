/**
 * Webhook Model
 * Manages webhook configurations and delivery logs
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IWebhook extends Document {
  userId: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
  headers?: Record<string, string>;
  lastTriggeredAt?: Date;
  statistics: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const webhookSchema = new Schema<IWebhook>(
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
      index: true,
    },
    url: {
      type: String,
      required: true,
      match: /^https?:\/\/.+/,
    },
    events: [
      {
        type: String,
        required: true,
      },
    ],
    secret: {
      type: String,
      required: true,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    retryPolicy: {
      maxRetries: {
        type: Number,
        default: 3,
      },
      backoffMultiplier: {
        type: Number,
        default: 2,
      },
    },
    headers: {
      type: Map,
      of: String,
    },
    lastTriggeredAt: Date,
    statistics: {
      totalDeliveries: {
        type: Number,
        default: 0,
      },
      successfulDeliveries: {
        type: Number,
        default: 0,
      },
      failedDeliveries: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

webhookSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model<IWebhook>('Webhook', webhookSchema);
