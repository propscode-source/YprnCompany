import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import strip from '@rollup/plugin-strip'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'

const isAnalyze = process.env.ANALYZE === 'true'

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithms: ['gzip', 'brotliCompress'],
      threshold: 1024,
      exclude: [/\.(png|jpg|jpeg|gif|webp|svg|mp4)$/i],
    }),
  ],

  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        dead_code: true,
        collapse_vars: true,
        reduce_vars: true,
        unused: true,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
        ecma: 2020,
      },
    },
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      plugins: [
        strip({
          functions: ['console.log', 'console.debug', 'console.info', 'console.warn'],
          include: ['**/*.js', '**/*.jsx'],
          sourceMap: false,
        }),
        ...(isAnalyze
          ? [
              visualizer({
                filename: 'reports/bundle-analysis.html',
                open: true,
                gzipSize: true,
                brotliSize: true,
                template: 'treemap',
                title: 'YPRN Bundle Analysis',
                projectRoot: process.cwd(),
              }),
            ]
          : []),
      ],

      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        compact: true,
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true,
          symbols: true,
        },
        sanitizeFileName: (name) => {
          return name
            .replace(/[\x00-\x1f\x7f]/g, '')
            .replace(/[<>:"|?*]/g, '_')
            .replace(/\.\./g, '_')
        },
        interop: 'auto',

        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          // Vendor React & Ekosistem intinya
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/') ||
            id.includes('/node_modules/react-router') ||
            id.includes('/node_modules/@remix-run/')
          ) {
            return 'vendor-react'
          }

          // Vendor Motion (framer-motion / motion) — dipisah agar tidak membebani vendor-react
          if (
            id.includes('/node_modules/framer-motion/') ||
            id.includes('/node_modules/motion/')
          ) {
            return 'vendor-motion'
          }

          // Vendor Icons
          if (id.includes('/node_modules/lucide-react/')) {
            return 'vendor-icons'
          }

          // Sisa library dibiarkan agar Rollup yang mengatur pemecahannya secara otomatis.
          // Ini yang mencegah terjadinya 'Circular chunk'.
        },
      },

      treeshake: {
        moduleSideEffects: (id) => {
          if (id.endsWith('.css')) return true
          if (id.includes('polyfill')) return true
          if (id.includes('node_modules/react/')) return true
          if (id.includes('node_modules/react-dom/')) return true
          if (id.includes('node_modules/react-router')) return true
          if (id.includes('node_modules/scheduler')) return true
          return false
        },
        propertyReadSideEffects: true,
        tryCatchDeoptimization: false,
        annotations: true,
        unknownGlobalSideEffects: true,
      },

      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message?.includes('use client')) {
          return
        }
        if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.importer?.includes('node_modules')) {
          return
        }
        warn(warning)
      },
    },
  },

  server: {
    warmup: {
      clientFiles: ['./src/main.jsx', './src/App.jsx', './src/components/common/Navbar.jsx'],
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'motion/react', 'lucide-react'],
  },
})
