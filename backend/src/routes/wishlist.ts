import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { listWishlist, toggleWishlist } from '../data-store.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth());

router.get('/', asyncHandler(async (req, res) => res.json(await listWishlist((req as AuthenticatedRequest).user!.id))));
router.post('/:productId/toggle', asyncHandler(async (req, res) => res.json(await toggleWishlist((req as AuthenticatedRequest).user!.id, req.params.productId))));

export default router;