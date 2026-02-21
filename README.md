# 🌿 Yayasan Pemerhati Rimba Nusantara (YPRN)

Full-stack web application for **Yayasan Pemerhati Rimba Nusantara** — an Indonesian nonprofit dedicated to environmental conservation and forest preservation through community empowerment, research, policy advocacy, and environmental education.

Built with **React 19 + Vite 7** on the frontend and **Express 4 + PostgreSQL** on the backend.

## Features

- **Bilingual UI** — Indonesian and English with runtime language switching
- **Animated page transitions** — Framer Motion with lazy-loaded routes
- **Admin dashboard** — JWT-authenticated CRUD for activities, projects, hero banners, and videos
- **Image uploads** — Multer-based file uploads organized by category
- **Social Impact Assessment (SIA)** — Methodology pages and project gallery
- **Social Return on Investment (SROI)** — Analysis pages and project gallery
- **Performance optimized** — Gzip/Brotli pre-compression, code splitting, Terser minification, database connection pooling
- **Security hardened** — Helmet headers, bcrypt password hashing, parameterized SQL queries, CORS configuration
- **Vercel-ready frontend** — Pre-configured deployment with SPA rewrites and cache headers

## Tech Stack

| Layer    | Technology                                                      |
| -------- | --------------------------------------------------------------- |
| Frontend | React 19, Vite 7, Tailwind CSS 3, React Router 7, Framer Motion |
| Backend  | Express 4, PostgreSQL (Supabase), JWT, Multer, Helmet           |
| Language | JavaScript (JSX) — no TypeScript                                |
| Deploy   | Vercel (frontend), any Node.js host (backend)                   |

## Prerequisites

