import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { Pool, PoolClient } from 'pg';
import { AuthUser, Order, OrderStatus, Product } from './types.js';

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;
const getPool = () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diatur.');
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'false' ? undefined : { rejectUnauthorized: false } });
  return pool;
};

export const initializePostgres = async () => {
  if (!schemaReady) {
    schemaReady = getPool().query(`
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('admin', 'user')));
      CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, product_data JSONB NOT NULL);
      CREATE TABLE IF NOT EXISTS cart_items (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE, payment_type TEXT NOT NULL CHECK (payment_type IN ('full', 'dp')), quantity INTEGER NOT NULL CHECK (quantity > 0), PRIMARY KEY (user_id, product_id, payment_type));
      CREATE TABLE IF NOT EXISTS wishlist_items (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL, PRIMARY KEY (user_id, product_id));
      CREATE TABLE IF NOT EXISTS voucher_claims (user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, voucher_id TEXT NOT NULL, claimed_at TIMESTAMPTZ NOT NULL, PRIMARY KEY (user_id, voucher_id));
      CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), status TEXT NOT NULL CHECK (status IN ('processing', 'shipped', 'delivered')), created_at TIMESTAMPTZ NOT NULL, order_data JSONB NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL);
      CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
      CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
    `).then(() => undefined).catch(error => { schemaReady = undefined; throw error; });
  }
  await schemaReady;
};

const withTransaction = async <T>(run: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await getPool().connect();
  try { await client.query('BEGIN'); const result = await run(client); await client.query('COMMIT'); return result; }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
};
const publicUser = (row: { id: string; name: string; email: string; role: AuthUser['role'] }): AuthUser => ({ id: row.id, name: row.name, email: row.email, role: row.role });

export const findUser = async (email: string, password: string, role?: string): Promise<AuthUser | undefined> => {
  const { rows } = await getPool().query('SELECT id, name, email, role, password_hash FROM users WHERE lower(email) = lower($1) AND ($2::text IS NULL OR role = $2)', [email, role || null]);
  const row = rows[0] as ({ id: string; name: string; email: string; role: AuthUser['role']; password_hash: string } | undefined);
  return row && await bcrypt.compare(password, row.password_hash) ? publicUser(row) : undefined;
};
export const findUserByEmail = async (email: string): Promise<AuthUser | undefined> => {
  const { rows } = await getPool().query('SELECT id, name, email, role FROM users WHERE lower(email) = lower($1)', [email]);
  return rows[0] ? publicUser(rows[0]) : undefined;
};
export const registerUser = async (name: string, email: string, password: string): Promise<AuthUser> => {
  const user = { id: randomUUID(), name, email, role: 'user' as const };
  await getPool().query('INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)', [user.id, user.name, user.email, await bcrypt.hash(password, 12), user.role]);
  return user;
};
export const createSession = async (token: string, userId: string) => {
  await getPool().query("INSERT INTO sessions (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 days')", [token, userId]);
};
export const getSessionUser = async (token: string): Promise<AuthUser | undefined> => {
  const { rows } = await getPool().query('SELECT users.id, users.name, users.email, users.role FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = $1 AND sessions.expires_at > NOW()', [token]);
  return rows[0] ? publicUser(rows[0]) : undefined;
};

