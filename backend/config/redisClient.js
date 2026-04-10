// config/redisClient.js
// Redis client helper menggunakan ioredis dengan graceful fallback.
// Jika Redis tidak tersedia / koneksi gagal, sistem tetap berjalan
// dan otomatis query langsung ke database (NO crash).

import Redis from "ioredis";

/** Flag status apakah Redis siap menerima perintah */
let isRedisReady = false;

/** Instance Redis client, null jika REDIS_URL tidak dikonfigurasi */
let redisClient = null;

/**
 * Inisialisasi koneksi Redis.
 * Dipanggil sekali saat server start.
 * - Jika REDIS_URL tidak diset → skip, caching dinonaktifkan
 * - Jika koneksi gagal → log error, server TIDAK crash (graceful fallback)
 *
 * @returns {Redis|null} Redis client instance atau null
 */
export function initRedis() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn("⚠️  REDIS_URL tidak diset — caching Redis dinonaktifkan, fallback ke database");
    return null;
  }

  redisClient = new Redis(redisUrl, {
    // Retry dengan backoff eksponensial
    // null = hentikan retry setelah batas tercapai
    retryStrategy(times) {
      if (times > 10) {
        console.error("❌ Redis: Gagal reconnect setelah 10 percobaan. Caching dinonaktifkan sementara.");
        return null; // hentikan retry
      }
      const delay = Math.min(times * 300, 3000); // maksimal 3 detik antar retry
      return delay;
    },

    // Timeout saat mencoba konek pertama kali
    connectTimeout: 10000,

    // Maksimal retry per individual command (bukan reconnect)
    maxRetriesPerRequest: 2,

    // Aktifkan pengecekan status 'ready' sebelum mengirim command
    enableReadyCheck: true,

    // Jangan lempar error saat offline — perintah akan di-queue
    enableOfflineQueue: false,
  });

  // ==================== EVENT HANDLERS ====================

  redisClient.on("connect", () => {
    console.log("🔌 Redis: Koneksi terbuka...");
  });

  redisClient.on("ready", () => {
    isRedisReady = true;
    console.log("✅ Redis: Siap menerima perintah");
  });

  redisClient.on("error", (err) => {
    // Set flag down — semua operasi akan fallback ke database
    isRedisReady = false;
    // Hanya log ringkas agar tidak spamming console
    console.error("❌ Redis Error:", err.message);
  });

  redisClient.on("close", () => {
    isRedisReady = false;
    console.warn("⚠️  Redis: Koneksi ditutup");
  });

  redisClient.on("reconnecting", (delay) => {
    console.log(`🔄 Redis: Mencoba reconnect dalam ${delay}ms...`);
  });

  redisClient.on("end", () => {
    isRedisReady = false;
    console.warn("⚠️  Redis: Sesi berakhir, tidak ada retry lagi");
  });

  return redisClient;
}

// ==================== CACHE OPERATIONS ====================

/**
 * Ambil data dari Redis cache.
 * Mengembalikan null jika: Redis tidak siap, key tidak ada, atau terjadi error.
 *
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} Data yang di-parse atau null
 */
export async function getCache(key) {
  // Guard: skip jika Redis belum siap
  if (!redisClient || !isRedisReady) return null;

  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    // Log tapi jangan throw — fallback ke database
    console.error(`Redis GET error [${key}]:`, err.message);
    return null;
  }
}

/**
 * Simpan data ke Redis cache dengan TTL.
 *
 * @param {string} key - Cache key
 * @param {any} data - Data yang akan di-cache (akan di-serialize ke JSON)
 * @param {number} [ttlSeconds=300] - Waktu hidup cache dalam detik (default: 5 menit)
 * @returns {Promise<void>}
 */
export async function setCache(key, data, ttlSeconds = 300) {
  if (!redisClient || !isRedisReady) return;

  try {
    // EX = expire in seconds
    await redisClient.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch (err) {
    // Cache adalah optimasi, bukan keharusan — tidak perlu throw
    console.error(`Redis SET error [${key}]:`, err.message);
  }
}

/**
 * Hapus satu key dari cache.
 * Digunakan setelah operasi yang mengubah data single resource.
 *
 * @param {string} key - Cache key yang akan dihapus
 * @returns {Promise<void>}
 */
export async function deleteCache(key) {
  if (!redisClient || !isRedisReady) return;

  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`Redis DEL error [${key}]:`, err.message);
  }
}

/**
 * Hapus semua cache key yang cocok dengan glob pattern.
 * Menggunakan SCAN (non-blocking) — aman untuk production, tidak seperti KEYS.
 * Contoh: deletePattern("kegiatan:*") menghapus semua cache kegiatan.
 *
 * @param {string} pattern - Glob pattern (contoh: "hero:beranda:*")
 * @returns {Promise<void>}
 */
export async function deletePattern(pattern) {
  if (!redisClient || !isRedisReady) return;

  try {
    let cursor = "0";
    let totalDeleted = 0;

    // Loop SCAN sampai cursor kembali ke "0" (full iteration selesai)
    do {
      const [nextCursor, keys] = await redisClient.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100, // scan batch 100 key per iterasi
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        // DEL mendukung multiple keys sekaligus
        await redisClient.del(...keys);
        totalDeleted += keys.length;
      }
    } while (cursor !== "0");

    if (totalDeleted > 0) {
      console.log(`🗑️  Redis: Invalidated ${totalDeleted} key(s) matching "${pattern}"`);
    }
  } catch (err) {
    console.error(`Redis SCAN/DEL error [${pattern}]:`, err.message);
  }
}

/**
 * Cek status koneksi Redis saat ini.
 * Digunakan oleh health check endpoint.
 *
 * @returns {{ connected: boolean, status: string }}
 */
export function getRedisStatus() {
  if (!redisClient) {
    return { connected: false, status: "not_configured" };
  }
  return {
    connected: isRedisReady,
    // Status ioredis: 'connecting' | 'connect' | 'ready' | 'close' | 'end'
    status: redisClient.status,
  };
}
