import { Schema, model, Document, Types } from 'mongoose';

export interface NotificationDocument extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  type: string;
  title: string;
  body?: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const NotificationModel = model<NotificationDocument>('Notification', notificationSchema);
