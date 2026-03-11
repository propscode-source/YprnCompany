// src/components/common/ErrorBoundary.jsx
// ============================================================
// Mengapa ini diperlukan:
//   manualChunks fix mencegah bug utama, tapi jika di masa depan
//   ada lazy-loaded chunk yang gagal dimuat (network error, cache
//   stale setelah deploy baru), React akan crash tanpa pesan yang
//   jelas. ErrorBoundary menangkap crash tersebut dan memberikan
//   fallback UI + mekanisme recovery (force reload).
// ============================================================

import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      isChunkLoadError: false,
    }
  }

  static getDerivedStateFromError(error) {
    // Deteksi apakah ini chunk loading failure atau error lain.
    // Chunk load error biasanya terjadi setelah deploy baru ketika
    // browser masih cache hash lama yang sudah tidak ada di server.
    const isChunkLoadError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Loading CSS chunk') ||
      error?.message?.includes('Failed to fetch dynamically imported module')

    return {
      hasError: true,
      error,
      isChunkLoadError,
    }
  }

  componentDidCatch(error, info) {
    // Log ke console dengan context yang cukup untuk debugging
    console.error('[ErrorBoundary] Runtime error caught:', {
      message: error?.message,
      componentStack: info?.componentStack,
      isChunkLoadError: this.state.isChunkLoadError,
    })

    // TODO: integrasikan dengan error tracking service (Sentry, dsb.)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: info });
    // }
  }

  handleReload() {
    // Hard reload untuk flush stale chunk cache setelah deploy baru
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    // Chunk load error = kemungkinan deployment baru, minta user reload
    if (this.state.isChunkLoadError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">🔄</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Versi terbaru tersedia</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Website telah diperbarui. Muat ulang halaman untuk mendapatkan versi terbaru.
            </p>
            <button
              onClick={this.handleReload}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      )
    }

    // Error umum — tampilkan pesan generik
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Terjadi kesalahan</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Halaman tidak dapat dimuat. Coba muat ulang atau kembali ke beranda.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReload}
              className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition-colors text-sm"
            >
              Muat Ulang
            </button>
            <a
              href="/"
              className="border border-green-700 text-green-700 px-5 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm"
            >
              Ke Beranda
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
