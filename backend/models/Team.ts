/**
 * Team Model
 * Defines schema for team organizations with member management
 */

import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../types';

/**
 * Team member interface
 */
export interface ITeamMember {
  userId: mongoose.Types.ObjectId;
  role: UserRole;
  joinedAt: Date;
  permissions: string[];
}

/**
 * Team document interface
 */
export interface ITeam extends Document {
  name: string;
  description?: string;
  logo?: string;
  ownerId: mongoose.Types.ObjectId;
  members: ITeamMember[];
  settings: {
    allowMemberInvites: boolean;
    requireApproval: boolean;
    maxMembers: number;
  };
  billing: {
    subscriptionId?: string;
    seats: number;
    usedSeats: number;
  };
  createdAt: Date;
  updatedAt: Date;
  addMember(userId: string, role: UserRole): Promise<void>;
  removeMember(userId: string): Promise<void>;
  updateMemberRole(userId: string, role: UserRole): Promise<void>;
  isMember(userId: string): boolean;
}

/**
 * Team schema definition
 */
const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    logo: {
      type: String,
      default: null,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: Object.values(UserRole),
          default: UserRole.VIEWER,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        permissions: [
          {
            type: String,
          },
        ],
      },
    ],
    settings: {
      allowMemberInvites: {
        type: Boolean,
        default: false,
      },
      requireApproval: {
        type: Boolean,
        default: true,
      },
      maxMembers: {
        type: Number,
        default: 10,
      },
    },
    billing: {
      subscriptionId: String,
      seats: {
        type: Number,
        default: 5,
      },
      usedSeats: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
teamSchema.index({ ownerId: 1, createdAt: -1 });
teamSchema.index({ 'members.userId': 1 });

/**
 * Add member to team
 */
teamSchema.methods.addMember = async function (
  userId: string,
  role: UserRole = UserRole.VIEWER
): Promise<void> {
  if (this.isMember(userId)) {
    throw new Error('User is already a team member');
  }

  if (this.members.length >= this.settings.maxMembers) {
    throw new Error('Team has reached maximum member limit');
  }

  this.members.push({
    userId: new mongoose.Types.ObjectId(userId),
    role,
    joinedAt: new Date(),
    permissions: [],
  });

  this.billing.usedSeats = this.members.length;
  await this.save();
};

/**
 * Remove member from team
 */
teamSchema.methods.removeMember = async function (userId: string): Promise<void> {
  const index = this.members.findIndex((m) => m.userId.toString() === userId);

  if (index === -1) {
    throw new Error('User is not a team member');
  }

  if (this.ownerId.toString() === userId) {
    throw new Error('Cannot remove team owner');
  }

  this.members.splice(index, 1);
  this.billing.usedSeats = this.members.length;
  await this.save();
};

/**
 * Update member role
 */
teamSchema.methods.updateMemberRole = async function (
  userId: string,
  role: UserRole
): Promise<void> {
  const member = this.members.find((m) => m.userId.toString() === userId);

  if (!member) {
    throw new Error('User is not a team member');
  }

  member.role = role;
  await this.save();
};

/**
 * Check if user is team member
 */
teamSchema.methods.isMember = function (userId: string): boolean {
  return this.members.some((m) => m.userId.toString() === userId);
};

export default mongoose.model<ITeam>('Team', teamSchema);
