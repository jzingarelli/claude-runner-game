import { Schema, model, Document, Types } from 'mongoose';

export interface CommentDocument extends Document<Types.ObjectId> {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<CommentDocument>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, maxlength: 2000 },
  },
  { timestamps: true },
);

export const CommentModel = model<CommentDocument>('Comment', commentSchema);
