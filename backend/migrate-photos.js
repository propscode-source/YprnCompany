/**
 * Script Migrasi: Pindahkan foto lokal ke database
 * 
 * Cara pakai:
 *   cd backend
 *   node migrate-photos.js
 * 
 * Script ini akan:
 * 1. Copy semua foto dari public/assets/images/kegiatan/ ke backend/uploads/
 * 2. Insert data kegiatan ke database untuk setiap foto
 * 3. Setelah selesai, foto bisa diedit infonya lewat admin dashboard
 */

import fs from 'fs'
import path from 'path'
import mysql from 'mysql2/promise'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'kegiatan')
const UPLOADS_DIR = path.join(__dirname, 'uploads')

async function migrate() {
  console.log('🚀 Mulai migrasi foto ke database...\n')

  // Pastikan folder uploads ada
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  }

  // Koneksi database
  const pool = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rimba_nusantara',
  })

  // Baca semua file gambar dari folder sumber
  const files = fs.readdirSync(SOURCE_DIR).filter(f =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
  )

  if (files.length === 0) {
    console.log('❌ Tidak ada file gambar ditemukan di:', SOURCE_DIR)
    await pool.end()
    return
  }

  console.log(`📁 Ditemukan ${files.length} foto di ${SOURCE_DIR}\n`)

  let success = 0

  for (const file of files) {
    const sourcePath = path.join(SOURCE_DIR, file)
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file)
    const destPath = path.join(UPLOADS_DIR, uniqueName)

    try {
      // Copy file ke uploads
      fs.copyFileSync(sourcePath, destPath)

      // Buat judul dari nama file
      const namaAsli = path.parse(file).name
      const judul = namaAsli
        .replace(/\((\d+)\)/, 'Dokumentasi $1')
        .replace(/^kegiatan$/, 'Dokumentasi Kegiatan')
        .replace(/^kegiatan Dokumentasi/, 'Dokumentasi Kegiatan')

      // Insert ke database
      await pool.execute(
        'INSERT INTO kegiatan (judul, deskripsi, tanggal, lokasi, gambar, kategori, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          judul,
          'Dokumentasi kegiatan Yayasan Pemerhati Rimba Nusantara.',
          null,
          null,
          `/uploads/${uniqueName}`,
          'kegiatan',
          1, // admin id
        ]
      )

      console.log(`  ✅ ${file} → ${uniqueName}`)
      success++

      // Delay kecil agar nama file unik
      await new Promise(r => setTimeout(r, 50))
    } catch (err) {
      console.error(`  ❌ Gagal: ${file} -`, err.message)
    }
  }

  console.log(`\n✅ Selesai! ${success}/${files.length} foto berhasil dimigrasi.`)
  console.log('📝 Sekarang buka Admin Dashboard untuk edit judul, deskripsi, tanggal, dan lokasi tiap kegiatan.')

  await pool.end()
}

migrate().catch(console.error)
