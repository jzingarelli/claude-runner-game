/**
 * User Controller
 * User management and profile operations
 */

import { Response } from 'express';
import { AuthRequest, PaginationOptions } from '../types';
import User from '../models/User';
import { NotFoundError, AuthorizationError } from '../middleware/errorHandler';
import s3Service from '../services/s3Service';
import logger from '../utils/logger';

/**
 * Get current user profile
 * @route GET /api/v1/users/me
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id);
  
  if (!user) {
    throw new NotFoundError('User');
  }

  res.json({
    success: true,
    data: { user },
  });
};

/**
 * Update user profile
 * @route PUT /api/v1/users/me
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { firstName, lastName, avatar } = req.body;
  
  const user = await User.findById(req.user!.id);
  if (!user) {
    throw new NotFoundError('User');
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (avatar) user.avatar = avatar;

  await user.save();

  logger.info(`User profile updated: ${user.id}`);

  res.json({
    success: true,
    data: { user },
    message: 'Profile updated successfully',
  });
};

/**
 * Upload avatar
 * @route POST /api/v1/users/me/avatar
 */
export const uploadAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  const fileMetadata = await s3Service.uploadFile(
    req.file.buffer,
    req.file.originalname,
    req.file.mimetype,
    req.user!.id
  );

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { avatar: fileMetadata.url },
    { new: true }
  );

  res.json({
    success: true,
    data: { user, file: fileMetadata },
    message: 'Avatar uploaded successfully',
  });
};

/**
 * Update user preferences
 * @route PUT /api/v1/users/me/preferences
 */
export const updatePreferences = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user!.id);
  if (!user) {
    throw new NotFoundError('User');
  }

  const { theme, language, timezone, notifications } = req.body;

  if (theme) user.preferences.theme = theme;
  if (language) user.preferences.language = language;
  if (timezone) user.preferences.timezone = timezone;
  if (notifications) {
    user.preferences.notifications = {
      ...user.preferences.notifications,
      ...notifications,
    };
  }

  await user.save();

  res.json({
    success: true,
    data: { preferences: user.preferences },
    message: 'Preferences updated successfully',
  });
};

/**
 * Change password
 * @route POST /api/v1/users/me/change-password
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user!.id).select('+password');
  if (!user) {
    throw new NotFoundError('User');
  }

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) {
    throw new AuthorizationError('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  logger.info(`Password changed: ${user.id}`);

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
};

/**
 * Get all users (admin only)
 * @route GET /api/v1/users
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const options: PaginationOptions = {
    page: Number(page),
    limit: Number(limit),
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
  };

  const skip = (options.page - 1) * options.limit;
  const sort = { [options.sortBy || 'createdAt']: options.sortOrder === 'asc' ? 1 : -1 };

  const [users, total] = await Promise.all([
    User.find().sort(sort).skip(skip).limit(options.limit),
    User.countDocuments(),
  ]);

  res.json({
    success: true,
    data: { users },
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      pages: Math.ceil(total / options.limit),
      hasNext: skip + users.length < total,
      hasPrev: options.page > 1,
    },
  });
};

/**
 * Get user by ID (admin only)
 * @route GET /api/v1/users/:id
 */
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new NotFoundError('User');
  }

  res.json({
    success: true,
    data: { user },
  });
};

/**
 * Update user (admin only)
 * @route PUT /api/v1/users/:id
 */
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { role, subscriptionTier } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User');
  }

  if (role) user.role = role;
  if (subscriptionTier) user.subscriptionTier = subscriptionTier;

  await user.save();

  logger.info(`User updated by admin: ${user.id}`);

  res.json({
    success: true,
    data: { user },
    message: 'User updated successfully',
  });
};

/**
 * Delete user (admin only)
 * @route DELETE /api/v1/users/:id
 */
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    throw new NotFoundError('User');
  }

  logger.info(`User deleted: ${user.id}`);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
};

export default {
  getProfile,
  updateProfile,
  uploadAvatar,
  updatePreferences,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
