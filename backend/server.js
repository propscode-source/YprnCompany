import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import pg from 'pg'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET
const isProduction = process.env.NODE_ENV === 'production'

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET belum diatur di .env!')
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL belum diatur di .env!')
  process.exit(1)
}

// ==================== PRODUCTION MIDDLEWARE ====================
if (isProduction) {
  app.set('trust proxy', 1)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  )
}
app.use(compression())

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json())

// Serve uploaded files
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

// PostgreSQL Connection Pool (Supabase)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
})

// Buat subfolder uploads per kategori
const kategoriDirs = ['kegiatan', 'sia', 'sroi']
kategoriDirs.forEach((dir) => {
  const dirPath = path.join(uploadsDir, dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
})

// Multer config for image upload (simpan ke subfolder per kategori)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ambil kategori dari body, default 'kegiatan'
    const kategori = req.body.kategori || 'kegiatan'
    const destDir = path.join(uploadsDir, kategori)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    cb(null, destDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Hanya file gambar yang diizinkan!'))
    }
  },
})

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.admin = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' })
  }
}

// ==================== AUTH ROUTES ====================

// Login (tanpa register)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' })
    }

    const { rows } = await pool.query('SELECT * FROM admin WHERE username = $1 AND password = $2', [
      username,
      password,
    ])

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const admin = rows[0]
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role, nama: admin.nama_lengkap },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    res.json({
      message: 'Login berhasil',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        nama_lengkap: admin.nama_lengkap,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Verify token
app.get('/api/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, admin: req.admin })
})

// ==================== KEGIATAN ROUTES ====================

// Get all kegiatan (public)
app.get('/api/kegiatan', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM kegiatan ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    console.error('Get kegiatan error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single kegiatan
app.get('/api/kegiatan/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM kegiatan WHERE id = $1', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error('Get kegiatan detail error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create kegiatan (admin only)
app.post('/api/kegiatan', authMiddleware, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, tanggal, lokasi, kategori } = req.body
    const kat = kategori || 'kegiatan'
    const gambar = req.file ? `/uploads/${kat}/${req.file.filename}` : null

    const { rows: inserted } = await pool.query(
      'INSERT INTO kegiatan (judul, deskripsi, tanggal, lokasi, gambar, kategori, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [
        judul,
        deskripsi,
        tanggal || null,
        lokasi || null,
        gambar,
        kategori || 'kegiatan',
        req.admin.id,
      ]
    )

    res.status(201).json({
      message: 'Kegiatan berhasil ditambahkan',
      id: inserted[0].id,
    })
  } catch (error) {
    console.error('Create kegiatan error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update kegiatan (admin only)
app.put('/api/kegiatan/:id', authMiddleware, upload.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, tanggal, lokasi, kategori } = req.body
    const id = req.params.id

    // Ambil data lama
    const { rows: existing } = await pool.query('SELECT * FROM kegiatan WHERE id = $1', [id])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan' })
    }

    let gambar = existing[0].gambar
    const kat = kategori || 'kegiatan'
    if (req.file) {
      // Hapus gambar lama jika ada
      if (gambar) {
        const oldPath = path.join(__dirname, gambar)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      gambar = `/uploads/${kat}/${req.file.filename}`
    }

    await pool.query(
      'UPDATE kegiatan SET judul = $1, deskripsi = $2, tanggal = $3, lokasi = $4, gambar = $5, kategori = $6 WHERE id = $7',
      [judul, deskripsi, tanggal || null, lokasi || null, gambar, kategori || 'kegiatan', id]
    )

    res.json({ message: 'Kegiatan berhasil diperbarui' })
  } catch (error) {
    console.error('Update kegiatan error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete kegiatan (admin only)
app.delete('/api/kegiatan/:id', authMiddleware, async (req, res) => {
  try {
    const { rows: existing } = await pool.query('SELECT * FROM kegiatan WHERE id = $1', [
      req.params.id,
    ])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan' })
    }

    // Hapus gambar
    if (existing[0].gambar) {
      const imgPath = path.join(__dirname, existing[0].gambar)
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath)
      }
    }

    await pool.query('DELETE FROM kegiatan WHERE id = $1', [req.params.id])
    res.json({ message: 'Kegiatan berhasil dihapus' })
  } catch (error) {
    console.error('Delete kegiatan error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`)
  console.log(`🌍 Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`)
  console.log(`📁 Upload folder: ${uploadsDir}`)
})
