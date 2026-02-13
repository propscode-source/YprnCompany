import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Camera, ArrowRight, X, Calendar, MapPin, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'

const API_URL = 'http://localhost:5000/api'
const ITEMS_PER_PAGE = 6

const Kegiatan = () => {
  const [kegiatan, setKegiatan] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(kegiatan.length / ITEMS_PER_PAGE)
  const paginatedKegiatan = kegiatan.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  useEffect(() => {
    fetchKegiatan()
  }, [])

  const fetchKegiatan = async () => {
    try {
      const res = await fetch(`${API_URL}/kegiatan`)
      if (res.ok) {
        const data = await res.json()
        setKegiatan(data.filter(item => item.kategori === 'kegiatan'))
      }
    } catch (error) {
      console.error('Error fetching kegiatan:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="pt-20 bg-dark">
      {/* Hero Section */}
      <section className="section-padding bg-dark hero-pattern cyber-grid relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-primary mt-2 mb-4">
              <span className="gradient-text">Dokumentasi Kegiatan</span>
            </h1>
            <p className="text-body">
              Dokumentasi berbagai kegiatan Yayasan Pemerhati Rimba Nusantara di berbagai wilayah.
            </p>
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <section className="section-padding bg-dark">
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        </section>
      )}

      {/* Galeri Dokumentasi */}
      {!loading && (
        <section className="section-padding bg-dark">
          <div className="container-custom">
            {kegiatan.length === 0 ? (
              <div className="text-center py-20">
                <ImageIcon className="mx-auto text-text-muted mb-4" size={48} />
                <p className="text-text-body text-lg">Belum ada dokumentasi kegiatan</p>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedKegiatan.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group relative rounded-2xl overflow-hidden border border-dark-200 card-lift cursor-pointer"
                  >
                    {item.gambar ? (
                      <img
                        src={`http://localhost:5000${item.gambar}`}
                        alt={item.judul}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-72 bg-dark-200/30 flex items-center justify-center">
                        <ImageIcon className="text-text-muted" size={48} />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                      <div className="p-5">
                        <h3 className="text-white font-bold text-lg mb-1">{item.judul}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
                          {item.tanggal && (
                            <span className="flex items-center space-x-1">
                              <Calendar size={14} className="text-primary" />
                              <span>{formatDate(item.tanggal)}</span>
                            </span>
                          )}
                          {item.lokasi && (
                            <span className="flex items-center space-x-1">
                              <MapPin size={14} className="text-primary" />
                              <span>{item.lokasi}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 text-xs mt-2">Klik untuk lihat detail</p>
                      </div>
                    </div>
                    {/* Default label */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark/90 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                      <div className="flex items-center space-x-2 text-white">
                        <Camera size={16} className="text-primary" />
                        <span className="text-sm font-medium">{item.judul}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-10 space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-dark-200/50 text-text-body hover:text-primary hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                          : 'border border-dark-200/50 text-text-body hover:text-primary hover:border-primary/50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-dark-200/50 text-text-body hover:text-primary hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
              </>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-heading mb-6">
              Ingin Tahu Lebih Detail?
            </h2>
            <p className="text-lg text-text-body mb-8">
              Jelajahi program Social Impact Assessment dan Social Return on Investment kami.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/kegiatan/social-impact-assessment" className="btn-primary inline-flex group">
                Social Impact Assessment
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link to="/kegiatan/social-return-on-investment" className="btn-glow inline-flex group">
                Social Return on Investment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPUP DETAIL ===== */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/85 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative bg-dark-50 rounded-2xl border border-dark-200/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-dark/70 backdrop-blur-sm text-white rounded-full hover:bg-dark transition-all"
            >
              <X size={20} />
            </button>

            {/* Image */}
            {selectedItem.gambar ? (
              <img
                src={`http://localhost:5000${selectedItem.gambar}`}
                alt={selectedItem.judul}
                className="w-full h-64 md:h-80 object-cover rounded-t-2xl"
              />
            ) : (
              <div className="w-full h-64 md:h-80 bg-dark-200/30 flex items-center justify-center rounded-t-2xl">
                <ImageIcon className="text-text-muted" size={64} />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-text-heading mb-4">
                {selectedItem.judul}
              </h2>

              <div className="flex flex-wrap gap-3 mb-5">
                {selectedItem.tanggal && (
                  <div className="flex items-center space-x-2 text-text-body bg-dark/30 px-3 py-2 rounded-lg">
                    <Calendar size={16} className="text-primary" />
                    <span className="text-sm">{formatDate(selectedItem.tanggal)}</span>
                  </div>
                )}
                {selectedItem.lokasi && (
                  <div className="flex items-center space-x-2 text-text-body bg-dark/30 px-3 py-2 rounded-lg">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-sm">{selectedItem.lokasi}</span>
                  </div>
                )}
              </div>

              {selectedItem.deskripsi ? (
                <p className="text-text-body leading-relaxed whitespace-pre-line">
                  {selectedItem.deskripsi}
                </p>
              ) : (
                <p className="text-text-muted italic">Belum ada informasi detail untuk kegiatan ini.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Kegiatan
