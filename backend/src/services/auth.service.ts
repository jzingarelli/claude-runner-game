import argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { UserModel, type UserDocument } from '../models/User';
import { RefreshTokenModel } from '../models/RefreshToken';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  twoFactorToken: z.string().optional(),
});

export async function registerUser(input: z.infer<typeof registerSchema>): Promise<UserDocument> {
  const passwordHash = await argon2.hash(input.password);
  const user = await UserModel.create({
    email: input.email.toLowerCase(),
    name: input.name,
    passwordHash,
    roles: ['viewer'],
  });
  return user;
}

export async function validateUserPassword(email: string, password: string): Promise<UserDocument | null> {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) return null;
  const ok = await argon2.verify(user.passwordHash, password);
  return ok ? user : null;
}

export async function issueTokens(user: UserDocument) {
  const access = signAccessToken({ userId: user._id.toString(), roles: user.roles });
  const tokenString = nanoid(64);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  await RefreshTokenModel.create({ userId: user._id, token: tokenString, expiresAt });
  const refresh = signRefreshToken({ userId: user._id.toString() });
  return { accessToken: access, refreshToken: refresh, tokenId: tokenString };
}

export async function revokeRefreshToken(userId: string, token: string) {
  await RefreshTokenModel.updateOne({ userId, token }, { $set: { revoked: true } });
}
