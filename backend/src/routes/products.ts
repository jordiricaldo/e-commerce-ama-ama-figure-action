import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { createProduct, listProducts, removeProduct, updateProduct } from '../data-store.js';
import { requireAuth } from '../middleware/auth.js';
import { Product } from '../types.js';

const router = Router();
router.get('/', asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.json(await listProducts({ search: req.query.search as string, status: req.query.status as string, category: req.query.category as string, sort: req.query.sort as string }));
}));

router.post('/', requireAuth('admin'), asyncHandler(async (req, res) => {
  const item = req.body as Product;
  if (!item.title || !item.series || !item.manufacturer || !item.description || !item.price) {
    return res.status(400).json({ message: 'Field produk wajib belum lengkap.' });
  }
  const created = await createProduct({ ...item, id: item.id || `prod-${Date.now()}` });
  res.status(201).json(created);
}));

router.put('/:id', requireAuth('admin'), asyncHandler(async (req, res) => {
  const changes = req.body as Partial<Product>;
  if (changes.stock !== undefined && (typeof changes.stock !== 'number' || !Number.isInteger(changes.stock) || changes.stock < 0)) {
    return res.status(400).json({ message: 'Stok harus berupa bilangan bulat nol atau lebih.' });
  }
  const updated = await updateProduct(req.params.id, changes);
  if (!updated) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  res.json(updated);
}));

router.delete('/:id', requireAuth('admin'), asyncHandler(async (req, res) => {
  const deleted = await removeProduct(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  res.json(deleted);
}));

export default router;