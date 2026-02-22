# Yayasan Pemerhati Rimba Nusantara (YPRN)
### Dokumentasi & Penjelasan Isi Project
*Full-Stack Web Application — React 19 + Vite 7 + Express 4 + PostgreSQL*

---

## 1. Gambaran Umum Project

YPRN adalah aplikasi web full-stack yang dibangun untuk Yayasan Pemerhati Rimba Nusantara, sebuah organisasi nirlaba Indonesia yang bergerak di bidang konservasi lingkungan dan pelestarian hutan melalui pemberdayaan komunitas, riset, advokasi kebijakan, dan edukasi lingkungan.

Project ini terdiri dari dua lapisan utama:

- **Frontend** — Antarmuka pengguna berbasis React 19 dengan Vite 7 sebagai build tool
- **Backend** — REST API berbasis Express 4 yang terhubung ke database PostgreSQL (Supabase)

### Tujuan Utama Aplikasi

- Menyajikan informasi organisasi (visi-misi, struktur, program) secara bilingual (Indonesia & Inggris)
- Mendokumentasikan kegiatan, proyek SIA, dan proyek SROI dengan galeri berbasis database
- Menyediakan dashboard admin terproteksi untuk manajemen konten (CRUD) tanpa perlu mengedit kode
- Menghadirkan performa tinggi dengan kompresi Gzip/Brotli, code splitting, dan connection pooling

---

## 2. Tech Stack & Alasan Pemilihan

| Layer | Teknologi | Alasan Teknis |
|---|---|---|
| Frontend UI | React 19 + Vite 7 | React 19 membawa concurrent rendering; Vite memberikan HMR instan dan build jauh lebih cepat dibanding CRA/Webpack |
| Styling | Tailwind CSS 3 | Utility-first CSS meminimalkan bundle size dan mempercepat development tanpa naming conflicts |
| Routing | React Router 7 | Lazy loading per-route bawaan, cocok untuk SPA dengan banyak halaman yang jarang diakses sekaligus |
| Animasi | Framer Motion | Deklaratif, kompatibel dengan React, mendukung page transition tanpa re-render overhead besar |
| Backend API | Express 4 | Minimal, battle-tested, ekosistem middleware luas; cocok untuk REST API sederhana tanpa over-engineering |
| Database | PostgreSQL (Supabase) | Relasional, ACID-compliant; Supabase menyediakan hosted Postgres dengan connection pooling gratis |
| Auth | JWT + bcrypt | Stateless auth cocok untuk single-admin use case; bcrypt memastikan password tidak tersimpan plain text |
| Upload | Multer | Middleware Express yang mature untuk multipart/form-data; upload langsung ke disk menghindari memory overflow |
| Security | Helmet | Set HTTP security headers secara otomatis (CSP, HSTS, X-Frame-Options, dll.) dengan satu baris kode |
| Deploy FE | Vercel | CDN global, SPA rewrite otomatis, environment variables, preview deployment per-branch |
| Bahasa | JavaScript (JSX) | Tidak ada TypeScript — trade-off: dev lebih cepat, tapi kehilangan type safety di runtime |

---

## 3. Struktur Direktori & Peran Masing-Masing

### 3.1 Frontend (`src/`)

Semua kode React berada di folder `src/` dengan struktur berbasis fitur:

| Path | Isi & Tanggung Jawab |
|---|---|
| `src/components/admin/` | `ProtectedRoute` — HOC yang memvalidasi JWT sebelum merender halaman admin |
| `src/components/common/` | Komponen reusable: Navbar, Footer, Button, PageTransition (wrapper Framer Motion) |
| `src/components/home/` | Komponen spesifik halaman beranda: Hero banner, statistik, video section |
| `src/components/contact/` | Form kontak dan informasi kontak organisasi |
| `src/components/portfolio/` | `PortfolioCard` dan `PortfolioGrid` untuk menampilkan proyek dari database |
| `src/components/team/` | `TeamCard` dan `TeamGrid` untuk halaman struktur organisasi |
| `src/config/api.js` | Single source of truth untuk base URL API — membaca dari `VITE_API_URL` env var |
| `src/context/` | `AuthContext` (state login/logout) dan `LanguageContext` (toggle id/en) |
| `src/data/` | Data statis dan file terjemahan (`id.js` / `en.js`) — konten yang tidak perlu database |
| `src/hooks/useLanguage.js` | Custom hook untuk mengakses `LanguageContext` dengan mudah di komponen mana pun |
| `src/pages/` | Komponen level route — satu file per halaman, di-lazy load oleh React Router |
| `src/utils/animations.js` | Shared animation variants Framer Motion — agar transisi konsisten di seluruh halaman |
| `src/App.jsx` | Root router: mendefinisikan semua route, wraps dengan `AuthProvider` dan `LanguageProvider` |
| `src/main.jsx` | Entry point React: mount ke DOM, import global CSS |

