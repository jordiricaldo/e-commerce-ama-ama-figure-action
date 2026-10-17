import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { asyncHandler } from '../middleware/async-handler.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { OrderStatus } from '../types.js';
import { createOrder, listAllOrders, listUserOrders, getOrder, updateOrderStatus, countOrders } from '../data-store.js';

const router = Router();

// Create a new order (authenticated user)
router.post('/', requireAuth(), asyncHandler(async (req, res) => {
  const user = (req as AuthenticatedRequest).user!;
  const { items, subtotal, discount, shippingFee, grandTotal } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Pesanan harus memiliki minimal 1 item.' });
  }

  const order = await createOrder({
    id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    orderNumber: `AMA-${Math.floor(100000 + Math.random() * 900000)}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    items,
    subtotal: subtotal || 0,
    discount: discount || 0,
    shippingFee: shippingFee || 0,
    grandTotal: grandTotal || 0,
    status: 'processing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  if (!order) {
    return res.status(409).json({ message: 'Stok produk tidak mencukupi atau produk sudah tidak tersedia.' });
  }

  res.status(201).json(order);
}));

// Get all orders (admin only)
router.get('/all', requireAuth('admin'), asyncHandler(async (req, res) => {
  const status = req.query.status as OrderStatus | undefined;
  const orders = await listAllOrders(status ? { status } : undefined);
  res.json(orders);
}));

// Get order stats (admin only)
router.get('/stats', requireAuth('admin'), asyncHandler(async (_req, res) => res.json(await countOrders())));

// Get current user's orders
router.get('/my', requireAuth(), asyncHandler(async (req, res) => {
  const user = (req as AuthenticatedRequest).user!;
  const orders = await listUserOrders(user.id);
  res.json(orders);
}));

// Get single order
router.get('/:id', requireAuth(), asyncHandler(async (req, res) => {
  const order = await getOrder(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
  res.json(order);
}));

// Update order status (admin only)
router.patch('/:id/status', requireAuth('admin'), asyncHandler(async (req, res) => {
  const { status, trackingNumber, notes } = req.body as { status?: OrderStatus; trackingNumber?: string; notes?: string };
  if (!status || !['processing', 'shipped', 'delivered'].includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid. Gunakan: processing, shipped, atau delivered.' });
  }
  const order = await updateOrderStatus(req.params.id, status, trackingNumber, notes);
  if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
  res.json(order);
}));

export default router;
