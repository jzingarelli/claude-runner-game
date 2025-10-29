import { Schema, model, Document, Types } from 'mongoose';

export interface InvoiceDocument extends Document<Types.ObjectId> {
  organizationId: Types.ObjectId;
  stripeInvoiceId?: string;
  amountDueCents: number;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  hostedInvoiceUrl?: string;
  invoicePdfUrl?: string;
}

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    stripeInvoiceId: { type: String, index: true },
    amountDueCents: { type: Number, required: true },
    status: { type: String, required: true, index: true },
    hostedInvoiceUrl: { type: String },
    invoicePdfUrl: { type: String },
  },
  { timestamps: true },
);

export const InvoiceModel = model<InvoiceDocument>('Invoice', invoiceSchema);