### 3.2 Backend (`backend/`)

| File/Folder | Isi & Tanggung Jawab |
|---|---|
| `backend/server.js` | Entry point Express: middleware setup (Helmet, CORS, JSON parser), route mounting, error handler global |
| `backend/database/migration.sql` | Schema PostgreSQL lengkap: `CREATE TABLE` untuk semua entitas (kegiatan, hero, proyek, video, users) |
| `backend/scripts/migrate.js` | Menjalankan `migration.sql` via `pg` client — dieksekusi sekali saat setup pertama |
| `backend/scripts/seed.js` | Mengisi database dengan data awal (admin user default) untuk keperluan bootstrap |
| `backend/scripts/reset-password.js` | Utility CLI untuk mereset password admin tanpa akses UI jika terkunci |
| `backend/uploads/` | Direktori penyimpanan file upload, diorganisir per kategori (`kegiatan/`, `proyek/`, dll.) |

### 3.3 File Konfigurasi Root

| File | Fungsi |
|---|---|
| `vite.config.js` | Konfigurasi Vite: plugin React, code splitting manual, Gzip/Brotli pre-compression, Terser minification |
| `tailwind.config.js` | Konfigurasi Tailwind: content paths untuk tree-shaking CSS, custom colors/fonts jika ada |
| `vercel.json` | SPA rewrite rules (semua path ke `index.html`) dan cache headers untuk aset statis |
| `.env` (root) | `VITE_API_URL` — URL backend API yang dikonsumsi frontend |
| `backend/.env` | `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` — credential sensitif, tidak di-commit ke Git |

---

## 4. Fitur Utama & Cara Kerjanya

### 4.1 Bilingual UI (id/en)

`LanguageContext` menyimpan state bahasa aktif (default: Indonesia). Toggle bahasa mengubah state, dan setiap komponen yang menggunakan `useLanguage()` hook akan re-render dengan teks dari file terjemahan yang sesuai (`src/data/id.js` atau `src/data/en.js`). Ini adalah client-side i18n sederhana tanpa library eksternal.

### 4.2 Animated Page Transitions

React Router v7 dengan `lazy()` dan `Suspense` memastikan setiap halaman hanya dimuat saat pertama kali dikunjungi. `PageTransition` component membungkus setiap halaman dengan `AnimatePresence` dari Framer Motion, menghasilkan animasi fade/slide yang halus saat navigasi tanpa blocking render.

### 4.3 Admin Dashboard (JWT Auth)

Flow autentikasi berjalan sebagai berikut:

1. Admin `POST` ke `/api/login` dengan username + password
2. Backend memverifikasi password dengan `bcrypt.compare()`, lalu sign JWT dengan secret 64-char
3. Frontend menyimpan token di `AuthContext` (in-memory) dan melampirkannya di header setiap request
4. `ProtectedRoute` memeriksa keberadaan token sebelum merender `/admin/dashboard`
5. Token expire sesuai `JWT_EXPIRES_IN` (default 24h) — setelah itu admin harus login ulang

### 4.4 Image Upload

Multer dikonfigurasi dengan `diskStorage`: file disimpan langsung ke `backend/uploads/{kategori}/` dengan filename yang di-sanitize. Backend mengembalikan path relatif yang disimpan di database, sehingga frontend dapat membangun URL lengkap ke endpoint static file Express.

### 4.5 SIA & SROI Galleries

Kedua galeri proyek mengambil data dari endpoint `/api/proyek` dengan filter berdasarkan tipe (`sia` atau `sroi`). Halaman metodologi bersifat statis (konten di `src/data/`), sedangkan galeri proyek bersifat dinamis dari database — memisahkan konten yang jarang berubah dari konten yang sering diperbarui admin.

### 4.6 Performance Optimizations

