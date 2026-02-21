# 🌿 Yayasan Pemerhati Rimba Nusantara (YPRN)

Website resmi **Yayasan Pemerhati Rimba Nusantara** — organisasi nirlaba yang berdedikasi untuk menjaga lingkungan dan kelestarian hutan Indonesia melalui pemberdayaan masyarakat, penelitian, advokasi kebijakan, dan edukasi lingkungan.

## 📸 Preview

| Beranda                 | Visi & Misi                  | SIA                      |
| ----------------------- | ---------------------------- | ------------------------ |
| Hero + Program Kegiatan | Visi, Misi, Nilai Organisasi | Social Impact Assessment |

## 🛠️ Tech Stack

### Frontend

- **React 19** + **Vite 7**
- **Tailwind CSS 3** — styling utility-first
- **React Router DOM 7** — client-side routing
- **Lucide React** — icon library

### Backend

- **Express.js 4** — REST API server
- **PostgreSQL** (Supabase) — database
- **JSON Web Token (JWT)** — autentikasi admin
- **Multer** — upload file/gambar

## 📁 Struktur Proyek

```
MyCompany/
├── public/
│   └── assets/
│       ├── Logo.svg
│       └── images/
│           ├── Beranda/         # Gambar halaman beranda
│           ├── Layout/          # Background layout
│           ├── SIA/             # Gambar Social Impact Assessment
│           ├── SROI/            # Gambar Social Return on Investment
│           └── Struktur/        # Foto pengurus organisasi
├── src/
│   ├── components/
│   │   ├── admin/               # ProtectedRoute
│   │   ├── common/              # Navbar, Footer
│   │   └── home/                # Hero, About, Stats
│   ├── context/
│   │   └── AuthContext.jsx      # Context autentikasi admin
│   ├── data/
│   │   └── companyData.js       # Data organisasi, statistik, navigasi
│   ├── pages/
│   │   ├── Home.jsx             # Beranda
│   │   ├── VisiMisi.jsx         # Visi, Misi, & Nilai
│   │   ├── StrukturOrganisasi.jsx
│   │   ├── Kegiatan.jsx         # Galeri kegiatan (dari DB)
│   │   ├── SocialImpactAssessment.jsx
│   │   ├── SocialReturnOnInvestment.jsx
│   │   ├── Kontak.jsx           # Informasi kontak + Google Maps
│   │   ├── Login.jsx            # Login admin
│   │   ├── AdminDashboard.jsx   # Dashboard admin (CRUD kegiatan)
│   │   └── NotFound.jsx         # Halaman 404
│   ├── App.jsx                  # Router utama
│   ├── App.css                  # Custom CSS (card-glow, animations, dll)
│   └── index.css                # Base styles
├── backend/
│   ├── server.js                # Express API server
│   ├── .env                     # Environment variables (TIDAK di-commit)
│   └── assets/                  # Upload gambar kegiatan
├── database/
│   └── admin.sql                # Schema PostgreSQL
└── package.json
```

## 🚀 Cara Menjalankan

### Prasyarat

- **Node.js** >= 18
- **PostgreSQL** database (atau akun [Supabase](https://supabase.com))

### 1. Clone Repository

```bash
git clone <repo-url>
cd MyCompany
```

### 2. Setup Frontend

```bash
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 3. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
PORT=5000
JWT_SECRET=<random-secret-64-chars>
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

> ⚠️ **Penting:** Jika password mengandung karakter khusus seperti `[` atau `]`, encode terlebih dahulu (`%5B`, `%5D`).

### 4. Setup Database

Jalankan SQL schema ke PostgreSQL/Supabase:

```bash
psql -h <host> -U <user> -d <database> -f database/admin.sql
```

Atau copy-paste isi `admin.sql` ke SQL Editor Supabase.

### 5. Jalankan Backend

```bash
cd backend
npm start
# atau untuk development:
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

## 🗺️ Halaman & Route

| Route                                   | Halaman             | Deskripsi                                      |
| --------------------------------------- | ------------------- | ---------------------------------------------- |
| `/`                                     | Beranda             | Hero, About, Statistik, Program Kegiatan, CTA  |
| `/tentang/visi-misi`                    | Visi & Misi         | Visi, Misi, Nilai-nilai, Tentang Yayasan       |
| `/tentang/struktur-organisasi`          | Struktur Organisasi | Bagan pengurus (Pembina, Pengawas, Ketua, dll) |
| `/kegiatan`                             | Galeri Kegiatan     | Dokumentasi kegiatan dari database             |
| `/kegiatan/social-impact-assessment`    | SIA                 | Metodologi & galeri kegiatan SIA               |
| `/kegiatan/social-return-on-investment` | SROI                | Metodologi & galeri kegiatan SROI              |
| `/kontak`                               | Kontak              | Info kontak, alamat, Google Maps embed         |
| `/login`                                | Login Admin         | Autentikasi JWT                                |
| `/admin/dashboard`                      | Dashboard Admin     | CRUD kegiatan (protected route)                |
| `*`                                     | 404                 | Halaman tidak ditemukan                        |

## 🔒 API Endpoints

| Method   | Endpoint            | Auth | Deskripsi            |
| -------- | ------------------- | ---- | -------------------- |
| `POST`   | `/api/login`        | ❌   | Login admin          |
| `GET`    | `/api/kegiatan`     | ❌   | Ambil semua kegiatan |
| `POST`   | `/api/kegiatan`     | ✅   | Tambah kegiatan baru |
| `PUT`    | `/api/kegiatan/:id` | ✅   | Update kegiatan      |
| `DELETE` | `/api/kegiatan/:id` | ✅   | Hapus kegiatan       |

## ⚙️ Environment Variables

| Variable         | Deskripsi                    | Contoh                    |
| ---------------- | ---------------------------- | ------------------------- |
| `PORT`           | Port backend server          | `5000`                    |
| `JWT_SECRET`     | Secret key untuk JWT         | `<64-char random string>` |
| `JWT_EXPIRES_IN` | Masa berlaku token           | `24h`                     |
| `DATABASE_URL`   | PostgreSQL connection string | `postgresql://...`        |

## 📝 Scripts

### Frontend

```bash
npm run dev      # Development server (Vite)
npm run build    # Build production
npm run preview  # Preview production build
npm run lint     # ESLint check
```

### Backend

```bash
npm start        # Jalankan server
npm run dev      # Development dengan auto-reload
```

## 👥 Tentang YPRN

**Yayasan Pemerhati Rimba Nusantara (YPRN)** didirikan tahun 2024, berkedudukan di Kota Palembang, Provinsi Sumatera Selatan. Kami memiliki kompetensi di bidang riset dan kajian yang berguna dalam pengambilan keputusan strategis, termasuk:

- **Social Impact Assessment (SIA)** — Kajian dampak sosial
- **Social Return on Investment (SROI)** — Analisis nilai sosial investasi
- Pendampingan dan pemberdayaan masyarakat
- Advokasi kebijakan tata kelola sumber daya alam

## 📄 Lisensi

© 2026 Yayasan Pemerhati Rimba Nusantara. All rights reserved.
