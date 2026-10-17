import axios from 'axios';
import { Product, Order, OrderStatus } from '../types';

export type LoginRole = 'admin' | 'user';
export interface AuthSession { token: string; user: { id: string; name: string; email: string; role: LoginRole } }

const apiBaseURL = import.meta.env.VITE_API_URL || '/api';
const apiOrigin = apiBaseURL.startsWith('http') ? apiBaseURL.replace(/\/api\/?$/, '') : '';
const api = axios.create({
  baseURL: apiBaseURL,
  headers: { 'Cache-Control': 'no-cache' },
});

export const resolveProductImage = (image: string) =>
  apiOrigin && image.startsWith('/product-images/') ? `${apiOrigin}${image}` : image;

const normalizeProduct = (product: Product): Product => ({
  ...product,
  image: resolveProductImage(product.image),
  images: product.images?.map(resolveProductImage),
});

const normalizeOrder = (order: Order): Order => ({
  ...order,
  items: order.items.map(item => ({ ...item, productImage: resolveProductImage(item.productImage) })),
});

// ─── Auth ───
export const login = async (email: string, password: string, role: LoginRole) => {
  const { data } = await api.post<AuthSession>('/auth/login', { email, password, role });
  sessionStorage.setItem('ama-ama-session', JSON.stringify(data));
  return data;
};

export const register = async (name: string, email: string, password: string) => {
  const { data } = await api.post<AuthSession>('/auth/register', { name, email, password });
  sessionStorage.setItem('ama-ama-session', JSON.stringify(data));
  return data;
};

export const getSession = (): AuthSession | null => {
  try { return JSON.parse(sessionStorage.getItem('ama-ama-session') || 'null') as AuthSession | null; } catch { return null; }
};
export const logout = () => sessionStorage.removeItem('ama-ama-session');

// ─── Products ───
export const getProducts = async (filters: { search?: string; status?: string; category?: string; sort?: string } = {}) => (await api.get<Product[]>('/products', { params: filters })).data.map(normalizeProduct);
export const createProduct = async (product: Product) => normalizeProduct((await api.post<Product>('/products', product, authConfig())).data);
export const updateProduct = async (product: Product) => normalizeProduct((await api.put<Product>(`/products/${product.id}`, product, authConfig())).data);
export const deleteProduct = async (id: string) => (await api.delete<Product>(`/products/${id}`, authConfig())).data;

// ─── Cart ───
export const getCart = async () => (await api.get('/cart', authConfig())).data;
export const updateCart = async (productId: string, quantity: number, paymentType: 'full' | 'dp' = 'full') => (await api.put('/cart', { productId, quantity, paymentType }, authConfig())).data;
export const clearCart = async () => (await api.delete('/cart', authConfig())).data;

// ─── Wishlist ───
export const getWishlist = async () => (await api.get('/wishlist', authConfig())).data;
export const toggleWishlist = async (productId: string) => (await api.post(`/wishlist/${productId}/toggle`, undefined, authConfig())).data;

// ─── Orders ───
export const createOrder = async (orderData: {
  items: Array<{ productId: string; productTitle: string; productImage: string; quantity: number; unitPrice: number; paymentType: 'full' | 'dp' }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
}) => normalizeOrder((await api.post<Order>('/orders', orderData, authConfig())).data);

export const getMyOrders = async () => (await api.get<Order[]>('/orders/my', authConfig())).data.map(normalizeOrder);
export const getAllOrders = async (status?: OrderStatus) => (await api.get<Order[]>('/orders/all', { ...authConfig(), params: status ? { status } : {} })).data.map(normalizeOrder);
export const getOrderStats = async () => (await api.get<{ total: number; processing: number; shipped: number; delivered: number }>('/orders/stats', authConfig())).data;
export const getOrderById = async (id: string) => normalizeOrder((await api.get<Order>(`/orders/${id}`, authConfig())).data);
export const updateOrderStatus = async (id: string, status: OrderStatus, trackingNumber?: string, notes?: string) =>
  normalizeOrder((await api.patch<Order>(`/orders/${id}/status`, { status, trackingNumber, notes }, authConfig())).data);

function authConfig() { const session = getSession(); return { headers: { Authorization: `Bearer ${session?.token || ''}` } }; }