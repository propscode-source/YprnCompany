import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pg from "pg";
import multer from "multer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import process from "node:process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  initRedis,
  getCache,
  setCache,
  deletePattern,
  getRedisStatus,
} from "./config/redisClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET belum diatur di .env!");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL belum diatur di .env!");
  process.exit(1);
}

// Pastikan direktori uploads ada
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==================== MIDDLEWARE GLOBAL ====================

if (isProduction) {
  app.set("trust proxy", 1);
  app.use(compression());

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          scriptSrcAttr: ["'unsafe-inline'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:", "https://rimbanusantara.or.id"],
          mediaSrc: ["'self'", "blob:", "https://rimbanusantara.or.id"],
          connectSrc: ["'self'", "blob:", "https://rimbanusantara.or.id"],
          frameSrc: ["'self'", "https://www.google.com"],
          workerSrc: ["'self'", "blob:"],
        },
      },
    }),
  );
}

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Content-Type"],
  }),
);

app.use(express.json());

// Cloudflare WAF interceptor (dari kode Anda sebelumnya)
app.use("/api", (req, res, next) => {
  const isUploadRoute =
    req.method !== "GET" &&
    (req.path.includes("/hero-beranda") ||
      req.path.includes("/kegiatan") ||
      req.path.includes("/proyek") ||
      req.path.includes("/video-beranda"));

  if (isUploadRoute) {
    return next();
  }

  const originalSend = res.send.bind(res);
  res.send = function interceptSend(body) {
    if (typeof body === "string" && body.trimStart().startsWith("<!")) {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.statusCode = res.statusCode === 200 ? 403 : res.statusCode;
      }
      const cfRayId = res.getHeader("CF-RAY") || "not-available";
      return originalSend(
        JSON.stringify({
          error: "Cloudflare WAF Block",
          message: "Request diblokir oleh Cloudflare WAF.",
          cf_ray: cfRayId,
          status: res.statusCode,
        }),
      );
    }
    return originalSend(body);
  };
  next();
});

// ==================== FIX #2: UPLOADS & 404 HANDLER ====================
// Serve static uploads
app.use(
  "/uploads",
  express.static(uploadsDir, {
    maxAge: "30d",
    immutable: true,
    etag: true,
    lastModified: true,
    // Mencegah request "jatuh" ke router SPA jika file tidak ada
    fallthrough: false,
  }),
);

// Handler khusus jika file di /uploads tidak ditemukan
app.use("/uploads", (err, req, res, next) => {
  if (err.status === 404 || err.statusCode === 404) {
    return res.status(404).json({
      error: "File tidak ditemukan",
      path: req.path,
    });
  }
  next(err);
});

// ==================== DATABASE & CACHE ====================
initRedis();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  min: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: false,
  statement_timeout: 30000,
  query_timeout: 30000,
});

pool
  .connect()
  .then((client) => {
    client.release();
    console.log("Database pool warmed up");
  })
  .catch((err) => console.error("Database warm-up gagal:", err.message));

pool.on("error", (err) =>
  console.error("Pool idle client error:", err.message),
);

const cachePublicApi =
  (duration = 300) =>
  (req, res, next) => {
    if (req.method === "GET") {
      res.set(
        "Cache-Control",
        `public, max-age=${duration}, stale-while-revalidate=${duration * 2}`,
      );
    }
    next();
  };

