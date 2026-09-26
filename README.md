# LoveBooth — Photo Booth LDR

## 1. Buka di VS Code
Ekstrak ZIP lalu buka folder `ldr-photo-booth`.

## 2. Install
Pastikan Node.js sudah terpasang, lalu di Terminal VS Code:
```bash
npm install
```

## 3. Supabase
Buat project di Supabase. Buka **SQL Editor**, lalu jalankan semua isi:
`supabase/schema.sql`

Setelah itu buka **Project Settings > API**, salin:
- Project URL
- anon public key

Copy `.env.example` menjadi `.env` lalu isi:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## 4. Jalankan
```bash
npm run dev
```
Buka alamat localhost yang ditampilkan Vite.

## 5. Online
Project ini cocok di-deploy ke Netlify/Vercel. Tambahkan variabel environment yang sama di dashboard hosting.

Catatan keamanan:
Versi ini sengaja memakai anon key + RLS untuk demo photo booth bersama. Jika nanti ingin galeri benar-benar privat hanya untuk dua orang, tambahkan Supabase Auth dan policy berbasis user/room.
