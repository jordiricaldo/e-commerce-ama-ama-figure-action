import { countProducts, getDatabasePath } from './json-db.js';

console.log(`Database JSON AMA-AMA siap: ${getDatabasePath()}`);
console.log(`Produk tersimpan: ${countProducts()}`);
