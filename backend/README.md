# Backend API

Jalankan setup database dari root proyek dengan `npm run db:setup`. Database JSON dan seed produk/akun akan dibuat otomatis di `backend/data/database.json`.

Setelah itu jalankan API dengan `npm run api`. API berjalan di `http://localhost:4000`.

Root `http://localhost:4000/` menampilkan informasi API. Gunakan endpoint berawalan `/api`, misalnya `http://localhost:4000/api/products`.

- `POST /api/auth/login` menerima `email`, `password`, dan `role` (`admin` atau `user`).
- `GET /api/products` dapat diakses publik.
- `GET /api/products?search=anya&status=ready&category=nendoroid&sort=price-asc` menyediakan filter dan sorting dari backend.
- `POST`, `PUT`, dan `DELETE /api/products` membutuhkan `Authorization: Bearer <token>` dari login admin.
- Login admin tidak ditampilkan di storefront; buka route internal `/admin-panel` untuk menampilkan form login admin. Endpoint CRUD tetap dilindungi middleware role admin.
- `GET/PUT/DELETE /api/cart` membutuhkan token user/admin dan menyimpan keranjang per akun.
- `GET /api/wishlist` dan `POST /api/wishlist/:productId/toggle` membutuhkan token user/admin.

Data disimpan di JSON pada `backend/data/database.json` dan tetap ada setelah server direstart. Lokasi dapat diganti dengan environment variable `DB_FILE`.

Foto katalog lama tetap berada di `src/assets/images`, tetapi sekarang disajikan backend melalui endpoint `/product-images/<nama-file>`. Seed database sudah memakai path ini, sehingga foto yang tampil di storefront dan admin berasal dari asset yang sama. Untuk produk baru, field URL gambar pada admin dapat diisi dengan URL publik atau path `/product-images/<nama-file>` untuk file yang sudah ada.

Demo account:

- Admin: `admin@ama-ama.local` / `admin123`
- User: `user@ama-ama.local` / `user123`

## Hosting Gratis: Vercel dan Neon

Frontend dan API berjalan dalam satu proyek Vercel; database memakai Neon Free. Neon menyatakan paket Free permanen dan tidak membutuhkan kartu. Neon menghentikan compute saat idle, tetapi data database tetap tersimpan. Vercel Hobby juga gratis untuk tugas kuliah non-komersial, dengan batas pemakaian.

1. Buat proyek di Neon, pilih paket Free, lalu buka **Connect** dan salin connection string pooled. Host harus berupa alamat Neon, biasanya diawali `ep-`; jika error menyebut `ENOTFOUND base`, connection string yang ditempel salah atau terpotong.
2. Buat backup `backend/data/database.json` di luar repository. File sumber tidak dihapus oleh migrator.
3. Dari PowerShell pada root proyek, jalankan migrasi satu kali ke database baru yang masih kosong. Kedua rahasia diminta secara tersembunyi:

   ```powershell
   function Read-SecretText([string]$Prompt) {
     $secure = Read-Host $Prompt -AsSecureString
     $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
     try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
     finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
   }
   try {
     $env:DATABASE_URL = Read-SecretText "Neon pooled connection string"
     $env:ADMIN_PASSWORD = Read-SecretText "Password admin baru, minimal 12 karakter"
     npm run db:migrate-json
   } finally {
     Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
     Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
   }
   ```

   Migrasi berhenti bila database tujuan sudah berisi data. Password admin demo diganti dan disimpan sebagai hash; jumlah pengguna, produk, keranjang, wishlist, voucher, serta pesanan diverifikasi. File JSON tetap menjadi backup.
4. Commit dan push perubahan proyek ke repository GitHub yang sudah terhubung. `backend/data/database.json` dan `.env` diabaikan Git.
5. Import repository ke Vercel sebagai proyek Vite dengan root directory proyek. Biarkan build command `npm run build` dan output directory `dist`.
6. Di **Settings → Environment Variables**, tambahkan `DATABASE_URL` dengan connection string Neon yang sama. Jangan beri prefix `VITE_` pada variabel rahasia database. `VITE_API_URL` tidak perlu diatur karena frontend memakai `/api` pada domain yang sama.
7. Deploy/redeploy. Setelah berhasil, coba buka `/api/health`, login admin memakai password baru, lalu cek katalog dan order.

Vercel Function memakai Express dari `api/[...path].ts`, sedangkan foto katalog disajikan dari `public/product-images`. Tabel dan session dibuat otomatis saat request pertama. Jangan pernah commit atau membagikan connection string maupun password admin.