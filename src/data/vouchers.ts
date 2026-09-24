import { Voucher } from '../types';

export const STORE_VOUCHERS: Voucher[] = [
  {
    id: 'v-50k',
    code: 'AMA50K',
    title: 'Potongan Rp50.000',
    discountType: 'fixed',
    discountAmount: 50000,
    minPurchase: 500000,
    badge: 'Spesial Otaku',
    description: 'Min. belanja Rp500.000 untuk semua item Ready Stock & Scale Figure',
    validUntil: '30 Sep 2024'
  },
  {
    id: 'v-ongkir',
    code: 'GRATISONGKIR',
    title: 'Gratis Ongkir Rp25.000',
    discountType: 'fixed',
    discountAmount: 25000,
    minPurchase: 300000,
    badge: 'Bebas Ongkir',
    description: 'Subsidi ongkir Rp25.000 se-Indonesia dengan packing bubble wrap tebal',
    validUntil: '31 Des 2024'
  },
  {
    id: 'v-po10',
    code: 'POWAVE10',
    title: 'Diskon 10% Khusus PO',
    discountType: 'percent',
    discountAmount: 10,
    maxDiscount: 150000,
    minPurchase: 1000000,
    badge: 'Pre-Order Saver',
    description: 'Potongan 10% hingga Rp150.000 untuk pelunasan atau DP Pre-Order',
    validUntil: '15 Okt 2024'
  },
  {
    id: 'v-matsuri',
    code: 'MATSURI100',
    title: 'Cashback Rp100.000',
    discountType: 'fixed',
    discountAmount: 100000,
    minPurchase: 1200000,
    badge: 'Matsuri Fest',
    description: 'Klaim kupon festival belanja Akihabara untuk min. belanja Rp1.200.000',
    validUntil: '30 Sep 2024'
  }
];
