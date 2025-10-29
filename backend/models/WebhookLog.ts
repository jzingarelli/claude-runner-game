/**
 * WebhookLog Model
 * Logs webhook delivery attempts and responses
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IWebhookLog extends Document {
  webhookId: mongoose.Types.ObjectId;
  event: string;
  payload: Record<string, unknown>;
  response?: {
    status: number;
    body: string;
    headers: Record<string, string>;
  };
  success: boolean;
  error?: string;
  attempts: number;
  deliveredAt?: Date;
  createdAt: Date;
}

const webhookLogSchema = new Schema<IWebhookLog>(
  {
    webhookId: {
      type: Schema.Types.ObjectId,
      ref: 'Webhook',
      required: true,
      index: true,
    },
    event: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    response: {
      status: Number,
      body: String,
      headers: {
        type: Map,
        of: String,
      },
    },
    success: {
      type: Boolean,
      required: true,
      index: true,
    },
    error: String,
    attempts: {
      type: Number,
      default: 1,
    },
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

webhookLogSchema.index({ webhookId: 1, createdAt: -1 });
webhookLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

export default mongoose.model<IWebhookLog>('WebhookLog', webhookLogSchema);
