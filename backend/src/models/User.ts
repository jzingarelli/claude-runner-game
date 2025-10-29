import { Schema, model, Document } from 'mongoose';

export type UserRole = 'admin' | 'manager' | 'analyst' | 'editor' | 'viewer';

export interface IUser extends Document {
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true, index: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'analyst', 'editor', 'viewer'], default: 'viewer', index: true },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', UserSchema);
