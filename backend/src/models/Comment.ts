import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    body: { type: String, required: true, maxlength: 5000 },
  },
  { timestamps: true },
);

export const Comment = model<IComment>('Comment', CommentSchema);
