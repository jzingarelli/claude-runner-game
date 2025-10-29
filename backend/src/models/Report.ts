import { Schema, model, Document, Types } from 'mongoose';

export interface ReportDocument extends Document<Types.ObjectId> {
  name: string;
  ownerId: Types.ObjectId;
  teamId?: Types.ObjectId;
  filters: Record<string, unknown>;
  schedule?: { cron: string; timezone?: string };
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
  outputUrl?: string;
}

const reportSchema = new Schema<ReportDocument>(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', index: true },
    filters: { type: Schema.Types.Mixed, default: {} },
    schedule: { cron: { type: String }, timezone: { type: String } },
    status: { type: String, required: true, default: 'draft', index: true },
    outputUrl: { type: String },
  },
  { timestamps: true },
);

reportSchema.index({ ownerId: 1, name: 1 }, { unique: false });

export const ReportModel = model<ReportDocument>('Report', reportSchema);
