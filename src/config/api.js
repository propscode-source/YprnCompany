// API Configuration
// Di development: VITE_API_URL=http://localhost:5000/api
// Di production (Vercel): set via Environment Variables dashboard
//   contoh: VITE_API_URL=https://your-backend.onrender.com/api

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Base URL (tanpa /api) untuk gambar/uploads
const BASE_URL = API_URL.replace(/\/api$/, '')

export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}
