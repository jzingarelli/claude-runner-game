/**
 * Authentication Routes
 */

import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateSchema, userSchemas } from '../middleware/validator';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register new user
 * @access Public
 */
router.post(
  '/register',
  authLimiter,
  validateSchema(userSchemas.register),
  asyncHandler(authController.register)
);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  authLimiter,
  validateSchema(userSchemas.login),
  asyncHandler(authController.login)
);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', authenticate, asyncHandler(authController.logout));

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post('/refresh', asyncHandler(authController.refreshToken));

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post(
  '/forgot-password',
  passwordResetLimiter,
  asyncHandler(authController.forgotPassword)
);

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password', asyncHandler(authController.resetPassword));

/**
 * @route POST /api/v1/auth/verify-email
 * @desc Verify email address
 * @access Public
 */
router.post('/verify-email', asyncHandler(authController.verifyEmail));

/**
 * @route POST /api/v1/auth/2fa/enable
 * @desc Enable two-factor authentication
 * @access Private
 */
router.post('/2fa/enable', authenticate, asyncHandler(authController.enable2FA));

/**
 * @route POST /api/v1/auth/2fa/verify
 * @desc Verify 2FA token and complete setup
 * @access Private
 */
router.post('/2fa/verify', authenticate, asyncHandler(authController.verify2FA));

/**
 * @route POST /api/v1/auth/2fa/disable
 * @desc Disable two-factor authentication
 * @access Private
 */
router.post('/2fa/disable', authenticate, asyncHandler(authController.disable2FA));

export default router;
