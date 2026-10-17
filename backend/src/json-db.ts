import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { products as seedProducts } from './data/products.js';
import { AuthUser, Order, OrderStatus, Product } from './types.js';

export interface StoredCartItem { userId: string; productId: string; quantity: number; paymentType: 'full' | 'dp'; }
interface StoredUser extends AuthUser { password: string; }
interface DatabaseFile {
  users: StoredUser[];
  products: Product[];
  cartItems: StoredCartItem[];
  wishlistItems: Array<{ userId: string; productId: string; createdAt: string }>;
  voucherClaims: Array<{ userId: string; voucherId: string; claimedAt: string }>;
  orders: Order[];
}

const databaseFile = process.env.DB_FILE || path.resolve(process.cwd(), 'backend', 'data', 'database.json');
mkdirSync(path.dirname(databaseFile), { recursive: true });
const defaults = (): DatabaseFile => ({
  users: [
    { id: 'admin-1', name: 'Administrator', email: 'admin@ama-ama.local', password: 'admin123', role: 'admin' },
    { id: 'user-1', name: 'Customer', email: 'user@ama-ama.local', password: 'user123', role: 'user' },
  ], products: seedProducts, cartItems: [], wishlistItems: [], voucherClaims: [], orders: [],
});
const save = (data: DatabaseFile) => writeFileSync(databaseFile, JSON.stringify(data, null, 2), 'utf8');
const load = (): DatabaseFile => {
  if (!existsSync(databaseFile)) { const data = defaults(); save(data); return data; }
  try {
    const parsed = JSON.parse(readFileSync(databaseFile, 'utf8')) as Partial<DatabaseFile>;
    const data = { ...defaults(), ...parsed, users: parsed.users?.length ? parsed.users : defaults().users, products: parsed.products || [], cartItems: parsed.cartItems || [], wishlistItems: parsed.wishlistItems || [], voucherClaims: parsed.voucherClaims || [], orders: parsed.orders || [] };
    let changed = false;
    for (const seed of seedProducts) if (!data.products.some(product => product.id === seed.id)) { data.products.push(seed); changed = true; }
    if (changed) save(data);
    return data;
  } catch { const data = defaults(); save(data); return data; }
};
const data = load();

const imageMigrations: Record<string, string> = {
  'prod-extra-frieren-nendoroid': 'https://img.amiami.com/images/product/main/262/FIGURE-201709.jpg',
  'prod-vtuber-kobo-merch': '/product-images/kobo_kanaeru_merch.svg',
  'prod-hg-wing-zero': 'https://img.amiami.com/images/product/main/204/TOY-GDM-5200.jpg',
  'prod-mg-barbatos': 'https://img.amiami.com/images/product/main/193/TOY-GDM-4393.jpg',
  'prod-rg-unicorn': 'https://img.amiami.com/images/product/main/204/TOY-GDM-5218.jpg',
  'prod-nendo-pekora': 'https://img.amiami.com/images/product/main/263/FIGURE-208058.jpg',
  'prod-hololive-acrylic-set': '/product-images/hololive_acrylic_set.svg',
  'prod-scale-ina': '/product-images/ina_hololive.svg',
};
for (const product of data.products) {
  const migratedImage = imageMigrations[product.id];
  if (migratedImage && product.image !== migratedImage) {
    product.image = migratedImage;
    save(data);
  }
}

export const getDatabasePath = () => databaseFile;

