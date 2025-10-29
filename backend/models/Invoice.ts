/**
 * Invoice Model
 * Stores billing invoices from Stripe
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  stripeInvoiceId: string;
  stripeCustomerId: string;
  subscriptionId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  pdfUrl?: string;
  hostedUrl?: string;
  dueDate?: Date;
  paidAt?: Date;
  items: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    stripeInvoiceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
      index: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'usd',
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'paid', 'uncollectible', 'void'],
      required: true,
      index: true,
    },
    pdfUrl: String,
    hostedUrl: String,
    dueDate: Date,
    paidAt: Date,
    items: [
      {
        description: String,
        amount: Number,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ userId: 1, status: 1, createdAt: -1 });

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);