export interface ProductFilters { search?: string; status?: string; category?: string; sort?: string; }
export const listProducts = async (filters: ProductFilters = {}): Promise<Product[]> => {
  const { rows } = await getPool().query('SELECT product_data FROM products');
  const query = filters.search?.trim().toLowerCase();
  return (rows as Array<{ product_data: Product }>).map(row => row.product_data).filter(product => {
    if (filters.status && ['ready', 'preorder', 'promo'].includes(filters.status) && product.status !== filters.status) return false;
    if (filters.category && product.category !== filters.category) return false;
    return !query || [product.title, product.series, product.manufacturer, product.categoryName, product.description].some(value => value.toLowerCase().includes(query));
  }).sort((a, b) => filters.sort === 'price-asc' ? a.price - b.price : filters.sort === 'price-desc' ? b.price - a.price : filters.sort === 'bestseller' ? b.soldCount - a.soldCount : (b.rating * b.soldCount) - (a.rating * a.soldCount));
};
export const getProduct = async (id: string): Promise<Product | undefined> => {
  const { rows } = await getPool().query('SELECT product_data FROM products WHERE id = $1', [id]);
  return rows[0]?.product_data as Product | undefined;
};
export const createProduct = async (product: Product): Promise<Product> => {
  await getPool().query('INSERT INTO products (id, product_data) VALUES ($1, $2::jsonb)', [product.id, JSON.stringify(product)]);
  return product;
};
export const updateProduct = async (id: string, changes: Partial<Product>): Promise<Product | undefined> => withTransaction(async client => {
  const { rows } = await client.query('SELECT product_data FROM products WHERE id = $1 FOR UPDATE', [id]);
  if (!rows[0]) return undefined;
  const product = { ...(rows[0].product_data as Product), ...changes, id };
  await client.query('UPDATE products SET product_data = $2::jsonb WHERE id = $1', [id, JSON.stringify(product)]);
  return product;
});
export const removeProduct = async (id: string): Promise<Product | undefined> => withTransaction(async client => {
  const { rows } = await client.query('DELETE FROM products WHERE id = $1 RETURNING product_data', [id]);
  return rows[0]?.product_data as Product | undefined;
});

export const listCart = async (userId: string) => {
  const { rows } = await getPool().query('SELECT products.product_data AS product, cart_items.quantity, cart_items.payment_type FROM cart_items JOIN products ON products.id = cart_items.product_id WHERE cart_items.user_id = $1', [userId]);
  return rows.map(row => ({ product: row.product as Product, quantity: row.quantity as number, isPreOrderPaymentType: row.payment_type as 'full' | 'dp' }));
};
export const saveCartItem = async (userId: string, productId: string, quantity: number, paymentType: 'full' | 'dp' = 'full') => {
  if (!(await getProduct(productId))) return [];
  if (quantity <= 0) await getPool().query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND payment_type = $3', [userId, productId, paymentType]);
  else await getPool().query('INSERT INTO cart_items (user_id, product_id, payment_type, quantity) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, product_id, payment_type) DO UPDATE SET quantity = EXCLUDED.quantity', [userId, productId, paymentType, quantity]);
  return listCart(userId);
};
export const clearCart = async (userId: string) => { await getPool().query('DELETE FROM cart_items WHERE user_id = $1', [userId]); return []; };
export const listWishlist = async (userId: string): Promise<Product[]> => {
  const { rows } = await getPool().query('SELECT products.product_data AS product FROM wishlist_items JOIN products ON products.id = wishlist_items.product_id WHERE wishlist_items.user_id = $1 ORDER BY wishlist_items.created_at DESC', [userId]);
  return rows.map(row => row.product as Product);
};
export const toggleWishlist = async (userId: string, productId: string): Promise<Product[]> => {
  const deleted = await getPool().query('DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2 RETURNING product_id', [userId, productId]);
  if (!deleted.rowCount && await getProduct(productId)) await getPool().query('INSERT INTO wishlist_items (user_id, product_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING', [userId, productId]);
  return listWishlist(userId);
};

