import jwt from 'jsonwebtoken';
import { addMinutes, addDays } from 'date-fns';
import { env } from '../config/env';
import { RefreshToken } from '../models/RefreshToken';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export function signAccessToken(userId: string): { token: string; expiresAt: Date } {
  const expiresAt = addMinutes(new Date(), env.ACCESS_TOKEN_TTL_MINUTES);
  const token = jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: `${env.ACCESS_TOKEN_TTL_MINUTES}m` });
  return { token, expiresAt };
}

export async function issueTokenPair(userId: string): Promise<TokenPair> {
  const { token: accessToken, expiresAt: accessTokenExpiresAt } = signAccessToken(userId);
  const refreshToken = jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` });
  const refreshTokenExpiresAt = addDays(new Date(), env.REFRESH_TOKEN_TTL_DAYS);
  await RefreshToken.create({ userId, token: refreshToken, expiresAt: refreshTokenExpiresAt });
  return { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt };
}

export async function rotateRefreshToken(token: string): Promise<TokenPair | null> {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
    const stored = await RefreshToken.findOneAndDelete({ token });
    if (!stored) return null;
    return issueTokenPair(payload.sub);
  } catch {
    return null;
  }
}
