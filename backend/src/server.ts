import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import orderRoutes from './routes/orders.js';
import path from 'node:path';
import { initializeDatabase } from './data-store.js';

const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || 4000);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));
app.use('/product-images', express.static(path.resolve(process.cwd(), 'src/assets/images')));
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
	res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

void initializeDatabase().then(() => {
	app.listen(port, () => console.log(`AMA-AMA API running at http://localhost:${port}`));
}).catch(error => {
	console.error('Database initialization failed:', error);
	process.exitCode = 1;
});

export default app;
