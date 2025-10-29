/**
 * Authentication Controller
 * Handles user authentication, registration, and password management
 */

import { Response } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';
import { generateTokenPair, verifyRefreshToken, storeRefreshToken, removeRefreshToken } from '../utils/jwt';
import { AppError, AuthenticationError } from '../middleware/errorHandler';
import emailService from '../services/emailService';
import queueService from '../services/queueService';
import logger from '../utils/logger';
import crypto from 'crypto';
import speakeasy from 'speakeasy';

/**
 * Register new user
 * @route POST /api/v1/auth/register
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
  }

  // Create user
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
  });

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = verificationToken;
  await user.save();

  // Queue welcome email
  await queueService.addJob('email', {
    type: 'welcome',
    payload: {
      to: user.email,
      data: { name: user.firstName },
    },
  });

  // Queue verification email
  await queueService.addJob('email', {
    type: 'verification',
    payload: {
      to: user.email,
      data: { token: verificationToken },
    },
  });

  // Generate tokens
  const tokens = generateTokenPair(user);
  await storeRefreshToken(user.id, tokens.refreshToken);

  logger.info(`User registered: ${user.id}`);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    },
    message: 'Registration successful. Please check your email to verify your account.',
  });
};

/**
 * Login user
 * @route POST /api/v1/auth/login
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Check if account is locked
  if (user.isLocked()) {
    await emailService.sendAccountLockedEmail(user.email, user.lockUntil!);
    throw new AppError('Account is locked due to too many failed login attempts', 403, 'ACCOUNT_LOCKED');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    await user.incrementLoginAttempts();
    throw new AuthenticationError('Invalid email or password');
  }

  // Reset login attempts
  await user.resetLoginAttempts();

  // Check if 2FA is enabled
  if (user.twoFactorEnabled) {
    // Generate temporary token for 2FA
    const tempToken = crypto.randomBytes(32).toString('hex');
    // Store temp token in cache with 10min expiry
    // Send 2FA required response
    res.json({
      success: true,
      data: {
        requiresTwoFactor: true,
        tempToken,
      },
      message: 'Two-factor authentication required',
    });
    return;
  }

  // Generate tokens
  const tokens = generateTokenPair(user);
  await storeRefreshToken(user.id, tokens.refreshToken);

  logger.info(`User logged in: ${user.id}`);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      tokens,
    },
    message: 'Login successful',
  });
};

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  const refreshToken = req.body.refreshToken;

  if (refreshToken && req.user) {
    await removeRefreshToken(req.user.id, refreshToken);
  }

  logger.info(`User logged out: ${req.user?.id}`);

  res.json({
    success: true,
    message: 'Logout successful',
  });
};

/**
 * Refresh access token
 * @route POST /api/v1/auth/refresh
 */
export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AuthenticationError('Refresh token required');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Get user
  const user = await User.findById(decoded.userId).select('+refreshTokens');
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  // Check if refresh token is valid
  if (!user.refreshTokens.includes(refreshToken)) {
    throw new AuthenticationError('Invalid refresh token');
  }

  // Generate new tokens
  const tokens = generateTokenPair(user);

  // Remove old refresh token and store new one
  await removeRefreshToken(user.id, refreshToken);
  await storeRefreshToken(user.id, tokens.refreshToken);

  res.json({
    success: true,
    data: { tokens },
    message: 'Token refreshed successfully',
  });
};

/**
 * Request password reset
 * @route POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Don't reveal if email exists
    res.json({
      success: true,
      message: 'If an account exists, a password reset email will be sent',
    });
    return;
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  // Queue password reset email
  await queueService.addJob('email', {
    type: 'password_reset',
    payload: {
      to: user.email,
      data: { token: resetToken },
    },
  });

  logger.info(`Password reset requested: ${user.id}`);

  res.json({
    success: true,
    message: 'If an account exists, a password reset email will be sent',
  });
};

/**
 * Reset password
 * @route POST /api/v1/auth/reset-password
 */
export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400, 'INVALID_TOKEN');
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  logger.info(`Password reset: ${user.id}`);

  res.json({
    success: true,
    message: 'Password reset successful',
  });
};

/**
 * Verify email
 * @route POST /api/v1/auth/verify-email
 */
export const verifyEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  const { token } = req.body;

  const user = await User.findOne({ emailVerificationToken: token }).select('+emailVerificationToken');

  if (!user) {
    throw new AppError('Invalid verification token', 400, 'INVALID_TOKEN');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  logger.info(`Email verified: ${user.id}`);

  res.json({
    success: true,
    message: 'Email verified successfully',
  });
};

/**
 * Enable 2FA
 * @route POST /api/v1/auth/2fa/enable
 */
export const enable2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id).select('+twoFactorSecret');
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  // Generate 2FA secret
  const secret = speakeasy.generateSecret({
    name: `Social Analytics (${user.email})`,
    length: 32,
  });

  user.twoFactorSecret = secret.base32;
  await user.save();

  res.json({
    success: true,
    data: {
      secret: secret.base32,
      qrCode: secret.otpauth_url,
    },
    message: 'Scan QR code with your authenticator app',
  });
};

/**
 * Verify 2FA and complete setup
 * @route POST /api/v1/auth/2fa/verify
 */
export const verify2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  const { token } = req.body;

  const user = await User.findById(req.user!.id).select('+twoFactorSecret');
  if (!user || !user.twoFactorSecret) {
    throw new AppError('2FA not initialized', 400, '2FA_NOT_INITIALIZED');
  }

  // Verify token
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!verified) {
    throw new AppError('Invalid 2FA token', 400, 'INVALID_2FA_TOKEN');
  }

  user.twoFactorEnabled = true;
  await user.save();

  logger.info(`2FA enabled: ${user.id}`);

  res.json({
    success: true,
    message: 'Two-factor authentication enabled successfully',
  });
};

/**
 * Disable 2FA
 * @route POST /api/v1/auth/2fa/disable
 */
export const disable2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  const { token } = req.body;

  const user = await User.findById(req.user!.id).select('+twoFactorSecret');
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new AppError('2FA not enabled', 400, '2FA_NOT_ENABLED');
  }

  // Verify token before disabling
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 2,
  });

  if (!verified) {
    throw new AppError('Invalid 2FA token', 400, 'INVALID_2FA_TOKEN');
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save();

  logger.info(`2FA disabled: ${user.id}`);

  res.json({
    success: true,
    message: 'Two-factor authentication disabled successfully',
  });
};

export default {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  enable2FA,
  verify2FA,
  disable2FA,
};
