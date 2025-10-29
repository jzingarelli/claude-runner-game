import { Schema, model, Document } from 'mongoose';

export interface PlanDocument extends Document {
  key: 'basic' | 'pro' | 'enterprise';
  name: string;
  priceMonthlyCents: number;
  limits: { users: number; postsPerMonth: number; storageGb: number };
}

const planSchema = new Schema<PlanDocument>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    priceMonthlyCents: { type: Number, required: true },
    limits: {
      users: { type: Number, required: true },
      postsPerMonth: { type: Number, required: true },
      storageGb: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

export const PlanModel = model<PlanDocument>('Plan', planSchema);
