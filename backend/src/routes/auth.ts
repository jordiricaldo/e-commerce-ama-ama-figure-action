import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { tokens } from '../middleware/auth.js';
import { Role } from '../types.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { createSession, findUser, findUserByEmail, registerUser } from '../data-store.js';

const router = Router();

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password, role } = req.body as { email?: string; password?: string; role?: Role };
  const user = email && password ? await findUser(email, password, role) : undefined;
  if (!user) return res.status(401).json({ message: 'Email atau password salah.' });
  const token = randomUUID();
  tokens.set(token, user);
  await createSession(token, user.id);
  res.json({ token, user });
}));

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter.' });
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'Email sudah terdaftar. Gunakan email lain atau langsung login.' });
  }
  const user = await registerUser(name.trim(), email.trim(), password);
  const token = randomUUID();
  tokens.set(token, user);
  await createSession(token, user.id);
  res.status(201).json({ token, user });
}));

export default router;