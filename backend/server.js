import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import pg from 'pg'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import process from 'node:process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { validateRequired, validateLength, validateNumber, sanitizeInput } from './middleware/validation.js'
import { safeDeleteFile } from './utils/fileUtils.js'

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

// CORS Configuration
const allowedOrigins = isProduction
  ? (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000']

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
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
// Pool dikonfigurasi untuk performa koneksi <1ms pada request berikutnya
// setelah warm-up awal (koneksi pertama tetap butuh network round-trip).
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },

  // === Pool Size ===
  max: 20, // Maksimum koneksi bersamaan
  min: 2, // Minimum koneksi idle yang selalu siap (warm pool)

  // === Timeout ===
  idleTimeoutMillis: 30000, // Koneksi idle ditutup setelah 30 detik
  connectionTimeoutMillis: 10000, // Waktu tunggu mendapatkan koneksi dari pool
  allowExitOnIdle: false, // Jangan tutup pool saat idle (keep connections warm)

  // === Query Safety ===
  // Catatan:
  // - Di Supabase / layanan managed lain, cold start atau network kadang >10s
  // - Jika timeout terlalu agresif, query sederhana seperti SELECT bisa gagal
  // - Kita naikkan batas ke 30 detik agar lebih stabil, tapi tetap ada batas atas
  statement_timeout: 30000, // Timeout query di sisi server (PostgreSQL)
  query_timeout: 30000, // Timeout query di sisi client (node-postgres)
})

// Pool warm-up: buat koneksi awal saat server start
// agar request pertama tidak perlu menunggu handshake TCP+SSL.
pool
  .connect()
  .then((client) => {
    client.release()
    console.log('Database pool warmed up — koneksi siap')
  })
  .catch((err) => {
    console.error('Database warm-up gagal:', err.message)
  })

// Pool error handler — cegah crash jika koneksi idle terputus
pool.on('error', (err) => {
  console.error('Pool idle client error:', err.message)
})

// Rate limiter untuk file uploads (mencegah spam/DoS)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 50, // maksimal 50 uploads per IP dalam 15 menit
  message: { message: 'Terlalu banyak upload. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiter untuk API endpoints umum (mencegah spam/DoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // maksimal 100 requests per IP dalam 15 menit
  message: { message: 'Terlalu banyak request. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Buat subfolder uploads per kategori
const kategoriDirs = ['kegiatan', 'sia', 'sroi', 'beranda', 'video']
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
  } catch {
    return res.status(401).json({ message: 'Token tidak valid' })
  }
}

// ==================== HEALTH CHECK ====================
// Endpoint untuk memantau performa pool dan latensi database.
// Berguna untuk monitoring production dan verifikasi target <1ms.
app.get('/api/health', async (req, res) => {
  const start = process.hrtime.bigint()
  try {
    await pool.query('SELECT 1')
    const end = process.hrtime.bigint()
    const latencyMs = Number(end - start) / 1_000_000 // nanoseconds -> ms

    const { totalCount, idleCount, waitingCount } = pool
    res.json({
      status: 'ok',
      db: {
        latency_ms: parseFloat(latencyMs.toFixed(3)),
        pool: {
          total: totalCount,
          idle: idleCount,
          waiting: waitingCount,
        },
      },
    })
  } catch (error) {
    res.status(503).json({ status: 'error', message: error.message })
  }
})

// ==================== AUTH ROUTES ====================

// Rate limiter untuk login endpoint (mencegah brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // maksimal 5 percobaan per IP
  message: { message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Login (tanpa register)
app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password harus diisi' })
    }

    // Cari admin berdasarkan username saja (password diverifikasi via bcrypt)
    const { rows } = await pool.query('SELECT * FROM admin WHERE username = $1', [username])

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

    const admin = rows[0]

    // Verifikasi password dengan bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username atau password salah' })
    }

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

// Multer config khusus untuk hero beranda
const heroStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(uploadsDir, 'beranda')
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

