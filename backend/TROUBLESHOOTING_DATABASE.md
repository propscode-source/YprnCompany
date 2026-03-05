# Troubleshooting Koneksi Database Supabase

## Error: "password authentication failed for user postgres"

Error ini terjadi karena password database tidak benar atau format connection string salah.

## Langkah-langkah Perbaikan

### 1. Dapatkan Password Database yang Benar

**Cara 1: Melalui Supabase Dashboard (Recommended)**

1. Buka https://supabase.com dan login ke project Anda
2. Klik **Project Settings** (ikon gear di sidebar kiri)
3. Pilih tab **Database**
4. Scroll ke bagian **Connection string**
5. Pilih tab **URI** atau **Connection pooling**
6. Copy connection string yang sudah lengkap dengan password
   - Format: `postgres://postgres.[project-ref]:[password]@...`
   - **JANGAN** copy yang masih ada placeholder `[YOUR-PASSWORD]`

**Cara 2: Reset Password (jika lupa)**

1. Masuk ke **Project Settings > Database**
2. Scroll ke bagian **Database password**
3. Klik **Reset database password**
4. Copy password baru yang di-generate
5. **PENTING**: Simpan password ini dengan aman!

### 2. URL-Encode Password Jika Mengandung Karakter Khusus

Jika password Anda mengandung karakter khusus, **WAJIB** di-encode:

| Karakter    | Encoding |
| ----------- | -------- |
| `-` (dash)  | `%2D`    |
| `@`         | `%40`    |
| `#`         | `%23`    |
| `$`         | `%24`    |
| ` ` (spasi) | `%20`    |
| `%`         | `%25`    |
| `&`         | `%26`    |
| `+`         | `%2B`    |
| `=`         | `%3D`    |

**Contoh:**

- Password asli: `My-Pass@123`
- Setelah encode: `My%2DPass%40123`
- Connection string: `postgres://postgres.xxx:My%2DPass%40123@...`

### 3. Pilih Format Connection String yang Tepat

Supabase menyediakan 3 jenis connection string:

#### Opsi 1: Transaction Pooler (Port 6543) - **RECOMMENDED**

```
postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

- ✅ Cocok untuk aplikasi web dengan banyak request
- ✅ Efisien untuk connection pooling
- ✅ Gunakan ini untuk production

#### Opsi 2: Session Pooler (Port 5432)

```
postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

- ✅ Alternatif jika port 6543 tidak bekerja
- ✅ Cocok untuk aplikasi yang butuh session-level features

#### Opsi 3: Direct Connection (Port 5432)

```
postgres://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

- ✅ Untuk migration/CLI tools
- ⚠️ Perlu IPv6 support
- ⚠️ Tidak menggunakan pooler

### 4. Update File `.env`

Edit file `backend/.env` dan ganti `[YOUR-PASSWORD]` dengan password yang benar:

```env
# Opsi 1 (Recommended)
DATABASE_URL=postgres://postgres.hmrtdkejvoeeadtxkikx:[PASSWORD-DI-SINI]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres

# Jika opsi 1 gagal, coba opsi 2 (uncomment baris ini dan comment opsi 1)
# DATABASE_URL=postgres://postgres.hmrtdkejvoeeadtxkikx:[PASSWORD-DI-SINI]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

### 5. Test Koneksi

Setelah update `.env`, test koneksi dengan menjalankan:

```bash
cd backend
node scripts/migrate.js
```

Atau jalankan server:

```bash
npm start
```

Jika berhasil, Anda akan melihat:

```
✅ Database pool warmed up — koneksi siap
✅ Server berjalan di http://localhost:5000
```

## Checklist Troubleshooting

- [ ] Password sudah benar (copy dari Supabase Dashboard, bukan placeholder)
- [ ] Password sudah di-URL-encode jika mengandung karakter khusus
- [ ] Format connection string sesuai dengan opsi yang dipilih
- [ ] Project reference (`hmrtdkejvoeeadtxkikx`) sudah benar
- [ ] Region (`ap-south-1`) sudah benar
- [ ] Port sudah benar (6543 untuk transaction pooler, 5432 untuk session/direct)
- [ ] File `.env` sudah di-save
- [ ] Server sudah di-restart setelah update `.env`

## Masalah Umum Lainnya

### IP Address Terblokir

Jika masih error setelah password benar, cek:

1. **Project Settings > Database > Connection pooling**
2. Scroll ke **IP allowlist** atau **Allowed IPs**
3. Pastikan IP Anda tidak terblokir
4. Atau tambahkan IP Anda ke whitelist

### SSL Certificate Error

Jika error terkait SSL, pastikan connection string menggunakan `postgres://` (bukan `postgresql://`) dan kode sudah set:

```javascript
ssl: {
  rejectUnauthorized: false;
}
```

### Connection Timeout

Jika timeout, coba:

1. Gunakan direct connection (opsi 3) untuk testing
2. Cek firewall/network Anda
3. Pastikan Supabase project masih aktif

## Bantuan Lebih Lanjut

- Dokumentasi Supabase: https://supabase.com/docs/guides/database/connecting-to-postgres
- Supabase Discord: https://discord.supabase.com
- Stack Overflow: Tag `supabase` dan `postgresql`
