import { Schema, model, Document } from 'mongoose';

export interface RoleDocument extends Document {
  name: 'owner' | 'admin' | 'manager' | 'analyst' | 'viewer';
  description?: string;
}

const roleSchema = new Schema<RoleDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true },
);

export const RoleModel = model<RoleDocument>('Role', roleSchema);
