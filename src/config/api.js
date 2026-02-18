// API Configuration
// Di development: VITE_API_URL=http://localhost:5000/api
// Di production (Vercel): set via Environment Variables dashboard
//   contoh: VITE_API_URL=https://your-backend.onrender.com/api

const apiUrl = import.meta.env.VITE_API_URL

// Validasi environment variable di production
if (!apiUrl && import.meta.env.PROD) {
  throw new Error('VITE_API_URL environment variable is required in production')
}

export const API_URL = apiUrl || 'http://localhost:5000/api'

// Base URL (tanpa /api) untuk gambar/uploads
const BASE_URL = API_URL.replace(/\/api$/, '')

export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}
