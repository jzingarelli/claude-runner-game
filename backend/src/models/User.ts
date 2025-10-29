import { Schema, model, Document, Types } from 'mongoose';

export interface UserDocument extends Document<Types.ObjectId> {
  email: string;
  passwordHash: string;
  name: string;
  roles: string[];
  teamIds: Types.ObjectId[];
  organizationId?: Types.ObjectId;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    roles: { type: [String], default: ['viewer'] },
    teamIds: [{ type: Schema.Types.ObjectId, ref: 'Team', index: true }],
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
  },
  { timestamps: true },
);

userSchema.index({ name: 'text', email: 'text' });

export const UserModel = model<UserDocument>('User', userSchema);
