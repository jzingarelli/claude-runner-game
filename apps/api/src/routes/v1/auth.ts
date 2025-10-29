import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { User } from '../../models/User';
import { RefreshToken } from '../../models/RefreshToken';
import { validate } from '../../middleware/validate';
import { env } from '../../config/env';
import { issueTokenPair, rotateRefreshToken } from '../../services/authService';
import { sendEmail } from '../../services/emailService';

export const authRouter = Router();

const registerSchema = z.object({ email: z.string().email(), name: z.string().min(1), password: z.string().min(8) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8), otp: z.string().optional() });

authRouter.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body as z.infer<typeof registerSchema>;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash, roles: ['viewer'] });
    const tokens = await issueTokenPair(user.id);
    res.status(201).json({ user: sanitize(user), tokens });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

authRouter.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password, otp } = req.body as z.infer<typeof loginSchema>;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.twoFactorEnabled) {
    if (!otp) return res.status(401).json({ error: 'OTP required' });
    const valid = authenticator.check(otp, user.twoFactorSecret || '');
    if (!valid) return res.status(401).json({ error: 'Invalid OTP' });
  }
  const tokens = await issueTokenPair(user.id);
  res.json({ user: sanitize(user), tokens });
});

const refreshSchema = z.object({ refreshToken: z.string().min(1) });

authRouter.post('/refresh', validate(refreshSchema), async (req: Request, res: Response) => {
  const { refreshToken } = req.body as z.infer<typeof refreshSchema>;
  const tokens = await rotateRefreshToken(refreshToken);
  if (!tokens) return res.status(401).json({ error: 'Invalid refresh token' });
  res.json(tokens);
});

const requestResetSchema = z.object({ email: z.string().email() });

authRouter.post('/password/request-reset', validate(requestResetSchema), async (req: Request, res: Response) => {
  try {
    const { email } = req.body as z.infer<typeof requestResetSchema>;
    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: true }); // don't reveal existence
    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: '30m' });
    const resetUrl = `${env.PUBLIC_WEB_URL}/reset-password?token=${encodeURIComponent(token)}`;
    await sendEmail(user.email, 'Reset your password', 'password-reset', { name: user.name, resetUrl });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to request reset' });
  }
});

const resetSchema = z.object({ token: z.string(), newPassword: z.string().min(8) });

authRouter.post('/password/reset', validate(resetSchema), async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body as z.infer<typeof resetSchema>;
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
    const user = await User.findById(payload.sub);
    if (!user) return res.status(400).json({ error: 'Invalid token' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    // Invalidate existing refresh tokens
    await RefreshToken.deleteMany({ userId: user.id });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

authRouter.post('/2fa/enable', async (req: Request, res: Response) => {
  // In real flow authenticate user; demo only
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri('user@example.com', 'EnterpriseSocialAnalytics', secret);
  res.json({ secret, otpauth });
});

authRouter.post('/logout', async (req: Request, res: Response) => {
  const auth = req.headers.authorization?.split(' ');
  const token = auth?.[0] === 'Bearer' ? auth[1] : undefined;
  if (token) {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };
      await RefreshToken.deleteMany({ userId: payload.sub });
    } catch {
      // ignore
    }
  }
  res.json({ ok: true });
});

function sanitize(user: any) {
  const obj = user.toObject();
  delete obj.passwordHash;
  return obj;
}
