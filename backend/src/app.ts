import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { initializeDatabase } from './data-store.js';
import { asyncHandler } from './middleware/async-handler.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import orderRoutes from './routes/orders.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));
app.use('/product-images', express.static(path.resolve(process.cwd(), 'src/assets/images')));
app.use('/api', asyncHandler(async (_req, _res, next) => {
  await initializeDatabase();
  next();
}));
app.get('/', (_req, res) => res.json({
  name: 'AMA-AMA API',
  status: 'ok',
  endpoints: ['/api/health', '/api/products', '/api/auth/login', '/api/auth/register', '/api/orders'],
}));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan.' }));
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API request failed:', error);
  const message = error instanceof Error ? error.message : '';
  if (message === 'DATABASE_URL wajib diatur pada Environment Variables Vercel.') {
    res.status(503).json({ message });
    return;
  }
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

export default app;
