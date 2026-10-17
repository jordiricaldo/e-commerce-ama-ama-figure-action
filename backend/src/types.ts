export type Role = 'admin' | 'user';
export type ProductStatus = 'ready' | 'preorder' | 'promo';
export type HobbyCategory = 'scale' | 'nendoroid' | 'gunpla' | 'merch' | 'tcg';

export interface Product {
  id: string;
  title: string;
  japaneseTitle?: string;
  series: string;
  manufacturer: string;
  category: HobbyCategory;
  categoryName: string;
  status: ProductStatus;
  statusBadge: string;
  condition: 'MISB' | 'Authentic Pre-Painted' | 'New Sealed';
  price: number;
  originalPrice?: number;
  downPayment?: number;
  image: string;
  images?: string[];
  rating: number;
  soldCount: number;
  stock: number;
  scale?: string;
  material?: string;
  height?: string;
  releaseDate?: string;
  description: string;
  poDeadline?: string;
  etaArrival?: string;
  isRare?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered';

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  paymentType: 'full' | 'dp';
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  notes?: string;
}
