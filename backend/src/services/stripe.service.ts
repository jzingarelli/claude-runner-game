import Stripe from 'stripe';
import { env } from '../config/env';

export class StripeService {
  private stripe = new Stripe(env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-09-30.acacia' as any });

  async createCustomer(email: string, name?: string) {
    return this.stripe.customers.create({ email, name });
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    return this.stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl });
  }
}
