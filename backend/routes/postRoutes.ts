/**
 * Post Routes
 */

import { Router } from 'express';
import postController from '../controllers/postController';
import { authenticate, requireMinRole } from '../middleware/auth';
import { validateSchema, postSchemas } from '../middleware/validator';
import { asyncHandler } from '../middleware/errorHandler';
import { UserRole } from '../types';

const router = Router();

/**
 * @route POST /api/v1/posts
 * @desc Create new post
 * @access Private
 */
router.post(
  '/',
  authenticate,
  requireMinRole(UserRole.EDITOR),
  validateSchema(postSchemas.create),
  asyncHandler(postController.createPost)
);

/**
 * @route GET /api/v1/posts
 * @desc Get all posts for current user
 * @access Private
 */
router.get('/', authenticate, asyncHandler(postController.getAllPosts));

/**
 * @route GET /api/v1/posts/:id
 * @desc Get post by ID
 * @access Private
 */
router.get('/:id', authenticate, asyncHandler(postController.getPostById));

/**
 * @route PUT /api/v1/posts/:id
 * @desc Update post
 * @access Private
 */
router.put(
  '/:id',
  authenticate,
  requireMinRole(UserRole.EDITOR),
  validateSchema(postSchemas.update),
  asyncHandler(postController.updatePost)
);

/**
 * @route DELETE /api/v1/posts/:id
 * @desc Delete post
 * @access Private
 */
router.delete(
  '/:id',
  authenticate,
  requireMinRole(UserRole.EDITOR),
  asyncHandler(postController.deletePost)
);

/**
 * @route GET /api/v1/posts/:id/analytics
 * @desc Get post analytics
 * @access Private
 */
router.get('/:id/analytics', authenticate, asyncHandler(postController.getPostAnalytics));

/**
 * @route POST /api/v1/posts/:id/publish
 * @desc Publish post
 * @access Private
 */
router.post(
  '/:id/publish',
  authenticate,
  requireMinRole(UserRole.EDITOR),
  asyncHandler(postController.publishPost)
);

export default router;