- **Gzip/Brotli** — `vite-plugin-compression` menghasilkan file `.gz` dan `.br` saat build, sehingga server tidak perlu kompresi on-the-fly
- **Code Splitting** — manual chunks di `vite.config.js` memisahkan vendor (React, Framer Motion) dari kode aplikasi untuk cache yang lebih efisien
- **Terser Minification** — menghapus `console.log`, whitespace, dan memperpendek nama variabel di build produksi
- **DB Connection Pooling** — `pg.Pool` di backend membatasi dan menggunakan ulang koneksi database, menghindari overhead koneksi per-request

---

## 5. API Endpoints

Semua endpoint diawali dengan `/api`. Kolom **Auth** menandakan kebutuhan `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| `GET` | `/health` | Tidak | Health check server dan status koneksi database |
| `POST` | `/login` | Tidak | Autentikasi admin, mengembalikan JWT token |
| `GET` | `/verify` | Ya | Verifikasi validitas JWT token yang sedang aktif |
| `GET` | `/kegiatan` | Tidak | Mengambil daftar semua kegiatan dari database |
| `POST` | `/kegiatan` | Ya | Membuat entri kegiatan baru (dengan upload gambar) |
| `PUT` | `/kegiatan/:id` | Ya | Memperbarui data kegiatan berdasarkan ID |
| `DELETE` | `/kegiatan/:id` | Ya | Menghapus kegiatan dan file gambarnya dari disk |
| `GET` | `/hero-beranda` | Tidak | Mengambil daftar banner hero untuk halaman beranda |
| `POST` | `/hero-beranda` | Ya | Menambahkan banner hero baru |
| `PUT` | `/hero-beranda/:id` | Ya | Memperbarui banner hero |
| `DELETE` | `/hero-beranda/:id` | Ya | Menghapus banner hero |
| `GET` | `/proyek` | Tidak | Mengambil proyek SIA dan SROI dari database |
| `POST` | `/proyek` | Ya | Membuat entri proyek baru |
| `PUT` | `/proyek/:id` | Ya | Memperbarui data proyek |
| `DELETE` | `/proyek/:id` | Ya | Menghapus proyek |
| `GET` | `/video-beranda` | Tidak | Mengambil daftar video untuk halaman beranda |
| `POST` | `/video-beranda` | Ya | Mengupload video baru |
| `DELETE` | `/video-beranda/:id` | Ya | Menghapus video |

---

## 6. Halaman & Routing Frontend

| Path URL | Nama Halaman | Deskripsi Konten |
|---|---|---|
| `/` | Home / Beranda | Hero banner dinamis, deskripsi organisasi, statistik, program unggulan, CTA |
| `/tentang/visi-misi` | Visi & Misi | Nilai-nilai dan misi organisasi (konten statis dari `src/data/`) |
| `/tentang/struktur-organisasi` | Struktur Organisasi | Bagan pengurus dan manajemen (konten statis) |
| `/kegiatan` | Galeri Kegiatan | Dokumentasi kegiatan lapangan yang diambil dari database |
| `/kegiatan/social-impact-assessment` | SIA | Metodologi SIA (statis) + galeri proyek SIA (dinamis dari DB) |
| `/kegiatan/social-return-on-investment` | SROI | Metodologi SROI (statis) + galeri proyek SROI (dinamis dari DB) |
| `/kontak` | Kontak | Informasi kontak, alamat kantor, embed Google Maps |
| `/login` | Admin Login | Form autentikasi JWT untuk akses dashboard admin |
| `/admin/dashboard` | Admin Dashboard | CRUD operations untuk semua konten (route terproteksi) |

---

## 7. Environment Variables

### 7.1 Frontend (`.env` di root project)

| Variable | Deskripsi | Default |
|---|---|---|
| `VITE_API_URL` | Base URL untuk semua API call dari frontend | `http://localhost:5000/api` |

### 7.2 Backend (`.env` di folder `backend/`)

| Variable | Deskripsi | Contoh Nilai |
|---|---|---|
| `PORT` | Port yang digunakan server Express | `5000` |
| `DATABASE_URL` | PostgreSQL connection URI lengkap dengan credential | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key untuk signing dan verifikasi JWT — harus 64 karakter acak | `random-64-char-string` |
| `JWT_EXPIRES_IN` | Durasi validitas token JWT | `24h` |
| `NODE_ENV` | Mode runtime: mengaktifkan optimasi produksi jika diset ke `production` | `development` / `production` |

