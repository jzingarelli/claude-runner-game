/**
 * JWT Utility Functions
 * Token generation and verification
 */

import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types';
import User, { IUser } from '../models/User';
import logger from './logger';

/**
 * Generate access token
 * @param user - User document
 * @returns Access token string
 */
export const generateAccessToken = (user: IUser): string => {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'access',
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    issuer: 'social-analytics',
    audience: 'social-analytics-api',
  });
};

/**
 * Generate refresh token
 * @param user - User document
 * @returns Refresh token string
 */
export const generateRefreshToken = (user: IUser): string => {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh',
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'social-analytics',
    audience: 'social-analytics-api',
  });
};

/**
 * Generate both access and refresh tokens
 * @param user - User document
 * @returns Object containing both tokens
 */
export const generateTokenPair = (user: IUser): { accessToken: string; refreshToken: string } => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

/**
 * Verify access token
 * @param token - Token string
 * @returns Decoded token payload
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!, {
      issuer: 'social-analytics',
      audience: 'social-analytics-api',
    }) as TokenPayload;
  } catch (error) {
    logger.error('Access token verification failed:', error);
    throw error;
  }
};

/**
 * Verify refresh token
 * @param token - Token string
 * @returns Decoded token payload
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!, {
      issuer: 'social-analytics',
      audience: 'social-analytics-api',
    }) as TokenPayload;
  } catch (error) {
    logger.error('Refresh token verification failed:', error);
    throw error;
  }
};

/**
 * Store refresh token for user
 * @param userId - User ID
 * @param token - Refresh token
 */
export const storeRefreshToken = async (userId: string, token: string): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { refreshTokens: token },
    });
  } catch (error) {
    logger.error('Failed to store refresh token:', error);
    throw error;
  }
};

/**
 * Remove refresh token for user
 * @param userId - User ID
 * @param token - Refresh token to remove
 */
export const removeRefreshToken = async (userId: string, token: string): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: token },
    });
  } catch (error) {
    logger.error('Failed to remove refresh token:', error);
    throw error;
  }
};

/**
 * Remove all refresh tokens for user (logout from all devices)
 * @param userId - User ID
 */
export const removeAllRefreshTokens = async (userId: string): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  } catch (error) {
    logger.error('Failed to remove all refresh tokens:', error);
    throw error;
  }
};

/**
 * Verify if refresh token is valid and stored
 * @param userId - User ID
 * @param token - Refresh token
 * @returns Boolean indicating validity
 */
export const isRefreshTokenValid = async (userId: string, token: string): Promise<boolean> => {
  try {
    const user = await User.findById(userId).select('+refreshTokens');
    if (!user) return false;

    return user.refreshTokens.includes(token);
  } catch (error) {
    logger.error('Failed to validate refresh token:', error);
    return false;
  }
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  storeRefreshToken,
  removeRefreshToken,
  removeAllRefreshTokens,
  isRefreshTokenValid,
};
