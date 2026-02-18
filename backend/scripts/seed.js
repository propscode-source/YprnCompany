import 'dotenv/config'
import pg from 'pg'
import bcrypt from 'bcrypt'
import process from 'process'

const SALT_ROUNDS = 12

// Admin default yang akan dibuat
// PENTING: Password default akan ditampilkan di console saat seeding
// Untuk production, gunakan environment variable atau generate password random
const DEFAULT_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
const DEFAULT_ADMIN = {
  username: 'admin',
  password: DEFAULT_PASSWORD,
  nama_lengkap: 'Administrator',
  email: 'admin@rimbanusantara.com',
  role: 'superadmin',
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL belum diatur di .env!')
    process.exit(1)
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 2,
    connectionTimeoutMillis: 5000,
    statement_timeout: 10000,
  })

  try {
    // Test koneksi
    await pool.query('SELECT NOW()')
    console.log('Database terkoneksi.')

    // Cek apakah admin sudah ada
    const { rows: existing } = await pool.query('SELECT id FROM admin WHERE username = $1', [
      DEFAULT_ADMIN.username,
    ])

    if (existing.length > 0) {
      console.log(`Admin "${DEFAULT_ADMIN.username}" sudah ada (id: ${existing[0].id}). Skipping...`)
      console.log('Jika ingin reset password, jalankan: node scripts/reset-password.js')
      return
    }

    // Hash password dengan bcrypt
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, SALT_ROUNDS)

    // Insert admin
    const { rows: inserted } = await pool.query(
      'INSERT INTO admin (username, password, nama_lengkap, email, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, nama_lengkap, role',
      [DEFAULT_ADMIN.username, hashedPassword, DEFAULT_ADMIN.nama_lengkap, DEFAULT_ADMIN.email, DEFAULT_ADMIN.role]
    )

    console.log('\n✅ Admin berhasil dibuat:')
    console.log(`  Username : ${inserted[0].username}`)
    console.log(`  Nama     : ${inserted[0].nama_lengkap}`)
    console.log(`  Role     : ${inserted[0].role}`)
    console.log(`  Password : ${DEFAULT_ADMIN.password}`)
    console.log('\n⚠️  PENTING: Segera ganti password setelah login pertama!')
    console.log('   Gunakan: npm run db:reset-password')
  } catch (error) {
    console.error('Seed gagal:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seed()
