// Secure file handling utilities
// Mencegah path traversal attacks

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsDir = path.resolve(__dirname, '..', 'uploads')

/**
 * Validasi dan hapus file secara aman
 * Mencegah path traversal attack dengan memastikan file berada di uploads directory
 * 
 * @param {string} filePath - Path relatif dari database (e.g., '/uploads/kegiatan/123.jpg')
 * @returns {boolean} - true jika berhasil dihapus, false jika gagal
 */
const safeDeleteFile = (filePath) => {
  if (!filePath) return false
  
  try {
    // Hapus leading slash jika ada
    const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath
    
    // Resolve absolute path
    const absolutePath = path.resolve(__dirname, '..', cleanPath)
    
    // Pastikan path berada dalam uploads directory (mencegah path traversal)
    if (!absolutePath.startsWith(uploadsDir)) {
      console.error('Path traversal attempt blocked:', filePath)
      return false
    }
    
    // Cek apakah file exist sebelum delete
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error deleting file:', error.message)
    return false
  }
}

/**
 * Validasi path file untuk upload
 * 
 * @param {string} filename - Nama file dari multer
 * @param {string} kategori - Kategori folder (kegiatan, sia, sroi, beranda, video)
 * @returns {string|null} - Path relatif jika valid, null jika tidak valid
 */
const validateUploadPath = (filename, kategori) => {
  const allowedKategori = ['kegiatan', 'sia', 'sroi', 'beranda', 'video']
  
  if (!allowedKategori.includes(kategori)) {
    return null
  }
  
  // Pastikan filename tidak mengandung path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return null
  }
  
  return `/uploads/${kategori}/${filename}`
}

export { safeDeleteFile, validateUploadPath, uploadsDir }
