// API Configuration
// Di development: VITE_API_URL=http://localhost:5000/api
// Di production (single service / nixpacks): VITE_API_URL=/api
//   atau set via Environment Variables dashboard hosting provider

// Smart fallback: jika VITE_API_URL tidak di-set saat build,
// deteksi otomatis — jika bukan localhost, gunakan /api (relative path)
const getApiUrl = () => {
  // 1. Prioritas: env var yang di-set saat build
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // 2. Fallback: deteksi apakah sedang di production atau development
  //    Di production (domain publik), gunakan /api (relative)
  //    Di development (localhost), gunakan http://localhost:5000/api
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'
    if (!isLocal) {
      return '/api'
    }
  }

  return 'http://localhost:5000/api'
}

export const API_URL = getApiUrl()

// Base URL (tanpa /api) untuk gambar/uploads
const BASE_URL = API_URL.startsWith('/') ? '' : API_URL.replace(/\/api$/, '')

export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}
