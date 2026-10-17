import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { clearCart, listCart, saveCartItem } from '../data-store.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth());

router.get('/', asyncHandler(async (req, res) => res.json(await listCart((req as AuthenticatedRequest).user!.id))));

router.put('/', asyncHandler(async (req, res) => {
  const { productId, quantity, paymentType = 'full' } = req.body as { productId?: string; quantity?: number; paymentType?: 'full' | 'dp' };
  if (!productId || !Number.isInteger(quantity) || (quantity as number) < 0 || !['full', 'dp'].includes(paymentType)) {
    return res.status(400).json({ message: 'productId, quantity, dan paymentType tidak valid.' });
  }
  const cart = await saveCartItem((req as AuthenticatedRequest).user!.id, productId, quantity as number, paymentType);
  if (!cart.length && quantity > 0) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
  res.json(cart);
}));

router.delete('/', asyncHandler(async (req, res) => res.json(await clearCart((req as AuthenticatedRequest).user!.id))));

export default router;