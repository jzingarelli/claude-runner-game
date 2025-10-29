import { Schema, model, Document, Types } from 'mongoose';

export interface SubscriptionDocument extends Document<Types.ObjectId> {
  organizationId: Types.ObjectId;
  planKey: 'basic' | 'pro' | 'enterprise';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodEnd?: Date;
}

const subscriptionSchema = new Schema<SubscriptionDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    planKey: { type: String, required: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String, index: true },
    status: { type: String, required: true, index: true },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true },
);

export const SubscriptionModel = model<SubscriptionDocument>('Subscription', subscriptionSchema);
