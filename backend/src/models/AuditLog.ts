import { Schema, model, Document, Types } from 'mongoose';

export interface AuditLogDocument extends Document<Types.ObjectId> {
  actorId?: Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, index: true },
    resource: { type: String, required: true, index: true },
    resourceId: { type: Schema.Types.ObjectId, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const AuditLogModel = model<AuditLogDocument>('AuditLog', auditLogSchema);
