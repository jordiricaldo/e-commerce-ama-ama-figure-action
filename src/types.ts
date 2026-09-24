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
  downPayment?: number; // For Pre-Orders
  image: string;
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

export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountType: 'fixed' | 'percent';
  discountAmount: number;
  minPurchase: number;
  maxDiscount?: number;
  description: string;
  badge: string;
  validUntil: string;
  isClaimed?: boolean;
}

export interface CategoryItem {
  id: HobbyCategory;
  name: string;
  japaneseName: string;
  tagline: string;
  subgenres: string[];
  icon: string;
  itemCount: number;
  featuredNote: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isPreOrderPaymentType?: 'full' | 'dp';
}
