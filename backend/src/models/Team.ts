import { Schema, model, Document, Types } from 'mongoose';

export interface TeamDocument extends Document<Types.ObjectId> {
  name: string;
  organizationId: Types.ObjectId;
  memberIds: Types.ObjectId[];
}

const teamSchema = new Schema<TeamDocument>(
  {
    name: { type: String, required: true, index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
  },
  { timestamps: true },
);

teamSchema.index({ name: 1, organizationId: 1 }, { unique: true });

export const TeamModel = model<TeamDocument>('Team', teamSchema);
