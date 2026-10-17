<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/fefc12bd-6ac9-4e04-84f2-6e0b28d17d3b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run Frontend and API

Cara paling mudah menjalankan keduanya adalah:

`npm run dev:full`

Frontend tersedia di `http://localhost:3000` dan backend di `http://localhost:4000`. Jangan membuka port backend sebagai halaman storefront; frontend memang berjalan di port `3000` dan meneruskan request `/api` ke backend.

Command ini aman dijalankan ulang: jika port `3000` atau `4000` sudah berisi service AMA-AMA yang sehat, proses tersebut akan digunakan kembali dan tidak dibuat duplikat.

Use the same API port in both terminals. For port `4011` in PowerShell:

1. Backend: `$env:API_PORT=4011; npm run api`
2. Frontend: `$env:VITE_API_PORT=4011; npm run dev`

Restart the Vite frontend after changing `VITE_API_PORT`, because the proxy configuration is loaded when Vite starts.
