# Frontend

UI storefront dan komponen React aktif berada di folder root `src/`, sedangkan service komunikasi API berada di `src/services/api.ts`.

Frontend memakai proxy Vite `/api` ke backend. Jika backend berjalan di port `4011`, jalankan frontend dengan `VITE_API_PORT=4011`. Jalankan dua terminal:

Atau jalankan frontend dan backend sekaligus dari root proyek dengan `npm run dev:full`.
gw saranin make yang ini `npm run dev:full` buka admin panelnya tinggal tambah `admin-panel` di belakang url nya

1. `npm run api`
2. `npm run dev`