> **Catatan keamanan:** File `.env` tidak boleh di-commit ke repository Git. Pastikan `.env` sudah masuk ke `.gitignore`. Password dengan karakter khusus seperti `[` atau `]` harus di-URL-encode terlebih dahulu (contoh: `%5B`, `%5D`) sebelum dimasukkan ke `DATABASE_URL`.

---

## 8. Setup & Deployment

### 8.1 Menjalankan Secara Lokal

```bash
# 1. Clone repository
git clone https://github.com/wildanapendi/MyCompany.git
cd MyCompany

# 2. Install & jalankan frontend
npm install
# Buat .env di root, isi VITE_API_URL jika backend tidak di localhost:5000
npm run dev  # → http://localhost:5173

# 3. Install & setup backend
cd backend
npm install
# Buat backend/.env dengan semua variable yang dibutuhkan

# 4. Jalankan migrasi + seed database
npm run db:setup

# 5. Jalankan backend
npm run dev  # → http://localhost:5000
```

### 8.2 Build Produksi

```bash
# Frontend — menghasilkan dist/ yang sudah dioptimasi
npm run build

# Analisis ukuran bundle (opsional)
npm run build:analyze

# Backend — deploy folder backend/ ke platform Node.js
npm start
# atau untuk mode produksi eksplisit:
npm run start:prod
```

`vercel.json` sudah dikonfigurasi untuk SPA rewrite dan cache header — cukup connect repo ke Vercel dan set `VITE_API_URL` ke URL backend produksi.

---

## 9. Aspek Keamanan

| Mekanisme | Implementasi |
|---|---|
| Password Hashing | `bcrypt` dengan salt rounds default — password admin tidak pernah tersimpan plain text |
| HTTP Headers | `Helmet` middleware: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| SQL Injection | Parameterized queries dengan `pg` client — tidak ada string concatenation untuk query SQL |
| CORS | Konfigurasi CORS eksplisit di Express — hanya origin tertentu yang diizinkan |
| Auth JWT | Token ditandatangani dengan secret 64-char, expire setelah 24h, dikirim via `Authorization` header |
| File Upload | Multer memvalidasi tipe file dan membatasi ukuran upload untuk mencegah abuse |

---

## 10. Trade-offs & Keterbatasan

| Keputusan | Keuntungan | Konsekuensi / Risiko |
|---|---|---|
| Tidak pakai TypeScript | Development lebih cepat, boilerplate lebih sedikit | Tidak ada type checking di compile time; bug tipe hanya muncul di runtime |
| Upload file ke disk lokal | Sederhana, tidak butuh storage service berbayar | File hilang jika server di-redeploy; tidak cocok untuk horizontal scaling |
| JWT in-memory (no refresh token) | Implementasi sederhana, tidak butuh Redis/session store | Admin harus re-login setiap 24h; token tidak bisa di-revoke sebelum expire |
| Bilingual via data file statis | Tidak butuh CMS atau translation service eksternal | Menambah bahasa baru butuh edit kode; tidak bisa diubah admin dari dashboard |
| PostgreSQL di Supabase | Setup cepat, gratis tier tersedia, ada connection pooling | Ketergantungan pada vendor eksternal; jika Supabase down, DB tidak bisa diakses |
| Single admin user | Tidak butuh sistem role/permission yang kompleks | Tidak ada granular access control; satu admin bisa mengubah semua konten |

---

## Penutup

Project YPRN adalah implementasi yang solid untuk kebutuhan website organisasi nirlaba dengan content management sederhana. Arsitektur yang dipilih — React SPA + Express REST API + PostgreSQL — adalah kombinasi yang proven, mudah dipahami, dan mudah di-maintain oleh tim kecil. Prioritas utama project ini adalah kemudahan pengelolaan konten oleh admin non-teknis sambil tetap memperhatikan performa dan keamanan dasar.

Untuk pengembangan selanjutnya, area yang paling potensial untuk ditingkatkan adalah:

- Migrasi file upload ke object storage (S3/Cloudflare R2) untuk menghilangkan ketergantungan pada disk lokal
- Penambahan TypeScript untuk type safety di seluruh codebase
- Implementasi refresh token untuk sesi admin yang lebih robust tanpa harus re-login setiap 24 jam

---

*© 2026 Yayasan Pemerhati Rimba Nusantara. All rights reserved.*
