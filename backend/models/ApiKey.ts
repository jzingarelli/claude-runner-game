/**
 * ApiKey Model
 * Manages API keys for programmatic access
 */

import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface IApiKey extends Document {
  userId: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  name: string;
  key: string;
  prefix: string;
  scopes: string[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
  rateLimit: {
    requests: number;
    window: number;
  };
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  generateKey(): string;
}

const apiKeySchema = new Schema<IApiKey>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    prefix: {
      type: String,
      required: true,
      index: true,
    },
    scopes: [
      {
        type: String,
        required: true,
      },
    ],
    lastUsedAt: Date,
    expiresAt: {
      type: Date,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    rateLimit: {
      requests: {
        type: Number,
        default: 1000,
      },
      window: {
        type: Number,
        default: 3600,
      },
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

apiKeySchema.index({ userId: 1, isActive: 1 });
apiKeySchema.index({ prefix: 1, isActive: 1 });

/**
 * Generate a new API key
 */
apiKeySchema.methods.generateKey = function (): string {
  const key = crypto.randomBytes(32).toString('hex');
  const prefix = key.substring(0, 8);
  this.key = crypto.createHash('sha256').update(key).digest('hex');
  this.prefix = prefix;
  return `smap_${key}`;
};

export default mongoose.model<IApiKey>('ApiKey', apiKeySchema);
