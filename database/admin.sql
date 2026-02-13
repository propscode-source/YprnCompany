-- ============================================
-- SQL Script: Tabel Admin untuk Rimba Nusantara
-- Database: PostgreSQL
-- Migrasi dari MySQL
-- ============================================

-- Buat database dijalankan terpisah via psql CLI karena CREATE DATABASE
-- tidak bisa dijalankan dalam transaction block.
-- Jalankan: psql -U postgres -c "CREATE DATABASE rimba_nusantara;"
-- Lalu koneksi ke DB: psql -U postgres -d rimba_nusantara -f admin_postgres.sql



-- ============================================
-- ENUM Types
-- PostgreSQL memerlukan deklarasi ENUM sebagai TYPE tersendiri,
-- berbeda dengan MySQL yang inline di kolom definisi.
-- ============================================

CREATE TYPE role_enum AS ENUM ('superadmin', 'admin');
CREATE TYPE kategori_enum AS ENUM ('kegiatan', 'sia', 'sroi');

-- ============================================
-- Trigger Function untuk updated_at
-- PostgreSQL tidak mendukung ON UPDATE CURRENT_TIMESTAMP secara native,
-- sehingga kita gunakan trigger function yang dipanggil sebelum setiap UPDATE.
-- Satu function ini dipakai ulang oleh semua tabel (DRY principle).
-- ============================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    -- NEW merujuk ke row baru yang akan disimpan
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Tabel Admin
-- SERIAL = shorthand untuk sequence + INTEGER + DEFAULT nextval(),
-- ekivalen dengan AUTO_INCREMENT di MySQL.
-- ============================================

CREATE TABLE IF NOT EXISTS admin (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    -- CATATAN KEAMANAN: Kolom ini menyimpan plain text password.
    -- Hanya untuk environment development. Di production, gunakan
    -- bcrypt/argon2 dan simpan hash-nya saja.
    password      VARCHAR(255) NOT NULL,
    nama_lengkap  VARCHAR(100) NOT NULL,
    email         VARCHAR(100),
    role          role_enum    NOT NULL DEFAULT 'admin',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Trigger memanggil function di atas setiap kali row di tabel admin di-UPDATE
CREATE TRIGGER set_admin_updated_at
    BEFORE UPDATE ON admin
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- ============================================
-- Tabel Kegiatan
-- ============================================

CREATE TABLE IF NOT EXISTS kegiatan (
    id          SERIAL PRIMARY KEY,
    judul       VARCHAR(255) NOT NULL,
    deskripsi   TEXT,
    tanggal     DATE,
    lokasi      VARCHAR(255),
    -- Path ke file gambar; VARCHAR cukup, TEXT juga valid jika ingin unlimited
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
-- Seed Data: Default Admin
-- Plain password 'admin123' — ganti dengan hash sebelum ke production
-- ============================================

INSERT INTO admin (username, password, nama_lengkap, email, role)
VALUES ('admin', 'admin123', 'Administrator', 'admin@rimbanusantara.com', 'superadmin')
ON CONFLICT (username) DO NOTHING; -- Idempotent: aman dijalankan ulang

-- ============================================
-- Cara Penggunaan:
-- 1. psql -U postgres -c "CREATE DATABASE rimba_nusantara;"
-- 2. psql -U postgres -d rimba_nusantara -f admin_postgres.sql
-- 3. Login dengan:
--    Username: admin
--    Password: admin123
-- ============================================
