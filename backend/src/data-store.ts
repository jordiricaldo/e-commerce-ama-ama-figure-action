import * as postgres from './postgres-db.js';
import { AuthUser, Order, OrderStatus, Product } from './types.js';
import { ProductFilters } from './postgres-db.js';

export const isPostgresEnabled = () => Boolean(process.env.DATABASE_URL);
const loadJsonStore = async () => import('./json-db.js');
export const initializeDatabase = async () => {
  if (process.env.VERCEL && !isPostgresEnabled()) {
    throw new Error('DATABASE_URL wajib diatur pada Environment Variables Vercel.');
  }
  if (isPostgresEnabled()) await postgres.initializePostgres();
};

export const findUser = async (email: string, password: string, role?: string): Promise<AuthUser | undefined> =>
  isPostgresEnabled() ? postgres.findUser(email, password, role) : (await loadJsonStore()).findUser(email, password, role);
export const findUserByEmail = async (email: string): Promise<AuthUser | undefined> =>
  isPostgresEnabled() ? postgres.findUserByEmail(email) : (await loadJsonStore()).findUserByEmail(email);
export const registerUser = async (name: string, email: string, password: string): Promise<AuthUser> =>
  isPostgresEnabled() ? postgres.registerUser(name, email, password) : (await loadJsonStore()).registerUser(name, email, password);
export const createSession = async (token: string, userId: string) => {
  if (isPostgresEnabled()) await postgres.createSession(token, userId);
};
export const getSessionUser = async (token: string): Promise<AuthUser | undefined> =>
  isPostgresEnabled() ? postgres.getSessionUser(token) : undefined;

export const listProducts = async (filters: ProductFilters = {}): Promise<Product[]> =>
  isPostgresEnabled() ? postgres.listProducts(filters) : (await loadJsonStore()).listProducts(filters);
export const getProduct = async (id: string): Promise<Product | undefined> =>
  isPostgresEnabled() ? postgres.getProduct(id) : (await loadJsonStore()).getProduct(id);
export const createProduct = async (product: Product): Promise<Product> =>
  isPostgresEnabled() ? postgres.createProduct(product) : (await loadJsonStore()).createProduct(product);
export const updateProduct = async (id: string, changes: Partial<Product>): Promise<Product | undefined> =>
  isPostgresEnabled() ? postgres.updateProduct(id, changes) : (await loadJsonStore()).updateProduct(id, changes);
export const removeProduct = async (id: string): Promise<Product | undefined> =>
  isPostgresEnabled() ? postgres.removeProduct(id) : (await loadJsonStore()).removeProduct(id);

export const listCart = async (userId: string) =>
  isPostgresEnabled() ? postgres.listCart(userId) : (await loadJsonStore()).listCart(userId);
export const saveCartItem = async (userId: string, productId: string, quantity: number, paymentType: 'full' | 'dp' = 'full') =>
  isPostgresEnabled() ? postgres.saveCartItem(userId, productId, quantity, paymentType) : (await loadJsonStore()).saveCartItem(userId, productId, quantity, paymentType);
export const clearCart = async (userId: string) =>
  isPostgresEnabled() ? postgres.clearCart(userId) : (await loadJsonStore()).clearCart(userId);

export const listWishlist = async (userId: string) =>
  isPostgresEnabled() ? postgres.listWishlist(userId) : (await loadJsonStore()).listWishlist(userId);
export const toggleWishlist = async (userId: string, productId: string) =>
  isPostgresEnabled() ? postgres.toggleWishlist(userId, productId) : (await loadJsonStore()).toggleWishlist(userId, productId);

export const createOrder = async (order: Order): Promise<Order | undefined> =>
  isPostgresEnabled() ? postgres.createOrder(order) : (await loadJsonStore()).createOrder(order);
export const listAllOrders = async (filters?: { status?: OrderStatus }): Promise<Order[]> =>
  isPostgresEnabled() ? postgres.listAllOrders(filters) : (await loadJsonStore()).listAllOrders(filters);
export const listUserOrders = async (userId: string): Promise<Order[]> =>
  isPostgresEnabled() ? postgres.listUserOrders(userId) : (await loadJsonStore()).listUserOrders(userId);
export const getOrder = async (id: string): Promise<Order | undefined> =>
  isPostgresEnabled() ? postgres.getOrder(id) : (await loadJsonStore()).getOrder(id);
export const updateOrderStatus = async (id: string, status: OrderStatus, trackingNumber?: string, notes?: string): Promise<Order | undefined> =>
  isPostgresEnabled() ? postgres.updateOrderStatus(id, status, trackingNumber, notes) : (await loadJsonStore()).updateOrderStatus(id, status, trackingNumber, notes);
export const countOrders = async () =>
  isPostgresEnabled() ? postgres.countOrders() : (await loadJsonStore()).countOrders();

export const importJsonData = postgres.importJsonData;
export const getDatabaseCounts = postgres.getDatabaseCounts;
export const closeDatabase = postgres.closePostgres;
