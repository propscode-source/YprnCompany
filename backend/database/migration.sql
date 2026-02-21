-- ============================================
-- Migration: Rimba Nusantara Database Schema
-- Database: PostgreSQL / Supabase
-- ============================================
-- Jalankan file ini di Supabase SQL Editor
-- atau via: psql -U postgres -d rimba_nusantara -f migration.sql
--
-- Jika database belum ada:
--   psql -U postgres -c "CREATE DATABASE rimba_nusantara;"
--
-- Setelah migration, jalankan seed:
--   node scripts/seed.js
-- ============================================


-- ============================================
-- Extension: pgcrypto
-- Digunakan untuk hashing password langsung di level database.
-- Supabase sudah menyertakan extension ini secara default.
-- ============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- ENUM Types
-- ============================================

DO $$ BEGIN
    CREATE TYPE role_enum AS ENUM ('superadmin', 'admin');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE kategori_enum AS ENUM ('kegiatan', 'sia', 'sroi');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- Trigger Function untuk updated_at
-- PostgreSQL tidak mendukung ON UPDATE CURRENT_TIMESTAMP,
-- sehingga digunakan trigger function.
-- ============================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. Tabel Admin
-- ============================================

CREATE TABLE IF NOT EXISTS admin (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    -- Password HARUS berupa bcrypt hash (diawali $2a$ atau $2b$).
    -- Constraint di bawah mencegah penyimpanan plain text secara tidak sengaja.
    password      VARCHAR(255) NOT NULL
                    CONSTRAINT password_must_be_hashed
                    CHECK (password ~ '^\$2[aby]\$'),
    nama_lengkap  VARCHAR(100) NOT NULL,
    email         VARCHAR(100),
    role          role_enum    NOT NULL DEFAULT 'admin',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_admin_updated_at
    BEFORE UPDATE ON admin
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- 2. Tabel Hero Beranda
-- ============================================

CREATE TABLE IF NOT EXISTS hero_beranda (
    id          SERIAL PRIMARY KEY,
    judul       VARCHAR(255),
    deskripsi   TEXT,
    gambar      VARCHAR(500) NOT NULL,
    urutan      INT          NOT NULL DEFAULT 0,
    created_by  INT REFERENCES admin(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_hero_beranda_updated_at
    BEFORE UPDATE ON hero_beranda
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- 3. Tabel Kegiatan
-- ============================================

CREATE TABLE IF NOT EXISTS kegiatan (
    id          SERIAL PRIMARY KEY,
    judul       VARCHAR(255) NOT NULL,
    deskripsi   TEXT,
    tanggal     DATE,
    lokasi      VARCHAR(255),
    gambar      VARCHAR(500),
    kategori    kategori_enum NOT NULL DEFAULT 'kegiatan',
    created_by  INT REFERENCES admin(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_kegiatan_updated_at
    BEFORE UPDATE ON kegiatan
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- 4. Tabel Proyek (SIA & SROI)
-- ============================================

DO $$ BEGIN
    CREATE TYPE proyek_kategori_enum AS ENUM ('sia', 'sroi');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS proyek (
    id          SERIAL PRIMARY KEY,
    judul       VARCHAR(255) NOT NULL,
    deskripsi   TEXT,
    detail      TEXT,
    tags        TEXT[],
    gambar      VARCHAR(500),
    kategori    proyek_kategori_enum NOT NULL DEFAULT 'sia',
    created_by  INT REFERENCES admin(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_proyek_updated_at
    BEFORE UPDATE ON proyek
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- 5. Tabel Video Beranda
-- Menyimpan video yang ditampilkan di section video halaman utama.
-- Hanya satu video yang aktif (is_active = true) pada satu waktu.
-- ============================================

CREATE TABLE IF NOT EXISTS video_beranda (
    id          SERIAL PRIMARY KEY,
    judul       VARCHAR(255),
    deskripsi   TEXT,
    video       VARCHAR(500) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT true,
    created_by  INT REFERENCES admin(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_video_beranda_updated_at
    BEFORE UPDATE ON video_beranda
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- Indexes untuk performa query
-- ============================================

CREATE INDEX IF NOT EXISTS idx_admin_username ON admin(username);
CREATE INDEX IF NOT EXISTS idx_kegiatan_kategori ON kegiatan(kategori);
CREATE INDEX IF NOT EXISTS idx_kegiatan_created_at ON kegiatan(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hero_beranda_urutan ON hero_beranda(urutan ASC);
CREATE INDEX IF NOT EXISTS idx_proyek_kategori ON proyek(kategori);
CREATE INDEX IF NOT EXISTS idx_proyek_created_at ON proyek(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_beranda_is_active ON video_beranda(is_active);

-- ============================================
-- Seed Data: Default Admin
-- Password di-hash menggunakan pgcrypto (bcrypt, bf algorithm).
-- Default password: 'admin123' — SEGERA GANTI setelah login pertama!
--
-- Alternatif: jalankan `node scripts/seed.js` untuk seed via aplikasi.
-- ============================================

INSERT INTO admin (username, password, nama_lengkap, email, role)
VALUES (
    'admin',
    crypt('Yayasan-pemerhati', gen_salt('bf', 10)),
    'Administrator',
    'admin@rimbanusantara.com',
    'superadmin'
)
ON CONFLICT (username) DO NOTHING;
