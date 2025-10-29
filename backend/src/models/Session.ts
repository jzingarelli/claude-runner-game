import { Schema, model, Document, Types } from 'mongoose';

export interface SessionDocument extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  userAgent?: string;
  ip?: string;
  valid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userAgent: { type: String },
    ip: { type: String },
    valid: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const SessionModel = model<SessionDocument>('Session', sessionSchema);
