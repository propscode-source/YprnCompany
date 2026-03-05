# Scripts Documentation

Dokumentasi untuk script-script helper di folder `backend/scripts/`.

## 📋 Daftar Scripts

### 1. `migrate.js` - Database Migration

Menjalankan migration SQL untuk membuat tabel-tabel yang diperlukan.

**Usage:**

```bash
node scripts/migrate.js
```

**Fitur:**

- Membuat tabel: `admin`, `hero_beranda`, `kegiatan`
- Membuat indexes untuk performa
- Membuat triggers untuk `updated_at` otomatis
- Verifikasi tabel setelah migration

**Catatan:**

- Pastikan `DATABASE_URL` sudah diatur di `.env`
- Script akan exit jika migration gagal

---

### 2. `seed.js` - Seed Default Admin

Membuat admin default untuk testing/login pertama kali.

**Usage:**

```bash
node scripts/seed.js
```

**Default Admin:**

- Username: `admin`
- Password: `admin123`
- Role: `superadmin`

**Fitur:**

- Cek apakah admin sudah ada (skip jika sudah ada)
- Hash password menggunakan bcrypt (salt rounds: 12)
- Menampilkan informasi admin yang dibuat

**Catatan:**

- ⚠️ **PENTING**: Segera ganti password setelah login pertama!
- Jika admin sudah ada, gunakan `reset-password.js` untuk reset password

---

### 3. `reset-password.js` - Reset Password (Command Line)

Reset password admin melalui command line arguments.

**Usage:**

```bash
node scripts/reset-password.js <username> <new-password>
```

**Contoh:**

```bash
node scripts/reset-password.js admin password_baru_123
```

**Fitur:**

- Validasi koneksi database
- Validasi password (minimal 6 karakter)
- Hash password menggunakan bcrypt (salt rounds: 12)
- Update timestamp otomatis
- Error handling yang komprehensif
- Menampilkan informasi admin sebelum update

**Validasi:**

- Password minimal 6 karakter
- Username harus ada di database

**Error Handling:**

- Database connection error
- Username tidak ditemukan
- Password validation error
- Database constraint error

---

### 4. `update-password.js` - Update Password (Interaktif)

Update password admin dengan input interaktif (lebih user-friendly).

**Usage:**

```bash
node scripts/update-password.js
```

**Fitur:**

- Input interaktif menggunakan readline
- Password input disembunyikan (hidden)
- Konfirmasi password (harus match)
- Preview sebelum update
- Konfirmasi final sebelum update
- Hash password menggunakan bcrypt (salt rounds: 12)
- Menampilkan informasi lengkap admin

**Flow:**

1. Test koneksi database
2. Input username
3. Cek apakah username ada
4. Input password baru (hidden)
5. Konfirmasi password (hidden)
6. Preview informasi
7. Konfirmasi final (y/N)
8. Update password

**Catatan:**

- Lebih aman karena password tidak terlihat di command history
- Cocok untuk penggunaan manual/interaktif

---

### 5. `test-connection.js` - Test Database Connection

Test koneksi database dan menampilkan informasi lengkap.

**Usage:**

```bash
node scripts/test-connection.js
```

**Fitur:**

- Test basic connection
- Menampilkan PostgreSQL version
- List semua tabel di database
- Menampilkan connection pool stats
- Menampilkan latency koneksi
- Mask password di output (untuk keamanan)

**Output:**

- ✅ Connection successful dengan latency
- ✅ PostgreSQL version
- ✅ List tabel yang ditemukan
- ✅ Pool statistics
- 💡 Next steps yang disarankan

**Error Handling:**

- Password authentication failed
- Connection timeout
- DNS/Network error
- Memberikan troubleshooting tips untuk setiap error

---

### 6. `encode-password.js` - URL-Encode Password

Helper untuk URL-encode password database (untuk connection string).

**Usage:**

```bash
node scripts/encode-password.js "your-password"
```

**Contoh:**

```bash
node scripts/encode-password.js "My-Pass@123"
```

**Output:**

- Original password
- Encoded password
- Character mapping (karakter yang di-encode)
- Contoh connection string yang sudah di-encode

**Kapan digunakan:**

- Ketika password database mengandung karakter khusus
- Saat setup `DATABASE_URL` di `.env`
- Karakter yang perlu di-encode: `-`, `@`, `#`, `$`, spasi, dll

---

## 🔐 Password Hashing

Semua script menggunakan **bcrypt** untuk hashing password dengan konfigurasi:

- **Algorithm**: bcrypt
- **Salt Rounds**: 12 (recommended untuk production)
- **Format**: `$2a$`, `$2b$`, atau `$2y$`

**Contoh hash:**

```
$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5GyY5GyYu
```

**Validasi di Database:**

- Database memiliki constraint `CHECK (password ~ '^\$2[aby]\$')`
- Mencegah penyimpanan plain text password
- Hanya menerima bcrypt hash yang valid

---

## 🚀 Quick Start

### Setup Database Baru

```bash
# 1. Test koneksi database
node scripts/test-connection.js

# 2. Run migration (buat tabel)
node scripts/migrate.js

# 3. Seed admin default
node scripts/seed.js

# 4. Reset password admin (opsional, tapi disarankan)
node scripts/reset-password.js admin password_aman_123
```

### Update Password Admin

**Opsi 1: Command Line (Cepat)**

```bash
node scripts/reset-password.js admin password_baru_123
```

**Opsi 2: Interaktif (Lebih Aman)**

```bash
node scripts/update-password.js
```

---

## ⚠️ Troubleshooting

### Error: "password authentication failed"

- Pastikan `DATABASE_URL` di `.env` sudah benar
- Jika password mengandung karakter khusus, URL-encode terlebih dahulu
- Lihat `TROUBLESHOOTING_DATABASE.md` untuk panduan lengkap

### Error: "Admin tidak ditemukan"

- Pastikan migration sudah dijalankan (`node scripts/migrate.js`)
- Pastikan seed sudah dijalankan (`node scripts/seed.js`)
- Cek username dengan benar (case-sensitive)

### Error: "Password minimal 6 karakter"

- Gunakan password minimal 6 karakter
- Password yang lebih panjang lebih aman

### Error: "Connection timeout"

- Cek koneksi internet
- Pastikan Supabase project masih aktif
- Coba gunakan connection string alternatif di `.env`

---

## 📚 Referensi

- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
- [PostgreSQL Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres)

---

## 🔒 Security Best Practices

1. **Jangan commit `.env` ke git** - sudah ada di `.gitignore`
2. **Gunakan password yang kuat** - minimal 12 karakter, kombinasi huruf, angka, simbol
3. **Ganti password default** - segera setelah setup pertama kali
4. **Gunakan environment variables** - jangan hardcode credentials
5. **Hash password selalu** - jangan pernah simpan plain text password
6. **Gunakan HTTPS** - untuk production, selalu gunakan SSL/TLS

---

## 📝 Notes

- Semua script menggunakan ES modules (`import/export`)
- Semua script memerlukan `dotenv/config` untuk load `.env`
- Semua script memiliki error handling yang komprehensif
- Semua script menampilkan pesan yang informatif dan user-friendly
