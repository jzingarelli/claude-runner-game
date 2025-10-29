import { Router, Request, Response } from 'express';
import { User } from '../../models/User';
import { hashPassword, verifyPassword, signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/security';
import { v4 as uuid } from 'uuid';
import speakeasy from 'speakeasy';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) return res.status(400).json({ error: { message: 'Invalid input' } });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: { message: 'Email already in use' } });
  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, name, passwordHash, role: 'viewer' });
  const access = signAccessToken({ sub: user.id, role: user.role });
  const refresh = signRefreshToken({ sub: user.id, role: user.role });
  return res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens: { access, refresh } });
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: { message: 'Invalid input' } });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: { message: 'Invalid credentials' } });
  const access = signAccessToken({ sub: user.id, role: user.role });
  const refresh = signRefreshToken({ sub: user.id, role: user.role });
  return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, tokens: { access, refresh } });
});

authRouter.post('/token', async (req: Request, res: Response) => {
  const { refresh } = req.body;
  if (!refresh) return res.status(400).json({ error: { message: 'No token' } });
  try {
    const payload = verifyRefreshToken(refresh);
    const access = signAccessToken({ sub: payload.sub, role: payload.role });
    return res.json({ access });
  } catch {
    return res.status(401).json({ error: { message: 'Invalid token' } });
  }
});

authRouter.post('/password/reset/request', async (req: Request, res: Response) => {
  // In a full implementation, issue email with token stored in DB; simplified here
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: { message: 'Email required' } });
  const token = uuid();
  return res.json({ message: 'Password reset requested', token });
});

authRouter.post('/password/reset/confirm', async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: { message: 'Invalid input' } });
  // Validate token in DB in full impl
  return res.json({ message: 'Password updated' });
});

authRouter.post('/2fa/enable', async (req: Request, res: Response) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  return res.json({ otpauth_url: secret.otpauth_url, base32: secret.base32 });
});

authRouter.post('/2fa/verify', async (req: Request, res: Response) => {
  const { token, secret } = req.body;
  const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token });
  return res.json({ verified });
});