export const createOrder = async (order: Order): Promise<Order | undefined> => withTransaction(async client => {
  const quantities = new Map<string, number>();
  for (const item of order.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) return undefined;
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
  }
  const { rows } = await client.query('SELECT id, product_data FROM products WHERE id = ANY($1::text[]) FOR UPDATE', [[...quantities.keys()]]);
  const products = new Map<string, Product>(rows.map(row => [row.id as string, row.product_data as Product]));
  for (const [id, quantity] of quantities) {
    const product = products.get(id);
    if (!product || !Number.isInteger(product.stock) || product.stock < quantity) return undefined;
  }
  for (const [id, quantity] of quantities) {
    const product = products.get(id)!;
    product.stock -= quantity;
    await client.query('UPDATE products SET product_data = $2::jsonb WHERE id = $1', [id, JSON.stringify(product)]);
  }
  await client.query('INSERT INTO orders (id, user_id, status, created_at, order_data) VALUES ($1, $2, $3, $4, $5::jsonb)', [order.id, order.userId, order.status, order.createdAt, JSON.stringify(order)]);
  return order;
});
export const listAllOrders = async (filters?: { status?: OrderStatus }): Promise<Order[]> => {
  const { rows } = filters?.status ? await getPool().query('SELECT order_data FROM orders WHERE status = $1 ORDER BY created_at DESC', [filters.status]) : await getPool().query('SELECT order_data FROM orders ORDER BY created_at DESC');
  return rows.map(row => row.order_data as Order);
};
export const listUserOrders = async (userId: string): Promise<Order[]> => {
  const { rows } = await getPool().query('SELECT order_data FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return rows.map(row => row.order_data as Order);
};
export const getOrder = async (id: string): Promise<Order | undefined> => {
  const { rows } = await getPool().query('SELECT order_data FROM orders WHERE id = $1', [id]);
  return rows[0]?.order_data as Order | undefined;
};
export const updateOrderStatus = async (id: string, status: OrderStatus, trackingNumber?: string, notes?: string): Promise<Order | undefined> => withTransaction(async client => {
  const { rows } = await client.query('SELECT order_data FROM orders WHERE id = $1 FOR UPDATE', [id]);
  if (!rows[0]) return undefined;
  const order = rows[0].order_data as Order;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (status === 'shipped') { order.shippedAt = order.updatedAt; order.trackingNumber = trackingNumber || `AMA-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`; }
  else if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (status === 'delivered') order.deliveredAt = order.updatedAt;
  if (notes !== undefined) order.notes = notes;
  await client.query('UPDATE orders SET status = $2, order_data = $3::jsonb WHERE id = $1', [id, status, JSON.stringify(order)]);
  return order;
});
export const countOrders = async () => {
  const { rows } = await getPool().query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'processing')::int AS processing, COUNT(*) FILTER (WHERE status = 'shipped')::int AS shipped, COUNT(*) FILTER (WHERE status = 'delivered')::int AS delivered FROM orders");
  return rows[0] as { total: number; processing: number; shipped: number; delivered: number };
};

export const getDatabaseCounts = async () => {
  const { rows } = await getPool().query(`
    SELECT
      (SELECT COUNT(*) FROM users)::int AS users,
      (SELECT COUNT(*) FROM products)::int AS products,
      (SELECT COUNT(*) FROM cart_items)::int AS cart_items,
      (SELECT COUNT(*) FROM wishlist_items)::int AS wishlist_items,
      (SELECT COUNT(*) FROM voucher_claims)::int AS voucher_claims,
      (SELECT COUNT(*) FROM orders)::int AS orders
  `);
  return rows[0] as Record<string, number>;
};

export const closePostgres = async () => {
  await pool?.end();
  pool = undefined;
  schemaReady = undefined;
};

export const importJsonData = async (data: {
  users: Array<AuthUser & { password: string }>;
  products: Product[];
  cartItems: Array<{ userId: string; productId: string; quantity: number; paymentType: 'full' | 'dp' }>;
  wishlistItems: Array<{ userId: string; productId: string; createdAt: string }>;
  voucherClaims: Array<{ userId: string; voucherId: string; claimedAt: string }>;
  orders: Order[];
}) => withTransaction(async client => {
  for (const user of data.users) {
    const hash = await bcrypt.hash(user.password, 12);
    await client.query('INSERT INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role', [user.id, user.name, user.email, hash, user.role]);
  }
  for (const product of data.products) await client.query('INSERT INTO products (id, product_data) VALUES ($1, $2::jsonb) ON CONFLICT (id) DO UPDATE SET product_data = EXCLUDED.product_data', [product.id, JSON.stringify(product)]);
  for (const item of data.cartItems) await client.query('INSERT INTO cart_items (user_id, product_id, payment_type, quantity) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, product_id, payment_type) DO UPDATE SET quantity = EXCLUDED.quantity', [item.userId, item.productId, item.paymentType, item.quantity]);
  for (const item of data.wishlistItems) await client.query('INSERT INTO wishlist_items (user_id, product_id, created_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [item.userId, item.productId, item.createdAt]);
  for (const item of data.voucherClaims) await client.query('INSERT INTO voucher_claims (user_id, voucher_id, claimed_at) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [item.userId, item.voucherId, item.claimedAt]);
  for (const order of data.orders) await client.query('INSERT INTO orders (id, user_id, status, created_at, order_data) VALUES ($1, $2, $3, $4, $5::jsonb) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, order_data = EXCLUDED.order_data', [order.id, order.userId, order.status, order.createdAt, JSON.stringify(order)]);
});
