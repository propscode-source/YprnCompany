/**
 * Rollup Configuration - Standalone
 *
 * Config ini digunakan untuk:
 * 1. Bundle analysis (npm run analyze) -- menghasilkan laporan visual ukuran bundle
 * 2. Standalone build alternatif di luar Vite jika diperlukan
 * 3. Referensi konfigurasi Rollup yang dipakai project ini
 *
 * NOTE: Build utama tetap menggunakan Vite (npm run build).
 * Config ini melengkapi Vite, bukan menggantikannya.
 */

import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import strip from '@rollup/plugin-strip'
import { visualizer } from 'rollup-plugin-visualizer'
import terser from '@rollup/plugin-terser'

const isProduction = process.env.NODE_ENV === 'production'

// ==================== MANUAL CHUNKS STRATEGY ====================
// Pisahkan vendor libraries berdasarkan frekuensi update dan ukuran
// agar browser cache tetap valid lebih lama
const manualChunks = (id) => {
  if (!id.includes('node_modules')) return undefined

  // React core -- sangat jarang berubah, cache jangka panjang
  if (id.includes('react-dom') || id.includes('react/')) {
    return 'vendor-react'
  }

  // React Router -- update terpisah dari React core
  if (id.includes('react-router-dom') || id.includes('react-router')) {
    return 'vendor-router'
  }

  // Motion/Framer Motion -- library terbesar (~150KB), cache terpisah
  if (id.includes('/motion') || id.includes('framer-motion')) {
    return 'vendor-motion'
  }

  // Lucide icons -- banyak dipakai, bisa di-cache terpisah
  if (id.includes('lucide-react')) {
    return 'vendor-icons'
  }

  // Sisa vendor di-bundle jadi satu chunk
  return 'vendor-misc'
}

// ==================== TREE-SHAKING CONFIG ====================
// Konfigurasi tree-shaking agresif untuk menghapus dead code
const treeshakeOptions = {
  // Anggap module tidak punya side effects kecuali ditandai
  moduleSideEffects: (id) => {
    // CSS files memiliki side effects (harus tetap di-include)
    if (id.endsWith('.css')) return true
    // Polyfill juga punya side effects
    if (id.includes('polyfill')) return true
    return false
  },
  // Anggap property reads tidak punya side effects
  // Membantu menghapus unused object properties
  propertyReadSideEffects: false,
  // Jangan deoptimize tree-shaking di dalam try-catch blocks
  tryCatchDeoptimization: false,
  // Deteksi dan hapus pure function calls yang tidak digunakan
  annotations: true,
  // Hapus unknown global side effects
  unknownGlobalSideEffects: false,
}

// ==================== SECURITY & OUTPUT ====================
const outputConfig = {
  dir: 'dist-rollup',
  format: 'es',
  entryFileNames: 'assets/js/[name]-[hash].js',
  chunkFileNames: 'assets/js/[name]-[hash].js',
  assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
  manualChunks,
  // Compact output -- lebih kecil untuk production
  compact: isProduction,
  // Konfigurasi generated code
  generatedCode: {
    // Gunakan arrow functions untuk output lebih kecil
    arrowFunctions: true,
    // Gunakan const untuk variable declarations
    constBindings: true,
    // Gunakan object shorthand
    objectShorthand: true,
    // Gunakan template literals jika lebih efisien
    symbols: true,
  },
  // Sanitize nama file untuk keamanan
  sanitizeFileName: (name) => {
    // Hapus karakter berbahaya dari nama file
    return name
      .replace(/[\x00-\x1f\x7f]/g, '') // Control characters
      .replace(/[<>:"|?*]/g, '_')        // Windows-reserved characters
      .replace(/\.\./g, '_')              // Path traversal prevention
  },
  // Interop mode untuk kompatibilitas
  interop: 'auto',
  // Preserve modules untuk better debugging (disabled di production)
  ...(isProduction ? {} : { preserveModules: false }),
}

// ==================== PLUGINS ====================
const plugins = [
  // Resolve node_modules imports
  resolve({
    browser: true,
    preferBuiltin: false,
    extensions: ['.js', '.jsx', '.json'],
    // Deduplicate React untuk menghindari multiple instances
    dedupe: ['react', 'react-dom'],
  }),

  // Konversi CommonJS modules ke ESM
  commonjs({
    include: /node_modules/,
    // Ignore dynamic requires yang tidak bisa di-convert
    ignoreDynamicRequires: true,
  }),

  // Replace environment variables untuk keamanan
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      // Cegah expose env vars sensitif ke browser bundle
      'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
    },
  }),

  // Hapus debug code di production
  ...(isProduction ? [
    strip({
      // Hapus console.log dan debugger statements
      functions: ['console.log', 'console.debug', 'console.info', 'console.warn'],
      // Hapus assert calls
      include: '**/*.{js,jsx}',
      // Jangan hapus console.error (tetap perlu untuk error tracking)
      // debugger statements otomatis dihapus
    }),
  ] : []),

  // Minifikasi di production
  ...(isProduction ? [
    terser({
      compress: {
        drop_console: false, // Sudah dihandle oleh @rollup/plugin-strip
        drop_debugger: true,
        // Optimasi agresif
        passes: 2,
        // Hapus dead code
        dead_code: true,
        // Collapse variable declarations
        collapse_vars: true,
        // Reduce variable references
        reduce_vars: true,
        // Hapus unreachable code
        unused: true,
      },
      mangle: {
        // Mangle property names untuk ukuran lebih kecil
        // (hati-hati: bisa break code yang akses property by string)
        properties: false,
        safari10: true, // Fix Safari 10 loop iterator bug
      },
      format: {
        // Hapus comments di production
        comments: false,
        // Output ECMAScript 2020
        ecma: 2020,
      },
    }),
  ] : []),

  // Bundle visualizer -- selalu generate report
  visualizer({
    filename: 'reports/bundle-analysis.html',
    open: false,
    gzipSize: true,
    brotliSize: true,
    template: 'treemap', // treemap | sunburst | network
    title: 'YPRN Bundle Analysis',
    projectRoot: process.cwd(),
  }),
]

// ==================== MAIN CONFIG ====================
export default defineConfig({
  input: 'src/main.jsx',
  output: outputConfig,
  plugins,
  treeshake: treeshakeOptions,

  // External dependencies -- tidak di-bundle
  // (kosong karena ini SPA, semua perlu di-bundle)
  external: [],

  // Peringatan yang di-suppress
  onwarn(warning, warn) {
    // Abaikan warning "use client" directive (dari React libraries)
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
      return
    }
    // Abaikan circular dependency warnings dari node_modules
    if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.importer?.includes('node_modules')) {
      return
    }
    // Tampilkan warning lainnya
    warn(warning)
  },

  // Batas ukuran peringatan
  experimentalLogSideEffects: false,
})
