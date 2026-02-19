import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Pre-compression: gzip + brotli untuk production
    compression({
      algorithms: ['gzip', 'brotliCompress'],
      threshold: 1024, // Hanya kompresi file > 1KB
      exclude: [/\.(png|jpg|jpeg|gif|webp|svg|mp4)$/i],
    }),
  ],
  build: {
    // Target modern browsers untuk output lebih kecil
    target: 'es2020',
    // Minifikasi dengan terser untuk hasil lebih kecil dari esbuild default
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Hapus console.log di production
        drop_debugger: true,
      },
    },
    // Tidak perlu sourcemap di production
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    // Manual chunks untuk memisahkan vendor libraries
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core - jarang berubah, di-cache lama
          if (id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          // Router - modul terpisah
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }
          // Framer Motion - library terbesar (~150KB)
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }
          // Icons - banyak dipakai tapi bisa di-cache terpisah
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
        },
        // Penamaan chunk dengan hash untuk long-term caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Naikkan warning limit sedikit (setelah splitting, seharusnya sudah di bawah)
    chunkSizeWarningLimit: 500,
  },
})
