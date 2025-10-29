/**
 * Email Service
 * Handles all email operations with templating
 */

import nodemailer, { Transporter } from 'nodemailer';
import { EmailTemplateData } from '../types';
import logger from '../utils/logger';

/**
 * Email service class
 */
class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify connection
    this.verifyConnection();
  }

  /**
   * Verify SMTP connection
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      logger.info('Email service connected successfully');
    } catch (error) {
      logger.error('Email service connection failed:', error);
    }
  }

  /**
   * Send email
   */
  async sendMail(to: string, subject: string, html: string, text?: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@socialmediaanalytics.com',
        to,
        subject,
        text: text || '',
        html,
      });
      logger.info(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const subject = 'Welcome to Social Media Analytics Platform!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome, ${name}!</h1>
        <p>Thank you for joining Social Media Analytics Platform.</p>
        <p>You can now start analyzing your social media performance and gain valuable insights.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.APP_URL}/dashboard" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Get Started
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you have any questions, feel free to contact our support team.
        </p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    const subject = 'Verify Your Email Address';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Email Verification</h1>
        <p>Please click the button below to verify your email address:</p>
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 24 hours.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
    const subject = 'Reset Your Password';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't request a password reset, please ignore this email or contact support if you're concerned.
        </p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  /**
   * Send 2FA code email
   */
  async send2FACode(email: string, code: string): Promise<void> {
    const subject = 'Your Two-Factor Authentication Code';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Two-Factor Authentication</h1>
        <p>Your authentication code is:</p>
        <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; text-align: center;">
          <h2 style="color: #333; font-size: 32px; letter-spacing: 4px; margin: 0;">${code}</h2>
        </div>
        <p style="color: #666; font-size: 14px;">
          This code will expire in 10 minutes.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you didn't request this code, please secure your account immediately.
        </p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  /**
   * Send report ready notification
   */
  async sendReportReadyEmail(email: string, reportName: string, downloadUrl: string): Promise<void> {
    const subject = `Your Report "${reportName}" is Ready`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Report Ready for Download</h1>
        <p>Your report "<strong>${reportName}</strong>" has been generated and is ready for download.</p>
        <div style="margin: 30px 0;">
          <a href="${downloadUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Download Report
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This download link will expire in 7 days.
        </p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  /**
   * Send team invitation email
   */
  async sendTeamInvitation(email: string, teamName: string, inviterName: string, inviteUrl: string): Promise<void> {
    const subject = `You've been invited to join ${teamName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Team Invitation</h1>
        <p><strong>${inviterName}</strong> has invited you to join the team "<strong>${teamName}</strong>" on Social Media Analytics Platform.</p>
        <div style="margin: 30px 0;">
          <a href="${inviteUrl}" 
             style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Accept Invitation
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This invitation will expire in 7 days.
        </p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  /**
   * Send subscription confirmation email
   */
  async sendSubscriptionConfirmation(email: string, tier: string, amount: number): Promise<void> {
    const subject = 'Subscription Confirmed';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Subscription Confirmed</h1>
        <p>Thank you for subscribing to our <strong>${tier}</strong> plan!</p>
        <p>You will be charged <strong>$${(amount / 100).toFixed(2)}</strong> per month.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.APP_URL}/billing" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Manage Subscription
          </a>
        </div>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  /**
   * Send scheduled report email
   */
  async sendScheduledReport(email: string, reportName: string, attachments: Array<{ filename: string; path: string }>): Promise<void> {
    const subject = `Scheduled Report: ${reportName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Scheduled Report</h1>
        <p>Your scheduled report "<strong>${reportName}</strong>" is attached.</p>
        <p style="color: #666; font-size: 14px;">
          This report was automatically generated based on your schedule settings.
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@socialmediaanalytics.com',
        to: email,
        subject,
        html,
        attachments,
      });
      logger.info(`Scheduled report email sent to ${email}`);
    } catch (error) {
      logger.error('Failed to send scheduled report email:', error);
      throw error;
    }
  }

  /**
   * Send account locked notification
   */
  async sendAccountLockedEmail(email: string, unlockTime: Date): Promise<void> {
    const subject = 'Account Temporarily Locked';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f44336;">Account Locked</h1>
        <p>Your account has been temporarily locked due to multiple failed login attempts.</p>
        <p>Your account will be automatically unlocked at: <strong>${unlockTime.toLocaleString()}</strong></p>
        <p style="color: #666; font-size: 14px;">
          If you didn't attempt to log in, please contact support immediately.
        </p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }

  /**
   * Send data export ready email
   */
  async sendDataExportReady(email: string, downloadUrl: string): Promise<void> {
    const subject = 'Your Data Export is Ready';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Data Export Ready</h1>
        <p>Your requested data export is ready for download.</p>
        <div style="margin: 30px 0;">
          <a href="${downloadUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Download Export
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This download link will expire in 24 hours.
        </p>
      </div>
    `;
    await this.sendMail(email, subject, html);
  }
}

export default new EmailService();
