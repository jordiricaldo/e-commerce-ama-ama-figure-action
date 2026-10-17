import 'dotenv/config';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { closeDatabase, getDatabaseCounts, importJsonData, initializeDatabase } from './data-store.js';

interface JsonDatabase {
  users?: Array<{ id: string; name: string; email: string; password: string; role: 'admin' | 'user' }>;
  products?: Array<Record<string, unknown> & { id: string }>;
  cartItems?: Array<{ userId: string; productId: string; quantity: number; paymentType: 'full' | 'dp' }>;
  wishlistItems?: Array<{ userId: string; productId: string; createdAt: string }>;
  voucherClaims?: Array<{ userId: string; voucherId: string; claimedAt: string }>;
  orders?: Array<Record<string, unknown> & { id: string; userId: string; status: 'processing' | 'shipped' | 'delivered'; createdAt: string }>;
}

const main = async () => {
  if (!process.env.DATABASE_URL) throw new Error('Atur DATABASE_URL sebelum menjalankan migrasi.');
  const sourceFile = process.env.DB_FILE || path.resolve(process.cwd(), 'backend', 'data', 'database.json');
  if (!existsSync(sourceFile)) throw new Error(`File sumber tidak ditemukan: ${sourceFile}`);
  const parsed = JSON.parse(readFileSync(sourceFile, 'utf8')) as JsonDatabase;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sourceUsers = parsed.users || [];
  if (sourceUsers.some(user => user.role === 'admin') && (!adminPassword || adminPassword.length < 12)) {
    throw new Error('Atur ADMIN_PASSWORD minimal 12 karakter sebelum migrasi agar kredensial demo tidak digunakan di hosting.');
  }
  const data = {
    users: sourceUsers.map(user => user.role === 'admin' ? { ...user, password: adminPassword! } : user),
    products: (parsed.products || []) as never[],
    cartItems: parsed.cartItems || [],
    wishlistItems: parsed.wishlistItems || [],
    voucherClaims: parsed.voucherClaims || [],
    orders: (parsed.orders || []) as never[],
  };

  await initializeDatabase();
  try {
    const existing = await getDatabaseCounts();
    if (existing.users || existing.products || existing.orders) {
      throw new Error('Database tujuan sudah berisi data. Migrasi dihentikan agar data lama tidak tertimpa.');
    }

    await importJsonData(data);
    const actual = await getDatabaseCounts();
    const expected = {
      users: data.users.length,
      products: data.products.length,
      cart_items: data.cartItems.length,
      wishlist_items: data.wishlistItems.length,
      voucher_claims: data.voucherClaims.length,
      orders: data.orders.length,
    };
    for (const [key, count] of Object.entries(expected)) {
      if (actual[key] !== count) throw new Error(`Jumlah ${key} tidak cocok: sumber ${count}, database ${actual[key]}.`);
    }
    console.log('Migrasi selesai. Jumlah data cocok:', JSON.stringify(actual));
    console.log(`File JSON sumber tidak diubah: ${sourceFile}`);
  } finally {
    await closeDatabase();
  }
};

main().catch(error => {
  console.error('Migrasi gagal:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
