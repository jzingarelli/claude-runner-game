import { Schema, model, Document } from 'mongoose';

export interface PermissionDocument extends Document {
  key: string; // e.g., 'post:create'
  description?: string;
}

const permissionSchema = new Schema<PermissionDocument>(
  {
    key: { type: String, required: true, unique: true, index: true },
    description: { type: String },
  },
  { timestamps: true },
);

export const PermissionModel = model<PermissionDocument>('Permission', permissionSchema);
