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

## Hosting dengan PostgreSQL

Secara lokal, aplikasi tetap memakai `backend/data/database.json`. Jika `DATABASE_URL` tersedia, API memakai PostgreSQL, membuat tabel saat startup, menyimpan password dalam bentuk hash, dan menyimpan sesi login di database.

1. Buat database PostgreSQL di Neon dan salin connection string pooled dari dashboard Neon.
2. Buat salinan aman `backend/data/database.json` di luar repository sebagai backup. File sumber tidak dihapus oleh proses migrasi.
3. Di PowerShell pada root proyek, jalankan migrasi sekali ke database PostgreSQL yang masih kosong. Input rahasia berikut tidak ditampilkan saat diketik:

	```powershell
	 function Read-SecretText([string]$Prompt) {
		 $secure = Read-Host $Prompt -AsSecureString
		 $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
		 try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
		 finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
	 }
	 try {
		 $env:DATABASE_URL = Read-SecretText "Neon connection string"
		 $env:ADMIN_PASSWORD = Read-SecretText "Password admin baru, minimal 12 karakter"
		 npm run db:migrate-json
	 } finally {
		 Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
		 Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
	 }
	```

	 Migrasi berhenti jika database tujuan sudah berisi pengguna, produk, atau pesanan. Password admin demo diganti dan disimpan sebagai hash. Setelah import, jumlah pengguna, produk, keranjang, wishlist, voucher, dan pesanan dicocokkan.
4. Buat layanan API dari `render.yaml` di Render. Atur `DATABASE_URL` dengan connection string Neon dan `FRONTEND_URL` dengan origin deployment Vercel, misalnya `https://nama-proyek.vercel.app`.
5. Import repository di Vercel sebagai proyek Vite. Atur environment variable `VITE_API_URL` ke URL API Render ditambah `/api`, misalnya `https://ama-ama-api.onrender.com/api`, lalu deploy.
6. Setelah frontend berhasil membaca katalog dan login, uji tambah stok dan checkout. Pertahankan backup JSON sampai semua data terverifikasi.

Jangan masukkan connection string database ke source code atau repository. Tabel dan session PostgreSQL dibuat otomatis oleh API saat startup; migrator hanya dijalankan satu kali.