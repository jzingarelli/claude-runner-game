/**
 * Post Controller
 * Social media post management
 */

import { Response } from 'express';
import { AuthRequest } from '../types';
import Post from '../models/Post';
import { NotFoundError, AuthorizationError } from '../middleware/errorHandler';
import logger from '../utils/logger';

/**
 * Create post
 * @route POST /api/v1/posts
 */
export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const { content, platforms, scheduledFor, tags, media } = req.body;

  const post = await Post.create({
    userId: req.user!.id,
    teamId: req.user!.teamId,
    content,
    platforms,
    scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
    tags,
    media,
    status: scheduledFor ? 'scheduled' : 'draft',
  });

  logger.info(`Post created: ${post.id}`);

  res.status(201).json({
    success: true,
    data: { post },
    message: 'Post created successfully',
  });
};

/**
 * Get all posts
 * @route GET /api/v1/posts
 */
export const getAllPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, status, platform } = req.query;

  const query: any = { userId: req.user!.id };
  if (status) query.status = status;
  if (platform) query['platforms.platform'] = platform;

  const skip = (Number(page) - 1) * Number(limit);

  const [posts, total] = await Promise.all([
    Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Post.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: { posts },
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
      hasNext: skip + posts.length < total,
      hasPrev: Number(page) > 1,
    },
  });
};

/**
 * Get post by ID
 * @route GET /api/v1/posts/:id
 */
export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    throw new NotFoundError('Post');
  }

  if (post.userId.toString() !== req.user!.id) {
    throw new AuthorizationError();
  }

  res.json({
    success: true,
    data: { post },
  });
};

/**
 * Update post
 * @route PUT /api/v1/posts/:id
 */
export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    throw new NotFoundError('Post');
  }

  if (!post.canEdit(req.user!.id)) {
    throw new AuthorizationError();
  }

  const { content, status, scheduledFor, tags, media } = req.body;

  if (content) post.content = content;
  if (status) post.status = status;
  if (scheduledFor) post.scheduledFor = new Date(scheduledFor);
  if (tags) post.tags = tags;
  if (media) post.media = media;

  post.metadata.version += 1;
  await post.save();

  logger.info(`Post updated: ${post.id}`);

  res.json({
    success: true,
    data: { post },
    message: 'Post updated successfully',
  });
};

/**
 * Delete post
 * @route DELETE /api/v1/posts/:id
 */
export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    throw new NotFoundError('Post');
  }

  if (!post.canEdit(req.user!.id)) {
    throw new AuthorizationError();
  }

  await post.deleteOne();

  logger.info(`Post deleted: ${post.id}`);

  res.json({
    success: true,
    message: 'Post deleted successfully',
  });
};

/**
 * Get post analytics
 * @route GET /api/v1/posts/:id/analytics
 */
export const getPostAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    throw new NotFoundError('Post');
  }

  if (post.userId.toString() !== req.user!.id) {
    throw new AuthorizationError();
  }

  res.json({
    success: true,
    data: { analytics: post.analytics },
  });
};

/**
 * Publish post
 * @route POST /api/v1/posts/:id/publish
 */
export const publishPost = async (req: AuthRequest, res: Response): Promise<void> => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    throw new NotFoundError('Post');
  }

  if (!post.canEdit(req.user!.id)) {
    throw new AuthorizationError();
  }

  post.status = 'published';
  post.publishedAt = new Date();
  await post.save();

  logger.info(`Post published: ${post.id}`);

  res.json({
    success: true,
    data: { post },
    message: 'Post published successfully',
  });
};

export default {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostAnalytics,
  publishPost,
};
