import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import strip from '@rollup/plugin-strip'
import { visualizer } from 'rollup-plugin-visualizer'

// Mode detection
const isProduction = process.env.NODE_ENV === 'production'
const isAnalyze = process.env.ANALYZE === 'true'

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
        // Optimasi agresif
        passes: 2, // Multiple compression passes untuk hasil lebih kecil
        dead_code: true, // Hapus dead code
        collapse_vars: true, // Gabungkan variable declarations
        reduce_vars: true, // Reduce variable references
        unused: true, // Hapus unused variables
      },
      mangle: {
        safari10: true, // Fix Safari 10 loop iterator bug
      },
      format: {
        comments: false, // Hapus semua comments di production
        ecma: 2020,
      },
    },

    // Tidak perlu sourcemap di production
    sourcemap: false,

    // CSS code splitting
    cssCodeSplit: true,

    // Batas minimum asset untuk inline sebagai base64 (4KB)
    assetsInlineLimit: 4096,

    // ==================== ROLLUP OPTIONS ====================
    rollupOptions: {
      plugins: [
        // Hapus debug code di production build
        strip({
          functions: ['console.log', 'console.debug', 'console.info', 'console.warn'],
          include: ['**/*.js', '**/*.jsx'],
          sourceMap: false,
        }),

        // Bundle analysis -- generate report saat ANALYZE=true
        ...(isAnalyze ? [
          visualizer({
            filename: 'reports/bundle-analysis.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
            template: 'treemap',
            title: 'YPRN Bundle Analysis',
            projectRoot: process.cwd(),
          }),
        ] : []),
      ],

      output: {
        // ==================== MANUAL CHUNKS STRATEGY ====================
        // Pisahkan vendor berdasarkan frekuensi update dan ukuran
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          // React core -- sangat jarang berubah, cache jangka panjang
          if (id.includes('react-dom') || id.includes('node_modules/react/')) {
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

          // Sisa vendor kecil -- digabung jadi satu chunk
          return 'vendor-misc'
        },

        // Penamaan chunk dengan hash untuk long-term caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',

        // Compact output untuk ukuran lebih kecil
        compact: true,

        // Generated code optimization
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true,
          symbols: true,
        },

        // Sanitize nama file untuk keamanan
        sanitizeFileName: (name) => {
          return name
            .replace(/[\x00-\x1f\x7f]/g, '')
            .replace(/[<>:"|?*]/g, '_')
            .replace(/\.\./g, '_')
        },

        // Interop mode otomatis
        interop: 'auto',
      },

      // ==================== TREE-SHAKING AGRESIF ====================
      treeshake: {
        // Module side effects handling
        moduleSideEffects: (id) => {
          // CSS dan polyfills punya side effects, harus tetap di-include
          if (id.endsWith('.css')) return true
          if (id.includes('polyfill')) return true
          return false
        },
        // Property reads dianggap tidak punya side effects
        propertyReadSideEffects: false,
        // Jangan deoptimize tree-shaking di try-catch blocks
        tryCatchDeoptimization: false,
        // Gunakan annotations (/*#__PURE__*/) untuk tree-shaking
        annotations: true,
        // Hapus unknown global side effects
        unknownGlobalSideEffects: false,
      },

      // Suppress noisy warnings
      onwarn(warning, warn) {
        // Abaikan "use client" directive warnings (dari React libraries)
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message?.includes('use client')) {
          return
        }
        // Abaikan circular dependency di node_modules
        if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.importer?.includes('node_modules')) {
          return
        }
        warn(warning)
      },
    },

    // Naikkan warning limit (setelah splitting, seharusnya sudah di bawah)
    chunkSizeWarningLimit: 500,
  },

  // ==================== OPTIMASI SERVER DEV ====================
  server: {
    // Pre-transform dependencies untuk startup dev lebih cepat
    warmup: {
      clientFiles: [
        './src/main.jsx',
        './src/App.jsx',
        './src/components/common/Navbar.jsx',
      ],
    },
  },

  // ==================== DEPENDENCY OPTIMIZATION ====================
  optimizeDeps: {
    // Pre-bundle dependencies ini untuk dev server lebih cepat
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'motion/react',
      'lucide-react',
    ],
  },
})
