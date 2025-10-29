/**
 * Stripe Service
 * Handles subscription management and payments
 */

import Stripe from 'stripe';
import { SubscriptionTier } from '../types';
import User from '../models/User';
import Subscription from '../models/Subscription';
import Invoice from '../models/Invoice';
import logger from '../utils/logger';

/**
 * Stripe service class
 */
class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create customer in Stripe
   * @param email - Customer email
   * @param name - Customer name
   * @param userId - User ID for metadata
   * @returns Stripe customer
   */
  async createCustomer(email: string, name: string, userId: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
        },
      });

      logger.info(`Stripe customer created: ${customer.id}`);
      return customer;
    } catch (error) {
      logger.error('Failed to create Stripe customer:', error);
      throw error;
    }
  }

  /**
   * Create subscription
   * @param customerId - Stripe customer ID
   * @param priceId - Stripe price ID
   * @param userId - User ID
   * @returns Subscription document
   */
  async createSubscription(
    customerId: string,
    priceId: string,
    userId: string
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      logger.info(`Stripe subscription created: ${subscription.id}`);
      return subscription;
    } catch (error) {
      logger.error('Failed to create Stripe subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   * @param subscriptionId - Stripe subscription ID
   * @param immediate - Cancel immediately or at period end
   * @returns Canceled subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    immediate: boolean = false
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: !immediate,
      });

      if (immediate) {
        await this.stripe.subscriptions.cancel(subscriptionId);
      }

      logger.info(`Stripe subscription canceled: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      logger.error('Failed to cancel Stripe subscription:', error);
      throw error;
    }
  }

  /**
   * Update subscription
   * @param subscriptionId - Stripe subscription ID
   * @param priceId - New price ID
   * @returns Updated subscription
   */
  async updateSubscription(
    subscriptionId: string,
    priceId: string
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      const updated = await this.stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        proration_behavior: 'always_invoice',
      });

      logger.info(`Stripe subscription updated: ${subscriptionId}`);
      return updated;
    } catch (error) {
      logger.error('Failed to update Stripe subscription:', error);
      throw error;
    }
  }

  /**
   * Retrieve subscription
   * @param subscriptionId - Stripe subscription ID
   * @returns Subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      logger.error('Failed to retrieve Stripe subscription:', error);
      throw error;
    }
  }

  /**
   * Create setup intent for payment method
   * @param customerId - Stripe customer ID
   * @returns Setup intent
   */
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      return await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });
    } catch (error) {
      logger.error('Failed to create setup intent:', error);
      throw error;
    }
  }

  /**
   * Get customer payment methods
   * @param customerId - Stripe customer ID
   * @returns List of payment methods
   */
  async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      logger.error('Failed to retrieve payment methods:', error);
      throw error;
    }
  }

  /**
   * Detach payment method
   * @param paymentMethodId - Payment method ID
   */
  async detachPaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await this.stripe.paymentMethods.detach(paymentMethodId);
      logger.info(`Payment method detached: ${paymentMethodId}`);
    } catch (error) {
      logger.error('Failed to detach payment method:', error);
      throw error;
    }
  }

  /**
   * Get invoices for customer
   * @param customerId - Stripe customer ID
   * @param limit - Number of invoices to retrieve
   * @returns List of invoices
   */
  async getInvoices(customerId: string, limit: number = 10): Promise<Stripe.Invoice[]> {
    try {
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
        limit,
      });
      return invoices.data;
    } catch (error) {
      logger.error('Failed to retrieve invoices:', error);
      throw error;
    }
  }

  /**
   * Get tier features based on subscription
   * @param tier - Subscription tier
   * @returns Feature configuration
   */
  getTierFeatures(tier: SubscriptionTier) {
    const features = {
      [SubscriptionTier.FREE]: {
        maxPosts: 10,
        maxTeamMembers: 1,
        analyticsRetentionDays: 7,
        advancedReports: false,
        apiAccess: false,
        webhooks: false,
        prioritySupport: false,
      },
      [SubscriptionTier.BASIC]: {
        maxPosts: 100,
        maxTeamMembers: 5,
        analyticsRetentionDays: 30,
        advancedReports: false,
        apiAccess: false,
        webhooks: false,
        prioritySupport: false,
      },
      [SubscriptionTier.PRO]: {
        maxPosts: 500,
        maxTeamMembers: 15,
        analyticsRetentionDays: 90,
        advancedReports: true,
        apiAccess: true,
        webhooks: true,
        prioritySupport: false,
      },
      [SubscriptionTier.ENTERPRISE]: {
        maxPosts: -1, // Unlimited
        maxTeamMembers: -1, // Unlimited
        analyticsRetentionDays: 365,
        advancedReports: true,
        apiAccess: true,
        webhooks: true,
        prioritySupport: true,
      },
    };

    return features[tier];
  }

  /**
   * Handle webhook events
   * @param event - Stripe event
   */
  async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoiceFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          logger.info(`Unhandled webhook event: ${event.type}`);
      }
    } catch (error) {
      logger.error('Webhook handling failed:', error);
      throw error;
    }
  }

  /**
   * Handle subscription update webhook
   */
  private async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    // Implementation would update subscription in database
    logger.info(`Subscription updated: ${subscription.id}`);
  }

  /**
   * Handle subscription deleted webhook
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // Implementation would mark subscription as canceled in database
    logger.info(`Subscription deleted: ${subscription.id}`);
  }

  /**
   * Handle invoice paid webhook
   */
  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    // Implementation would record invoice payment in database
    logger.info(`Invoice paid: ${invoice.id}`);
  }

  /**
   * Handle invoice failed webhook
   */
  private async handleInvoiceFailed(invoice: Stripe.Invoice): Promise<void> {
    // Implementation would handle failed payment
    logger.info(`Invoice payment failed: ${invoice.id}`);
  }
}

export default new StripeService();
