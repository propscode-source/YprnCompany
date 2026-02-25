// API Configuration
// ─────────────────────────────────────────────────────────────
// VITE_API_URL di-bake ke bundle saat Vite build (import.meta.env).
//
// Production (Docker/Coolify): VITE_API_URL=/api
//   → Nginx reverse proxy meneruskan /api/* ke backend container.
//   → Tidak perlu domain absolut, cukup relative path.
//
// Development lokal (tanpa Docker): VITE_API_URL tidak di-set
//   → Otomatis fallback ke http://localhost:5000/api
//
// PENTING: Default SELALU /api (aman untuk production).
//          localhost hanya digunakan jika browser benar-benar di localhost
//          DAN tidak ada VITE_API_URL yang di-set saat build.
// ─────────────────────────────────────────────────────────────

const isLocalhostOrigin = () => {
  if (typeof window === 'undefined') return false
  const { hostname } = window.location
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

const getApiUrl = () => {
  const buildTimeUrl = import.meta.env.VITE_API_URL

  if (buildTimeUrl) {
    // Guard: jika build-time URL mengandung localhost tapi browser BUKAN
    // di localhost, abaikan dan gunakan /api (relative).
    // Ini mencegah error jika Dockerfile/CI salah menyuntikkan localhost.
    const pointsToLocalhost =
      buildTimeUrl.includes('localhost') || buildTimeUrl.includes('127.0.0.1')

    if (pointsToLocalhost && !isLocalhostOrigin()) {
      return '/api'
    }

    return buildTimeUrl
  }

  // Tidak ada env var → deteksi runtime
  // Hanya gunakan localhost:5000 jika browser benar-benar di localhost
  if (isLocalhostOrigin()) {
    return 'http://localhost:5000/api'
  }

  // Default aman untuk production
  return '/api'
}

export const API_URL = getApiUrl()

// Base URL untuk static assets (gambar/uploads)
// Jika API_URL relative (/api) → base kosong (same-origin via nginx proxy)
// Jika API_URL absolut (http://...) → strip /api untuk dapat base URL
const BASE_URL = API_URL.startsWith('/') ? '' : API_URL.replace(/\/api$/, '')

export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}