// ==================== SETUP UPLOADS DIRECTORIES ====================
const kategoriDirs = ["kegiatan", "sia", "sroi", "beranda", "video"];
kategoriDirs.forEach((dir) => {
  const dirPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

// Multer Configs (Umum, Hero, Proyek, Video)
const createDiskStorage = (defaultFolder, prefix = "") =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = req.body.kategori || defaultFolder;
      const destDir = path.join(uploadsDir, folder);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${prefix}${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

const upload = multer({
  storage: createDiskStorage("kegiatan"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|gif|webp/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Hanya gambar!"));
  },
});

const uploadHero = multer({
  storage: createDiskStorage("beranda"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: upload.fileFilter,
});

const uploadProyek = multer({
  storage: createDiskStorage("sia", "proyek-"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: upload.fileFilter,
});

const uploadVideo = multer({
  storage: createDiskStorage("video", "video-"),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/video\/(mp4|webm|ogg|quicktime)/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Hanya video!"));
  },
});

// ==================== API ROUTES ====================
// Di sini Anda bisa memanggil routes external jika ada
// app.use("/api", require("./routes"));

app.get("/api/health", async (req, res) => {
  const start = process.hrtime.bigint();
  try {
    await pool.query("SELECT 1");
    const end = process.hrtime.bigint();
    const redis = getRedisStatus();
    res.json({
      status: "ok",
      db: {
        latency_ms: parseFloat((Number(end - start) / 1_000_000).toFixed(3)),
      },
      cache: { redis: redis.status, connected: redis.connected },
    });
  } catch (error) {
    res.status(503).json({ status: "error", message: error.message });
  }
});

// --- Auth Routes ---
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Isi semua field" });

    const { rows } = await pool.query(
      "SELECT * FROM admin WHERE username = $1",
      [username],
    );
    if (
      rows.length === 0 ||
      !(await bcrypt.compare(password, rows[0].password))
    ) {
      return res.status(401).json({ message: "Kredensial salah" });
    }

    const admin = rows[0];
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        nama: admin.nama_lengkap,
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    );
    res.json({
      message: "Login berhasil",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        nama_lengkap: admin.nama_lengkap,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/verify", authMiddleware, (req, res) =>
  res.json({ valid: true, admin: req.admin }),
);

app.post("/api/forgot-password", async (req, res) => {
  try {
    const { username, email, newPassword, confirmPassword } = req.body;
    if (!username || !email || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "Isi semua field" });
    if (newPassword.length < 6 || newPassword !== confirmPassword)
      return res.status(400).json({ message: "Password tidak valid" });

    const { rows } = await pool.query(
      "SELECT id FROM admin WHERE username = $1 AND email = $2",
      [username, email],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query(
      "UPDATE admin SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, rows[0].id],
    );
    res.json({ message: "Password direset" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- Hero Beranda Routes ---
app.get("/api/hero-beranda", cachePublicApi(300), async (req, res) => {
  try {
    const cached = await getCache("hero:beranda:all");
    if (cached) return res.json(cached);
    const { rows } = await pool.query(
      "SELECT * FROM hero_beranda ORDER BY urutan ASC, created_at DESC",
    );
    await setCache("hero:beranda:all", rows, 300);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/api/hero-beranda",
  authMiddleware,
  uploadHero.single("gambar"),
  async (req, res) => {
    try {
      const { judul, deskripsi, urutan } = req.body;
      const gambar = req.file ? `/uploads/beranda/${req.file.filename}` : null;
      if (!gambar) return res.status(400).json({ message: "Gambar wajib" });

      const { rows } = await pool.query(
        "INSERT INTO hero_beranda (judul, deskripsi, gambar, urutan, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [judul || null, deskripsi || null, gambar, urutan || 0, req.admin.id],
      );
      await deletePattern("hero:beranda:*");
      res.status(201).json({ message: "Berhasil", id: rows[0].id });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

app.put(
  "/api/hero-beranda/:id",
  authMiddleware,
  uploadHero.single("gambar"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const { rows: existing } = await pool.query(
        "SELECT * FROM hero_beranda WHERE id = $1",
        [id],
      );
      if (existing.length === 0)
        return res.status(404).json({ message: "Tidak ditemukan" });

      let gambar = existing[0].gambar;
      if (req.file) {
        if (gambar && fs.existsSync(path.join(__dirname, gambar)))
          fs.unlinkSync(path.join(__dirname, gambar));
        gambar = `/uploads/beranda/${req.file.filename}`;
      }

      await pool.query(
        "UPDATE hero_beranda SET judul = $1, deskripsi = $2, gambar = $3, urutan = $4 WHERE id = $5",
        [
          req.body.judul || null,
          req.body.deskripsi || null,
          gambar,
          req.body.urutan || 0,
          id,
        ],
      );
      await deletePattern("hero:beranda:*");
      res.json({ message: "Berhasil" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

app.delete("/api/hero-beranda/:id", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT gambar FROM hero_beranda WHERE id = $1",
      [req.params.id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Tidak ditemukan" });

    if (rows[0].gambar && fs.existsSync(path.join(__dirname, rows[0].gambar)))
      fs.unlinkSync(path.join(__dirname, rows[0].gambar));
    await pool.query("DELETE FROM hero_beranda WHERE id = $1", [req.params.id]);
    await deletePattern("hero:beranda:*");
    res.json({ message: "Berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- Kegiatan Routes ---
app.get("/api/kegiatan", cachePublicApi(300), async (req, res) => {
  try {
    const cached = await getCache("kegiatan:all");
    if (cached) return res.json(cached);
    const { rows } = await pool.query(
      "SELECT * FROM kegiatan ORDER BY created_at DESC",
    );
    await setCache("kegiatan:all", rows, 300);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/kegiatan/:id", async (req, res) => {
  try {
    const cached = await getCache(`kegiatan:detail:${req.params.id}`);
    if (cached) return res.json(cached);
    const { rows } = await pool.query("SELECT * FROM kegiatan WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Tidak ditemukan" });
    await setCache(`kegiatan:detail:${req.params.id}`, rows[0], 600);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/api/kegiatan",
  authMiddleware,
  upload.single("gambar"),
  async (req, res) => {
    try {
      const kat = req.body.kategori || "kegiatan";
      const gambar = req.file ? `/uploads/${kat}/${req.file.filename}` : null;
      const { rows } = await pool.query(
        "INSERT INTO kegiatan (judul, deskripsi, tanggal, lokasi, gambar, kategori, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [
          req.body.judul,
          req.body.deskripsi,
          req.body.tanggal || null,
          req.body.lokasi || null,
          gambar,
          kat,
          req.admin.id,
        ],
      );
      await deletePattern("kegiatan:*");
      res.status(201).json({ message: "Berhasil", id: rows[0].id });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

app.put(
  "/api/kegiatan/:id",
  authMiddleware,
  upload.single("gambar"),
  async (req, res) => {
    try {
      const { rows: existing } = await pool.query(
        "SELECT * FROM kegiatan WHERE id = $1",
        [req.params.id],
      );
      if (existing.length === 0)
        return res.status(404).json({ message: "Tidak ditemukan" });

      const kat = req.body.kategori || "kegiatan";
      let gambar = existing[0].gambar;
      if (req.file) {
        if (gambar && fs.existsSync(path.join(__dirname, gambar)))
          fs.unlinkSync(path.join(__dirname, gambar));
        gambar = `/uploads/${kat}/${req.file.filename}`;
      }

      await pool.query(
        "UPDATE kegiatan SET judul = $1, deskripsi = $2, tanggal = $3, lokasi = $4, gambar = $5, kategori = $6 WHERE id = $7",
        [
          req.body.judul,
          req.body.deskripsi,
          req.body.tanggal || null,
          req.body.lokasi || null,
          gambar,
          kat,
          req.params.id,
        ],
      );
      await deletePattern("kegiatan:*");
      res.json({ message: "Berhasil" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

app.delete("/api/kegiatan/:id", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT gambar FROM kegiatan WHERE id = $1",
      [req.params.id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Tidak ditemukan" });

    if (rows[0].gambar && fs.existsSync(path.join(__dirname, rows[0].gambar)))
      fs.unlinkSync(path.join(__dirname, rows[0].gambar));
    await pool.query("DELETE FROM kegiatan WHERE id = $1", [req.params.id]);
    await deletePattern("kegiatan:*");
    res.json({ message: "Berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- Proyek Routes ---
app.get("/api/proyek", cachePublicApi(300), async (req, res) => {
  try {
    const { kategori } = req.query;
    const key = kategori ? `proyek:all:${kategori}` : "proyek:all";
    const cached = await getCache(key);
    if (cached) return res.json(cached);

    const query = kategori
      ? "SELECT * FROM proyek WHERE kategori = $1 ORDER BY created_at DESC"
      : "SELECT * FROM proyek ORDER BY created_at DESC";
    const { rows } = await pool.query(query, kategori ? [kategori] : []);
    await setCache(key, rows, 300);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/proyek/:id", async (req, res) => {
  try {
    const cached = await getCache(`proyek:detail:${req.params.id}`);
    if (cached) return res.json(cached);
    const { rows } = await pool.query("SELECT * FROM proyek WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Tidak ditemukan" });
    await setCache(`proyek:detail:${req.params.id}`, rows[0], 600);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/api/proyek",
  authMiddleware,
  uploadProyek.single("gambar"),
  async (req, res) => {
    try {
      const kat = req.body.kategori || "sia";
      let gambar = null;
      if (req.file) {
        const dir = path.join(uploadsDir, kat);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const newPath = path.join(dir, req.file.filename);
        if (req.file.path !== newPath) fs.renameSync(req.file.path, newPath);
        gambar = `/uploads/${kat}/${req.file.filename}`;
      }

      const tagsArray = req.body.tags
        ? typeof req.body.tags === "string"
          ? req.body.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : req.body.tags
        : [];
      const { rows } = await pool.query(
        "INSERT INTO proyek (judul, deskripsi, detail, tags, gambar, kategori, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [
          req.body.judul,
          req.body.deskripsi || null,
          req.body.detail || null,
          tagsArray,
          gambar,
          kat,
          req.admin.id,
        ],
      );
      await deletePattern("proyek:*");
      res.status(201).json({ message: "Berhasil", id: rows[0].id });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

app.put(
  "/api/proyek/:id",
  authMiddleware,
  uploadProyek.single("gambar"),
  async (req, res) => {
    try {
      const { rows: existing } = await pool.query(
        "SELECT * FROM proyek WHERE id = $1",
        [req.params.id],
      );
      if (existing.length === 0)
        return res.status(404).json({ message: "Tidak ditemukan" });

      const kat = req.body.kategori || "sia";
      let gambar = existing[0].gambar;
      if (req.file) {
        if (gambar && fs.existsSync(path.join(__dirname, gambar)))
          fs.unlinkSync(path.join(__dirname, gambar));
        const dir = path.join(uploadsDir, kat);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const newPath = path.join(dir, req.file.filename);
        if (req.file.path !== newPath) fs.renameSync(req.file.path, newPath);
        gambar = `/uploads/${kat}/${req.file.filename}`;
      }

      const tagsArray = req.body.tags
        ? typeof req.body.tags === "string"
          ? req.body.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : req.body.tags
        : existing[0].tags || [];
      await pool.query(
        "UPDATE proyek SET judul = $1, deskripsi = $2, detail = $3, tags = $4, gambar = $5, kategori = $6 WHERE id = $7",
        [
          req.body.judul,
          req.body.deskripsi || null,
          req.body.detail || null,
          tagsArray,
          gambar,
          kat,
          req.params.id,
        ],
      );
      await deletePattern("proyek:*");
      res.json({ message: "Berhasil" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

app.delete("/api/proyek/:id", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT gambar FROM proyek WHERE id = $1",
      [req.params.id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Tidak ditemukan" });

    if (rows[0].gambar && fs.existsSync(path.join(__dirname, rows[0].gambar)))
      fs.unlinkSync(path.join(__dirname, rows[0].gambar));
    await pool.query("DELETE FROM proyek WHERE id = $1", [req.params.id]);
    await deletePattern("proyek:*");
    res.json({ message: "Berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// --- Video Beranda Routes ---
app.get("/api/video-beranda", cachePublicApi(300), async (req, res) => {
  try {
    const cached = await getCache("video:beranda:active");
    if (cached !== null) return res.json(cached);
    const { rows } = await pool.query(
      "SELECT * FROM video_beranda WHERE is_active = true ORDER BY created_at DESC LIMIT 1",
    );
    await setCache("video:beranda:active", rows[0] || null, 300);
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/video-beranda/all", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM video_beranda ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/api/video-beranda",
  authMiddleware,
  uploadVideo.single("video"),
  async (req, res) => {
    try {
      const video = req.file ? `/uploads/video/${req.file.filename}` : null;
      if (!video) return res.status(400).json({ message: "Video wajib" });

      await pool.query("UPDATE video_beranda SET is_active = false");
      const { rows } = await pool.query(
        "INSERT INTO video_beranda (judul, deskripsi, video, is_active, created_by) VALUES ($1, $2, $3, true, $4) RETURNING id",
        [
          req.body.judul || null,
          req.body.deskripsi || null,
          video,
          req.admin.id,
        ],
      );
      await deletePattern("video:beranda:*");
      res.status(201).json({ message: "Berhasil", id: rows[0].id });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

app.put(
  "/api/video-beranda/:id",
  authMiddleware,
  uploadVideo.single("video"),
  async (req, res) => {
    try {
      const { rows: existing } = await pool.query(
        "SELECT * FROM video_beranda WHERE id = $1",
        [req.params.id],
      );
      if (existing.length === 0)
        return res.status(404).json({ message: "Tidak ditemukan" });

      let video = existing[0].video;
      if (req.file) {
        if (video && fs.existsSync(path.join(__dirname, video)))
          fs.unlinkSync(path.join(__dirname, video));
        video = `/uploads/video/${req.file.filename}`;
      }

      await pool.query(
        "UPDATE video_beranda SET judul = $1, deskripsi = $2, video = $3 WHERE id = $4",
        [
          req.body.judul || null,
          req.body.deskripsi || null,
          video,
          req.params.id,
        ],
      );
      await deletePattern("video:beranda:*");
      res.json({ message: "Berhasil" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

app.put("/api/video-beranda/:id/activate", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id FROM video_beranda WHERE id = $1",
      [req.params.id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Tidak ditemukan" });

    await pool.query("UPDATE video_beranda SET is_active = false");
    await pool.query(
      "UPDATE video_beranda SET is_active = true WHERE id = $1",
      [req.params.id],
    );
    await deletePattern("video:beranda:*");
    res.json({ message: "Berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/video-beranda/:id", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT video FROM video_beranda WHERE id = $1",
      [req.params.id],
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Tidak ditemukan" });

    if (rows[0].video && fs.existsSync(path.join(__dirname, rows[0].video)))
      fs.unlinkSync(path.join(__dirname, rows[0].video));
    await pool.query("DELETE FROM video_beranda WHERE id = $1", [
      req.params.id,
    ]);
    await deletePattern("video:beranda:*");
    res.json({ message: "Berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== SPA CATCH-ALL (HARUS PALING BAWAH) ====================
const frontendDist = path.join(__dirname, "dist");
if (fs.existsSync(frontendDist)) {
  app.use(
    express.static(frontendDist, {
      maxAge: "7d",
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html"))
          res.setHeader("Cache-Control", "no-cache");
      },
    }),
  );
  app.get("*", (req, res) =>
    res.sendFile(path.join(frontendDist, "index.html")),
  );
  console.log(`📦 Frontend served from: ${frontendDist}`);
} else {
  // Jika tidak ada folder dist, sediakan fallback SPA untuk file public
  app.get("*", (req, res) => {
    const publicIndex = path.join(__dirname, "../public", "index.html");
    if (fs.existsSync(publicIndex)) res.sendFile(publicIndex);
    else res.status(404).send("API Running. Frontend not built.");
  });
}

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`🌍 Mode: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`);
  console.log(`📁 Upload folder: ${uploadsDir}`);
});