const uploadHero = multer({
  storage: heroStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

// ==================== HERO BERANDA ROUTES ====================

// Get all hero images (public)
app.get('/api/hero-beranda', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM hero_beranda ORDER BY urutan ASC, created_at DESC'
    )
    res.json(rows)
  } catch (error) {
    console.error('Get hero beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create hero image (admin only)
app.post('/api/hero-beranda', authMiddleware, uploadLimiter, uploadHero.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, urutan } = req.body
    const gambar = req.file ? `/uploads/beranda/${req.file.filename}` : null

    if (!gambar) {
      return res.status(400).json({ message: 'Gambar wajib diupload' })
    }

    const { rows: inserted } = await pool.query(
      'INSERT INTO hero_beranda (judul, deskripsi, gambar, urutan, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [judul || null, deskripsi || null, gambar, urutan || 0, req.admin.id]
    )

    res.status(201).json({
      message: 'Hero image berhasil ditambahkan',
      id: inserted[0].id,
    })
  } catch (error) {
    console.error('Create hero beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update hero image (admin only)
app.put('/api/hero-beranda/:id', authMiddleware, uploadLimiter, uploadHero.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, urutan } = req.body
    const id = req.params.id

    const { rows: existing } = await pool.query('SELECT * FROM hero_beranda WHERE id = $1', [id])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Hero image tidak ditemukan' })
    }

    let gambar = existing[0].gambar
    if (req.file) {
      // Hapus gambar lama
      if (gambar) {
        safeDeleteFile(gambar)
      }
      gambar = `/uploads/beranda/${req.file.filename}`
    }

    await pool.query(
      'UPDATE hero_beranda SET judul = $1, deskripsi = $2, gambar = $3, urutan = $4 WHERE id = $5',
      [judul || null, deskripsi || null, gambar, urutan || 0, id]
    )

    res.json({ message: 'Hero image berhasil diperbarui' })
  } catch (error) {
    console.error('Update hero beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete hero image (admin only)
app.delete('/api/hero-beranda/:id', authMiddleware, apiLimiter, async (req, res) => {
  try {
    const { rows: existing } = await pool.query('SELECT * FROM hero_beranda WHERE id = $1', [
      req.params.id,
    ])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Hero image tidak ditemukan' })
    }

    // Hapus file gambar
    if (existing[0].gambar) {
      safeDeleteFile(existing[0].gambar)
    }

    await pool.query('DELETE FROM hero_beranda WHERE id = $1', [req.params.id])
    res.json({ message: 'Hero image berhasil dihapus' })
  } catch (error) {
    console.error('Delete hero beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
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
// Create kegiatan (admin only)
app.post('/api/kegiatan', authMiddleware, uploadLimiter, sanitizeInput, validateRequired(['judul', 'deskripsi']), validateLength('judul', 3, 200), upload.single('gambar'), async (req, res) => {
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
app.put('/api/kegiatan/:id', authMiddleware, uploadLimiter, sanitizeInput, validateRequired(['judul', 'deskripsi']), validateLength('judul', 3, 200), upload.single('gambar'), async (req, res) => {
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
        safeDeleteFile(gambar)
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
app.delete('/api/kegiatan/:id', authMiddleware, apiLimiter, async (req, res) => {
  try {
    const { rows: existing } = await pool.query('SELECT * FROM kegiatan WHERE id = $1', [
      req.params.id,
    ])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan' })
    }

    // Hapus gambar
    if (existing[0].gambar) {
      safeDeleteFile(existing[0].gambar)
    }

    await pool.query('DELETE FROM kegiatan WHERE id = $1', [req.params.id])
    res.json({ message: 'Kegiatan berhasil dihapus' })
  } catch (error) {
    console.error('Delete kegiatan error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Multer config khusus untuk proyek
const proyekStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Fallback to 'sia' — file will be moved to correct folder after body is parsed
    const destDir = path.join(uploadsDir, 'sia')
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    cb(null, destDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'proyek-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const uploadProyek = multer({
  storage: proyekStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
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

// ==================== PROYEK ROUTES ====================

// Get all proyek (public) — optional filter by kategori
app.get('/api/proyek', async (req, res) => {
  try {
    const { kategori } = req.query
    let query = 'SELECT * FROM proyek'
    const params = []
    if (kategori) {
      query += ' WHERE kategori = $1'
      params.push(kategori)
    }
    query += ' ORDER BY created_at DESC'
    const { rows } = await pool.query(query, params)
    res.json(rows)
  } catch (error) {
    console.error('Get proyek error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single proyek (public)
app.get('/api/proyek/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM proyek WHERE id = $1', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Proyek tidak ditemukan' })
    }
    res.json(rows[0])
  } catch (error) {
    console.error('Get proyek detail error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create proyek (admin only)
app.post('/api/proyek', authMiddleware, uploadLimiter, uploadProyek.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, detail, tags, kategori } = req.body
    const kat = kategori || 'sia'
    let gambar = null

    if (req.file) {
      // Move file to correct kategori folder if needed
      const correctDir = path.join(uploadsDir, kat)
      if (!fs.existsSync(correctDir)) {
        fs.mkdirSync(correctDir, { recursive: true })
      }
      const currentPath = req.file.path
      const newPath = path.join(correctDir, req.file.filename)
      if (currentPath !== newPath) {
        fs.renameSync(currentPath, newPath)
      }
      gambar = `/uploads/${kat}/${req.file.filename}`
    }

    const tagsArray = tags
      ? typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : tags
      : []

    const { rows: inserted } = await pool.query(
      'INSERT INTO proyek (judul, deskripsi, detail, tags, gambar, kategori, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [judul, deskripsi || null, detail || null, tagsArray, gambar, kat, req.admin.id]
    )

    res.status(201).json({
      message: 'Proyek berhasil ditambahkan',
      id: inserted[0].id,
    })
  } catch (error) {
    console.error('Create proyek error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update proyek (admin only)
app.put('/api/proyek/:id', authMiddleware, uploadLimiter, uploadProyek.single('gambar'), async (req, res) => {
  try {
    const { judul, deskripsi, detail, tags, kategori } = req.body
    const id = req.params.id

    const { rows: existing } = await pool.query('SELECT * FROM proyek WHERE id = $1', [id])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Proyek tidak ditemukan' })
    }

    let gambar = existing[0].gambar
    const kat = kategori || 'sia'
    if (req.file) {
      if (gambar) {
        safeDeleteFile(gambar)
      }
      // Move file to correct kategori folder if needed
      const correctDir = path.join(uploadsDir, kat)
      if (!fs.existsSync(correctDir)) {
        fs.mkdirSync(correctDir, { recursive: true })
      }
      const currentPath = req.file.path
      const newPath = path.join(correctDir, req.file.filename)
      if (currentPath !== newPath) {
        fs.renameSync(currentPath, newPath)
      }
      gambar = `/uploads/${kat}/${req.file.filename}`
    }

    const tagsArray = tags
      ? typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : tags
      : existing[0].tags || []

    await pool.query(
      'UPDATE proyek SET judul = $1, deskripsi = $2, detail = $3, tags = $4, gambar = $5, kategori = $6 WHERE id = $7',
      [judul, deskripsi || null, detail || null, tagsArray, gambar, kat, id]
    )

    res.json({ message: 'Proyek berhasil diperbarui' })
  } catch (error) {
    console.error('Update proyek error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete proyek (admin only)
app.delete('/api/proyek/:id', authMiddleware, apiLimiter, async (req, res) => {
  try {
    const { rows: existing } = await pool.query('SELECT * FROM proyek WHERE id = $1', [
      req.params.id,
    ])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Proyek tidak ditemukan' })
    }

    if (existing[0].gambar) {
      safeDeleteFile(existing[0].gambar)
    }

    await pool.query('DELETE FROM proyek WHERE id = $1', [req.params.id])
    res.json({ message: 'Proyek berhasil dihapus' })
  } catch (error) {
    console.error('Delete proyek error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ==================== VIDEO BERANDA ====================

// Multer config khusus untuk video beranda (ukuran lebih besar, format video)
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(uploadsDir, 'video')
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    cb(null, destDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB untuk video
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|webm|ogg|mov/
    const allowedMimes = /video\/(mp4|webm|ogg|quicktime)/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedMimes.test(file.mimetype)
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Hanya file video (MP4, WebM, OGG, MOV) yang diizinkan!'))
    }
  },
})

// Get active video (public)
app.get('/api/video-beranda', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM video_beranda WHERE is_active = true ORDER BY created_at DESC LIMIT 1'
    )
    res.json(rows[0] || null)
  } catch (error) {
    console.error('Get video beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all videos (admin)
app.get('/api/video-beranda/all', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM video_beranda ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (error) {
    console.error('Get all video beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create video (admin only)
app.post('/api/video-beranda', authMiddleware, uploadLimiter, uploadVideo.single('video'), async (req, res) => {
  try {
    const { judul, deskripsi } = req.body
    const video = req.file ? `/uploads/video/${req.file.filename}` : null

    if (!video) {
      return res.status(400).json({ message: 'File video wajib diupload' })
    }

    // Nonaktifkan semua video lain agar hanya satu yang aktif
    await pool.query('UPDATE video_beranda SET is_active = false')

    const { rows: inserted } = await pool.query(
      'INSERT INTO video_beranda (judul, deskripsi, video, is_active, created_by) VALUES ($1, $2, $3, true, $4) RETURNING id',
      [judul || null, deskripsi || null, video, req.admin.id]
    )

    res.status(201).json({
      message: 'Video berhasil ditambahkan',
      id: inserted[0].id,
    })
  } catch (error) {
    console.error('Create video beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update video (admin only)
app.put('/api/video-beranda/:id', authMiddleware, uploadLimiter, uploadVideo.single('video'), async (req, res) => {
  try {
    const { judul, deskripsi } = req.body
    const id = req.params.id

    const { rows: existing } = await pool.query('SELECT * FROM video_beranda WHERE id = $1', [id])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Video tidak ditemukan' })
    }

    let video = existing[0].video
    if (req.file) {
      // Hapus video lama
      if (video) {
        safeDeleteFile(video)
      }
      video = `/uploads/video/${req.file.filename}`
    }

    await pool.query(
      'UPDATE video_beranda SET judul = $1, deskripsi = $2, video = $3 WHERE id = $4',
      [judul || null, deskripsi || null, video, id]
    )

    res.json({ message: 'Video berhasil diperbarui' })
  } catch (error) {
    console.error('Update video beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Set active video (admin only)
app.put('/api/video-beranda/:id/activate', authMiddleware, apiLimiter, async (req, res) => {
  try {
    const id = req.params.id

    const { rows: existing } = await pool.query('SELECT * FROM video_beranda WHERE id = $1', [id])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Video tidak ditemukan' })
    }

    // Aktifkan video yang dipilih dan nonaktifkan yang lain secara atomic
    await pool.query(
      'UPDATE video_beranda SET is_active = (id = $1)',
      [id]
    )

    res.json({ message: 'Video berhasil diaktifkan' })
  } catch (error) {
    console.error('Activate video beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete video (admin only)
app.delete('/api/video-beranda/:id', authMiddleware, apiLimiter, async (req, res) => {
  try {
    const { rows: existing } = await pool.query('SELECT * FROM video_beranda WHERE id = $1', [
      req.params.id,
    ])
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Video tidak ditemukan' })
    }

    // Hapus file video
    if (existing[0].video) {
      safeDeleteFile(existing[0].video)
    }

    await pool.query('DELETE FROM video_beranda WHERE id = $1', [req.params.id])
    res.json({ message: 'Video berhasil dihapus' })
  } catch (error) {
    console.error('Delete video beranda error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`)
  console.log(`🌍 Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`)
  console.log(`📁 Upload folder: ${uploadsDir}`)
})