- **Node.js** >= 18
- **npm**
- **PostgreSQL** database (or a [Supabase](https://supabase.com) project)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/wildanapendi/MyCompany.git
cd MyCompany
```

### 2. Frontend setup

```bash
npm install
```

Create a `.env` file in the project root (optional — defaults to `http://localhost:5000/api`):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

### 3. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
JWT_SECRET=<random-secret-64-chars>
JWT_EXPIRES_IN=24h
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
```

> **Note:** If your password contains special characters like `[` or `]`, URL-encode them first (e.g. `%5B`, `%5D`).

### 4. Database setup

Run the migration and seed scripts:

```bash
cd backend
npm run db:setup        # runs migrate + seed
```

Or apply the migration SQL directly:

```bash
psql -h <host> -U <user> -d <database> -f backend/database/migration.sql
```

### 5. Start the backend

```bash
cd backend
npm run dev             # development with auto-reload
```

The API runs at `http://localhost:5000`.

## Available Scripts

### Frontend (run from repo root)

| Command                 | Description                             |
| ----------------------- | --------------------------------------- |
| `npm run dev`           | Start Vite dev server                   |
| `npm run build`         | Production build → `dist/`              |
| `npm run build:analyze` | Production build with bundle visualizer |
| `npm run preview`       | Preview production build locally        |

### Backend (run from `backend/`)

| Command                     | Description                             |
| --------------------------- | --------------------------------------- |
| `npm run dev`               | Dev server with `--watch`               |
| `npm start`                 | Start Express server                    |
| `npm run start:prod`        | Production mode (`NODE_ENV=production`) |
| `npm run migrate`           | Run database migrations                 |
| `npm run seed`              | Seed the database                       |
| `npm run db:setup`          | Migrate + seed in sequence              |
| `npm run db:reset-password` | Reset admin password                    |

## Project Structure

```
├── src/                        # React frontend
│   ├── components/
│   │   ├── admin/              # ProtectedRoute
│   │   ├── common/             # Navbar, Footer, Button, PageTransition
│   │   ├── contact/            # ContactForm, ContactInfo
│   │   ├── home/               # Hero, About, Stats, VideoSection
│   │   ├── portfolio/          # PortfolioCard, PortfolioGrid
│   │   └── team/               # TeamCard, TeamGrid
│   ├── config/api.js           # API URL configuration
│   ├── context/                # AuthContext, LanguageContext
│   ├── data/                   # Static data & translations (id/en)
│   ├── hooks/useLanguage.js    # Language hook
│   ├── pages/                  # Route-level page components
│   ├── utils/animations.js     # Shared animation variants
│   ├── App.jsx                 # Router & layout
│   └── main.jsx                # Entry point
├── backend/
│   ├── server.js               # Express API server
│   ├── database/migration.sql  # PostgreSQL schema
│   ├── scripts/                # migrate, seed, reset-password
│   └── uploads/                # Uploaded images (by category)
├── public/assets/              # Static images & SVGs
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── vercel.json                 # Vercel deployment config
```

## Routes

| Path                                    | Page               | Description                          |
| --------------------------------------- | ------------------ | ------------------------------------ |
| `/`                                     | Home               | Hero, about, stats, programs, CTA    |
| `/tentang/visi-misi`                    | Vision & Mission   | Organization values and mission      |
| `/tentang/struktur-organisasi`          | Org. Structure     | Board and management chart           |
| `/kegiatan`                             | Activities Gallery | Activity documentation from DB       |
| `/kegiatan/social-impact-assessment`    | SIA                | SIA methodology and project gallery  |
| `/kegiatan/social-return-on-investment` | SROI               | SROI methodology and project gallery |
| `/kontak`                               | Contact            | Contact info, address, Google Maps   |
| `/login`                                | Admin Login        | JWT authentication                   |
| `/admin/dashboard`                      | Admin Dashboard    | CRUD operations (protected)          |

## API Endpoints

All endpoints are prefixed with `/api`.

| Method   | Endpoint             | Auth | Description              |
| -------- | -------------------- | ---- | ------------------------ |
| `GET`    | `/health`            | No   | Health check & DB status |
| `POST`   | `/login`             | No   | Admin login              |
| `GET`    | `/verify`            | Yes  | Verify JWT token         |
| `GET`    | `/kegiatan`          | No   | List all activities      |
| `POST`   | `/kegiatan`          | Yes  | Create activity          |
| `PUT`    | `/kegiatan/:id`      | Yes  | Update activity          |
| `DELETE` | `/kegiatan/:id`      | Yes  | Delete activity          |
| `GET`    | `/hero-beranda`      | No   | List hero banners        |
| `POST`   | `/hero-beranda`      | Yes  | Create hero banner       |
| `PUT`    | `/hero-beranda/:id`  | Yes  | Update hero banner       |
| `DELETE` | `/hero-beranda/:id`  | Yes  | Delete hero banner       |
| `GET`    | `/proyek`            | No   | List projects (SIA/SROI) |
| `POST`   | `/proyek`            | Yes  | Create project           |
| `PUT`    | `/proyek/:id`        | Yes  | Update project           |
| `DELETE` | `/proyek/:id`        | Yes  | Delete project           |
| `GET`    | `/video-beranda`     | No   | List homepage videos     |
| `POST`   | `/video-beranda`     | Yes  | Upload video             |
| `DELETE` | `/video-beranda/:id` | Yes  | Delete video             |

**Auth** = requires `Authorization: Bearer <token>` header.

## Environment Variables

### Frontend (`.env` in project root)

| Variable       | Description          | Default                     |
| -------------- | -------------------- | --------------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### Backend (`.env` in `backend/`)

| Variable         | Description                | Example                          |
| ---------------- | -------------------------- | -------------------------------- |
| `PORT`           | Server port                | `5000`                           |
| `DATABASE_URL`   | PostgreSQL connection URI  | `postgresql://user:pass@host/db` |
| `JWT_SECRET`     | Secret key for signing JWT | 64-character random string       |
| `JWT_EXPIRES_IN` | Token expiration duration  | `24h`                            |
| `NODE_ENV`       | Runtime environment        | `development` or `production`    |

## Deployment

### Frontend (Vercel)

The repo includes a `vercel.json` with SPA rewrites and caching headers. Connect the repo to [Vercel](https://vercel.com) and set the `VITE_API_URL` environment variable to your production backend URL.

### Backend

Deploy the `backend/` directory to any Node.js hosting platform (Render, Railway, Fly.io, etc.). Set the environment variables listed above and run:

```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

© 2026 Yayasan Pemerhati Rimba Nusantara. All rights reserved.
