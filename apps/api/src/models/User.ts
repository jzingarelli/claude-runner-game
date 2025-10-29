import { Schema, model, Document } from 'mongoose';

export type UserRole = 'owner' | 'admin' | 'manager' | 'analyst' | 'viewer';

export interface IUser extends Document {
  email: string;
  name: string;
  passwordHash: string;
  roles: UserRole[];
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['viewer'] },
    isEmailVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });

export const User = model<IUser>('User', userSchema);
