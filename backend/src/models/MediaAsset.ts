import { Schema, model, Document, Types } from 'mongoose';

export interface MediaAssetDocument extends Document<Types.ObjectId> {
  ownerId: Types.ObjectId;
  url: string;
  key: string;
  contentType: string;
  size: number;
  createdAt: Date;
}

const mediaAssetSchema = new Schema<MediaAssetDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    url: { type: String, required: true },
    key: { type: String, required: true, unique: true, index: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const MediaAssetModel = model<MediaAssetDocument>('MediaAsset', mediaAssetSchema);
