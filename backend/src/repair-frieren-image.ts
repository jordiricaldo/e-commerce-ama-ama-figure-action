import 'dotenv/config';
import { closeDatabase, getProduct, initializeDatabase, updateProduct } from './data-store.js';

const productId = 'prod-extra-frieren-nendoroid';
const imageUrl = 'https://img.amiami.com/images/product/main/262/FIGURE-201709.jpg';

const main = async () => {
  await initializeDatabase();
  try {
    const product = await getProduct(productId);
    if (!product) throw new Error(`Produk ${productId} tidak ditemukan.`);
    await updateProduct(productId, { image: imageUrl, images: [imageUrl] });
    console.log(`Foto ${product.title} diperbarui; stok dan data pesanan tidak diubah.`);
  } finally {
    await closeDatabase();
  }
};

main().catch(error => {
  console.error('Perbaikan foto gagal:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
