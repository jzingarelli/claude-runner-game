/**
 * User Routes
 */

import { Router } from 'express';
import userController from '../controllers/userController';
import { authenticate, requireRole, requireMinRole } from '../middleware/auth';
import { validateSchema, userSchemas } from '../middleware/validator';
import { uploadLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../middleware/errorHandler';
import { UserRole } from '../types';

const router = Router();

/**
 * @route GET /api/v1/users/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, asyncHandler(userController.getProfile));

/**
 * @route PUT /api/v1/users/me
 * @desc Update current user profile
 * @access Private
 */
router.put(
  '/me',
  authenticate,
  validateSchema(userSchemas.updateProfile),
  asyncHandler(userController.updateProfile)
);

/**
 * @route POST /api/v1/users/me/avatar
 * @desc Upload avatar
 * @access Private
 */
router.post(
  '/me/avatar',
  authenticate,
  uploadLimiter,
  asyncHandler(userController.uploadAvatar)
);

/**
 * @route PUT /api/v1/users/me/preferences
 * @desc Update user preferences
 * @access Private
 */
router.put('/me/preferences', authenticate, asyncHandler(userController.updatePreferences));

/**
 * @route POST /api/v1/users/me/change-password
 * @desc Change password
 * @access Private
 */
router.post(
  '/me/change-password',
  authenticate,
  validateSchema(userSchemas.changePassword),
  asyncHandler(userController.changePassword)
);

/**
 * @route GET /api/v1/users
 * @desc Get all users (admin only)
 * @access Private/Admin
 */
router.get(
  '/',
  authenticate,
  requireMinRole(UserRole.ADMIN),
  asyncHandler(userController.getAllUsers)
);

/**
 * @route GET /api/v1/users/:id
 * @desc Get user by ID (admin only)
 * @access Private/Admin
 */
router.get(
  '/:id',
  authenticate,
  requireMinRole(UserRole.ADMIN),
  asyncHandler(userController.getUserById)
);

/**
 * @route PUT /api/v1/users/:id
 * @desc Update user (admin only)
 * @access Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  requireMinRole(UserRole.ADMIN),
  asyncHandler(userController.updateUser)
);

/**
 * @route DELETE /api/v1/users/:id
 * @desc Delete user (admin only)
 * @access Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  requireRole(UserRole.SUPER_ADMIN),
  asyncHandler(userController.deleteUser)
);

export default router;
