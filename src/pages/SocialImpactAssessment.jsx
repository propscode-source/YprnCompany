import { useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  Users,
  FileText,
  CheckCircle,
  Camera,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const API_URL = 'http://localhost:5000/api'
const ITEMS_PER_PAGE = 6

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  // Auto-slide setiap 4 detik
  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-dark-200 bg-dark-100">
      {/* Images — object-contain agar foto tidak terpotong */}
      <div className="relative w-full overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            className={`w-full transition-all duration-700 ease-in-out ${
              index === current
                ? 'relative opacity-100 scale-100'
                : 'absolute inset-0 opacity-0 scale-105'
            }`}
            style={{ display: index === current ? 'block' : 'none' }}
          />
        ))}
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-dark transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-dark transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-primary w-7 shadow-glow-primary'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const SocialImpactAssessment = () => {
  const [galeri, setGaleri] = useState([])
  const [loadingGaleri, setLoadingGaleri] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(galeri.length / ITEMS_PER_PAGE)
  const paginatedGaleri = galeri.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page) => {
    setCurrentPage(page)
    document.getElementById('galeri-sia')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchGaleri()
  }, [])

  const fetchGaleri = async () => {
    try {
      const res = await fetch(`${API_URL}/kegiatan`)
      if (res.ok) {
        const data = await res.json()
        setGaleri(data.filter((item) => item.kategori === 'sia'))
      }
    } catch (error) {
      console.error('Error fetching galeri SIA:', error)
    } finally {
      setLoadingGaleri(false)
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

  const heroImages = [
    { src: '/assets/images/SIA/SIA.jpg', alt: 'Social Impact Assessment' },
    { src: '/assets/images/SIA/SIA 1.jpg', alt: 'Kegiatan SIA' },
  ]
  const steps = [
    {
      step: '01',
      title: 'Identifikasi Stakeholder',
      description:
        'Mengidentifikasi seluruh pihak yang terdampak oleh suatu proyek atau kegiatan, termasuk masyarakat lokal, pemerintah, dan sektor swasta.',
    },
    {
      step: '02',
      title: 'Pengumpulan Data',
      description:
        'Melakukan survei, wawancara mendalam, Focus Group Discussion (FGD), dan observasi lapangan untuk mengumpulkan data primer dan sekunder.',
    },
    {
      step: '03',
      title: 'Analisis Dampak',
      description:
        'Menganalisis dampak sosial, ekonomi, dan lingkungan dari kegiatan atau proyek terhadap masyarakat dan lingkungan sekitar.',
    },
    {
      step: '04',
      title: 'Rekomendasi & Mitigasi',
      description:
        'Menyusun rekomendasi dan strategi mitigasi untuk meminimalkan dampak negatif dan memaksimalkan dampak positif.',
    },
  ]

  return (
    <div className="pt-20 bg-dark">
      {/* Hero Section */}
      <section className="section-padding bg-dark hero-pattern cyber-grid relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-primary font-semibold">Kegiatan</span>
              <h1 className="heading-primary">
                Social Impact <span className="gradient-text">Assessment</span>
              </h1>
              <p className="text-body">
                Social Impact Assessment (SIA) adalah proses sistematis untuk menganalisis,
                memonitor, dan mengelola dampak sosial dari suatu proyek, kebijakan, atau program
                pembangunan terhadap masyarakat.
              </p>
              <div className="flex items-center space-x-6 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary text-glow">15+</p>
                  <p className="text-text-body text-sm">Kajian SIA</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-secondary text-glow-secondary">50+</p>
                  <p className="text-text-body text-sm">Komunitas Terdampingi</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary text-glow">5</p>
                  <p className="text-text-body text-sm">Provinsi</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>
              <div className="relative">
                <ImageSlider images={heroImages} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metodologi */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold">Metodologi</span>
            <h2 className="heading-primary mt-2 mb-4">
              Tahapan <span className="gradient-text">Pelaksanaan SIA</span>
            </h2>
            <p className="text-body">
              Kami menerapkan metodologi yang terstruktur dan partisipatif dalam setiap kajian SIA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="card-glow p-6 card-lift relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4 shadow-glow-primary">
                  <span className="text-dark font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="text-lg font-bold text-text-heading mb-2">{step.title}</h3>
                <p className="text-text-body text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Kegiatan SIA */}
      <section id="galeri-sia" className="section-padding bg-dark">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold">Dokumentasi</span>
            <h2 className="heading-primary mt-2 mb-4">
              Galeri <span className="gradient-text">Kegiatan SIA</span>
            </h2>
            <p className="text-body">
              Dokumentasi kegiatan Social Impact Assessment yang telah kami laksanakan di berbagai
              wilayah.
            </p>
          </div>

          {loadingGaleri ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : galeri.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="mx-auto text-text-muted mb-4" size={48} />
              <p className="text-text-body text-lg">Belum ada dokumentasi SIA</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedGaleri.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group relative rounded-2xl overflow-hidden border border-dark-200 card-lift cursor-pointer"
                  >
                    {item.gambar ? (
                      <img
                        src={`http://localhost:5000${item.gambar}`}
                        alt={item.judul}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-56 bg-dark-200/30 flex items-center justify-center">
                        <ImageIcon className="text-text-muted" size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                      <div className="p-4">
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

              {/* Info total */}
              {galeri.length > 0 && (
                <div className="text-center mt-4">
                  <p className="text-text-muted text-sm">
                    Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, galeri.length)} dari {galeri.length}{' '}
                    dokumentasi
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Popup Detail */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-dark-50 rounded-2xl border border-dark-200/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {selectedItem.gambar ? (
                <img
                  src={`http://localhost:5000${selectedItem.gambar}`}
                  alt={selectedItem.judul}
                  className="w-full h-72 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-72 bg-dark-200/30 flex items-center justify-center rounded-t-2xl">
                  <ImageIcon className="text-text-muted" size={64} />
                </div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-dark/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-bold text-text-heading">{selectedItem.judul}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                {selectedItem.tanggal && (
                  <span className="flex items-center space-x-2 bg-dark-200/30 px-3 py-1.5 rounded-full">
                    <Calendar size={14} className="text-primary" />
                    <span>{formatDate(selectedItem.tanggal)}</span>
                  </span>
                )}
                {selectedItem.lokasi && (
                  <span className="flex items-center space-x-2 bg-dark-200/30 px-3 py-1.5 rounded-full">
                    <MapPin size={14} className="text-primary" />
                    <span>{selectedItem.lokasi}</span>
                  </span>
                )}
              </div>
              {selectedItem.deskripsi && (
                <p className="text-text-body leading-relaxed">{selectedItem.deskripsi}</p>
              )}
            </div>
          </div>
        </div>
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
              Tertarik dengan Layanan SIA Kami?
            </h2>
            <p className="text-lg text-text-body mb-8">
              Hubungi kami untuk konsultasi mengenai kajian Social Impact Assessment untuk proyek
              atau program Anda.
            </p>
            <Link
              to="/kegiatan/social-return-on-investment"
              className="btn-primary inline-flex group"
            >
              Lihat juga SROI
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SocialImpactAssessment
