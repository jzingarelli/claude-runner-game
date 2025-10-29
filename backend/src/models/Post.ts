import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  authorId: Types.ObjectId;
  content: string;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, maxlength: 5000 },
    scheduledAt: { type: Date },
  },
  { timestamps: true },
);

export const Post = model<IPost>('Post', PostSchema);
