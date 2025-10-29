import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  authorId: Types.ObjectId;
  content: string;
  scheduledAt?: Date;
  publishedAt?: Date;
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'tiktok';
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
    platform: {
      type: String,
      enum: ['twitter', 'facebook', 'linkedin', 'instagram', 'tiktok'],
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

postSchema.index({ platform: 1, createdAt: -1 });

export const Post = model<IPost>('Post', postSchema);
