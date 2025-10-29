import { Schema, model, Document, Types } from 'mongoose';

export interface WebhookEndpointDocument extends Document<Types.ObjectId> {
  ownerId: Types.ObjectId;
  url: string;
  secret: string;
  eventTypes: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const webhookEndpointSchema = new Schema<WebhookEndpointDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    url: { type: String, required: true },
    secret: { type: String, required: true },
    eventTypes: { type: [String], default: [] },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const WebhookEndpointModel = model<WebhookEndpointDocument>('WebhookEndpoint', webhookEndpointSchema);
