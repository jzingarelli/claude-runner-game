import { Schema, model, Document } from 'mongoose';

export interface OrganizationDocument extends Document {
  name: string;
  domain?: string;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<OrganizationDocument>(
  {
    name: { type: String, required: true, unique: true },
    domain: { type: String, index: true },
  },
  { timestamps: true },
);

export const OrganizationModel = model<OrganizationDocument>('Organization', organizationSchema);