// ─── User Management ───
export const findUser = (email: string, password: string, role?: string): AuthUser | undefined => {
  const user = data.users.find(item => item.email === email && item.password === password && (!role || item.role === role));
  if (!user) return undefined;
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

export const findUserByEmail = (email: string): StoredUser | undefined => {
  return data.users.find(item => item.email === email);
};

export const registerUser = (name: string, email: string, password: string): AuthUser => {
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newUser: StoredUser = { id, name, email, password, role: 'user' };
  data.users.push(newUser);
  save(data);
  const { password: _pw, ...safeUser } = newUser;
  return safeUser;
};

export const listUsers = (): AuthUser[] => {
  return data.users.map(({ password: _pw, ...safeUser }) => safeUser);
};

// ─── Product Management ───
export interface ProductFilters { search?: string; status?: string; category?: string; sort?: string; }
export const listProducts = (filters: ProductFilters = {}) => {
  const query = filters.search?.trim().toLowerCase();
  return data.products.filter(product => {
    if (filters.status && ['ready', 'preorder', 'promo'].includes(filters.status) && product.status !== filters.status) return false;
    if (filters.category && product.category !== filters.category) return false;
    return !query || [product.title, product.series, product.manufacturer, product.categoryName, product.description].some(value => value.toLowerCase().includes(query));
  }).sort((a, b) => filters.sort === 'price-asc' ? a.price - b.price : filters.sort === 'price-desc' ? b.price - a.price : filters.sort === 'bestseller' ? b.soldCount - a.soldCount : (b.rating * b.soldCount) - (a.rating * a.soldCount));
};
export const getProduct = (id: string) => data.products.find(product => product.id === id);
export const createProduct = (product: Product) => { data.products.unshift(product); save(data); return product; };
export const updateProduct = (id: string, changes: Partial<Product>) => { const index = data.products.findIndex(product => product.id === id); if (index < 0) return undefined; data.products[index] = { ...data.products[index], ...changes, id }; save(data); return data.products[index]; };
export const removeProduct = (id: string) => { const index = data.products.findIndex(product => product.id === id); if (index < 0) return undefined; const [deleted] = data.products.splice(index, 1); data.cartItems = data.cartItems.filter(item => item.productId !== id); data.wishlistItems = data.wishlistItems.filter(item => item.productId !== id); save(data); return deleted; };

// ─── Cart Management ───
export const listCart = (userId: string) => data.cartItems.filter(item => item.userId === userId).map(item => ({ product: getProduct(item.productId), quantity: item.quantity, isPreOrderPaymentType: item.paymentType })).filter(item => item.product) as Array<{ product: Product; quantity: number; isPreOrderPaymentType: 'full' | 'dp' }>;
export const saveCartItem = (userId: string, productId: string, quantity: number, paymentType: 'full' | 'dp' = 'full') => { if (!getProduct(productId)) return []; const index = data.cartItems.findIndex(item => item.userId === userId && item.productId === productId && item.paymentType === paymentType); if (quantity <= 0 && index >= 0) data.cartItems.splice(index, 1); else if (index >= 0) data.cartItems[index].quantity = quantity; else if (quantity > 0) data.cartItems.push({ userId, productId, quantity, paymentType }); save(data); return listCart(userId); };
export const clearCart = (userId: string) => { data.cartItems = data.cartItems.filter(item => item.userId !== userId); save(data); return []; };

// ─── Wishlist Management ───
export const listWishlist = (userId: string) => data.wishlistItems.filter(item => item.userId === userId).map(item => getProduct(item.productId)).filter(Boolean) as Product[];
export const toggleWishlist = (userId: string, productId: string) => { if (!getProduct(productId)) return listWishlist(userId); const index = data.wishlistItems.findIndex(item => item.userId === userId && item.productId === productId); if (index >= 0) data.wishlistItems.splice(index, 1); else data.wishlistItems.push({ userId, productId, createdAt: new Date().toISOString() }); save(data); return listWishlist(userId); };
export const countProducts = () => data.products.length;

// ─── Order Management ───
export const createOrder = (order: Order): Order | undefined => {
  const quantities = new Map<string, number>();
  for (const item of order.items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) return undefined;
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
  }

  for (const [productId, quantity] of quantities) {
    const product = getProduct(productId);
    if (!product || !Number.isInteger(product.stock) || product.stock < quantity) return undefined;
  }

  data.orders.unshift(order);
  for (const [productId, quantity] of quantities) {
    const product = getProduct(productId)!;
    product.stock -= quantity;
  }
  save(data);
  return order;
};

export const listAllOrders = (filters?: { status?: OrderStatus }): Order[] => {
  if (filters?.status) {
    return data.orders.filter(o => o.status === filters.status);
  }
  return [...data.orders];
};

export const listUserOrders = (userId: string): Order[] => {
  return data.orders.filter(o => o.userId === userId);
};

export const getOrder = (id: string): Order | undefined => {
  return data.orders.find(o => o.id === id);
};

export const updateOrderStatus = (id: string, status: OrderStatus, trackingNumber?: string, notes?: string): Order | undefined => {
  const index = data.orders.findIndex(o => o.id === id);
  if (index < 0) return undefined;
  data.orders[index].status = status;
  data.orders[index].updatedAt = new Date().toISOString();
  
  if (status === 'shipped') {
    data.orders[index].shippedAt = new Date().toISOString();
    // Auto generate tracking number if not provided
    data.orders[index].trackingNumber = trackingNumber || `AMA-EXP-${Math.floor(10000000 + Math.random() * 90000000)}`;
  } else if (trackingNumber !== undefined) {
    data.orders[index].trackingNumber = trackingNumber;
  }

  if (status === 'delivered') data.orders[index].deliveredAt = new Date().toISOString();
  if (notes !== undefined) data.orders[index].notes = notes;
  save(data);
  return data.orders[index];
};

export const countOrders = () => ({
  total: data.orders.length,
  processing: data.orders.filter(o => o.status === 'processing').length,
  shipped: data.orders.filter(o => o.status === 'shipped').length,
  delivered: data.orders.filter(o => o.status === 'delivered').length,
});
