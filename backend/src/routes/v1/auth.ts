import express from 'express';
import { validate } from '../../middlewares/validate';
import { loginSchema, registerSchema, registerUser, validateUserPassword, issueTokens } from '../../services/auth.service';
import { signAccessToken, verifyRefreshToken } from '../../utils/jwt';
import { z } from 'zod';
import { UserModel } from '../../models/User';
import { RefreshTokenModel } from '../../models/RefreshToken';
import { authenticator } from 'otplib';
import passport from '../../config/passport';

export const authRouter = express.Router();

authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const user = await registerUser(req.body);
  const safe = { id: user._id, email: user.email, name: user.name, roles: user.roles };
  res.status(201).json(safe);
});

authRouter.post('/login', validate(loginSchema), async (req, res) => {
  const user = await validateUserPassword(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (user.twoFactorEnabled) {
    const token = (req.body as any).twoFactorToken;
    if (!token || !user.twoFactorSecret || !authenticator.check(token, user.twoFactorSecret)) {
      return res.status(401).json({ message: 'Invalid two-factor token' });
    }
  }
  const tokens = await issueTokens(user);
  res.json(tokens);
});

authRouter.post('/refresh', validate(z.object({ refreshToken: z.string() })), async (req, res) => {
  const { refreshToken } = req.body as { refreshToken: string };
  try {
    const { userId } = verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(userId);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });
    const accessToken = signAccessToken({ userId: user._id.toString(), roles: user.roles });
    res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

authRouter.post('/logout', validate(z.object({ tokenId: z.string().min(1) })), async (req, res) => {
  const { tokenId } = req.body;
  await RefreshTokenModel.updateOne({ token: tokenId }, { $set: { revoked: true } });
  res.status(204).send();
});

authRouter.post(
  '/2fa/enable',
  validate(
    z.object({ userId: z.string().length(24) }),
  ),
  async (req, res) => {
    const user = await UserModel.findById(req.body.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'EnterpriseAnalytics', secret);
    user.twoFactorEnabled = true;
    user.twoFactorSecret = secret;
    await user.save();
    res.json({ otpauth });
  },
);

// OAuth2 (Google)
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] } as any));
authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false } as any),
  async (req, res) => {
    const user = req.user as any;
    const tokens = await issueTokens(user);
    res.json(tokens);
  },
);

// OAuth2 (GitHub)
authRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] } as any));
authRouter.get(
  '/github/callback',
  passport.authenticate('github', { session: false } as any),
  async (req, res) => {
    const user = req.user as any;
    const tokens = await issueTokens(user);
    res.json(tokens);
  },
);

authRouter.post(
  '/2fa/verify',
  validate(z.object({ userId: z.string().length(24), token: z.string().min(6) })),
  async (req, res) => {
    const { userId, token } = req.body as { userId: string; token: string };
    const user = await UserModel.findById(userId);
    if (!user || !user.twoFactorSecret) return res.status(400).json({ message: '2FA not enabled' });
    const ok = authenticator.check(token, user.twoFactorSecret);
    if (!ok) return res.status(401).json({ message: 'Invalid token' });
    const accessToken = signAccessToken({ userId: user._id.toString(), roles: user.roles, twoFactorVerified: true });
    res.json({ accessToken });
  },
);
