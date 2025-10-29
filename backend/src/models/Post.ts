import { Schema, model, Document, Types } from 'mongoose';

export interface PostDocument extends Document<Types.ObjectId> {
  authorId: Types.ObjectId;
  content: string;
  mediaUrls: string[];
  scheduledAt?: Date;
  publishedAt?: Date;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'tiktok' | 'other';
  analytics: {
    impressions: number;
    clicks: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

const postSchema = new Schema<PostDocument>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, maxlength: 5000 },
    mediaUrls: { type: [String], default: [] },
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
    platform: { type: String, required: true, index: true },
    analytics: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

postSchema.index({ platform: 1, publishedAt: -1 });
postSchema.index({ content: 'text' });

export const PostModel = model<PostDocument>('Post', postSchema);
