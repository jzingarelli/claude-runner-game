import { Schema, model, Document, Types } from 'mongoose';

export type AnalyticsEventType =
  | 'impression'
  | 'click'
  | 'like'
  | 'comment'
  | 'share'
  | 'follow'
  | 'unfollow'
  | 'mention';

export interface AnalyticsEventDocument extends Document<Types.ObjectId> {
  userId?: Types.ObjectId;
  postId?: Types.ObjectId;
  type: AnalyticsEventType;
  platform: string;
  metadata?: Record<string, unknown>;
  occurredAt: Date;
}

const analyticsEventSchema = new Schema<AnalyticsEventDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', index: true },
    type: { type: String, required: true, index: true },
    platform: { type: String, required: true, index: true },
    metadata: { type: Schema.Types.Mixed },
    occurredAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

analyticsEventSchema.index({ type: 1, occurredAt: -1 });

export const AnalyticsEventModel = model<AnalyticsEventDocument>('AnalyticsEvent', analyticsEventSchema);
