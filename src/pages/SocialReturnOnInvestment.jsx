import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Image as ImageIcon,
  MapPin,
  PieChart,
  TrendingUp,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'

import { API_URL, getImageUrl } from '../config/api'
const ITEMS_PER_PAGE = 6

// === Reusable animation variants ===
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

const popupOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const popupContent = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.92, y: 30, transition: { duration: 0.2 } },
}

const ImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-dark-200 bg-dark-100">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1060 / 1500' }}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
              index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}
      </div>

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

const SocialReturnOnInvestment = () => {
  const [galeri, setGaleri] = useState([])
  const [loadingGaleri, setLoadingGaleri] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const { t, language } = useLanguage()

  const totalPages = Math.ceil(galeri.length / ITEMS_PER_PAGE)
  const paginatedGaleri = galeri.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page) => {
    setCurrentPage(page)
    document.getElementById('galeri-sroi')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    fetchGaleri()
    fetchProjects()
  }, [])

  const fetchGaleri = async () => {
    try {
      const res = await fetch(`${API_URL}/kegiatan`)
      if (res.ok) {
        const data = await res.json()
        setGaleri(data.filter((item) => item.kategori === 'sroi'))
      }
    } catch (error) {
      console.error('Error fetching galeri SROI:', error)
    } finally {
      setLoadingGaleri(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/proyek?kategori=sroi`)
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching proyek SROI:', error)
    } finally {
      setLoadingProjects(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const heroImages = [
    { src: '/assets/images/SROI/SROI.webp', alt: 'Social Return on Investment' },
    { src: '/assets/images/SROI/SROI 1.webp', alt: 'Kegiatan SROI' },
  ]

  const stageIcons = [BarChart3, TrendingUp, DollarSign, PieChart]
  const benefits = t('sroiPage.benefits')
  const stages = t('sroiPage.stages')

  return (
    <div className="pt-20 bg-dark">
      {/* Hero Section */}
      <section className="section-padding bg-dark hero-pattern cyber-grid relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text - slide in from left */}
            <motion.div
              className="space-y-6"
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <span className="text-primary font-semibold">{t('sroiPage.heroLabel')}</span>
              <h1 className="heading-primary">
                {t('sroiPage.heroTitle1')}{' '}
                <span className="gradient-text">{t('sroiPage.heroTitle2')}</span>
              </h1>
              <p className="text-body">{t('sroiPage.heroDesc')}</p>
              <motion.div
                className="flex items-center space-x-6 pt-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div
                  className="text-center"
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-3xl font-bold text-primary text-glow">10+</p>
                  <p className="text-text-body text-sm">{t('sroiPage.kajianSROI')}</p>
                </motion.div>
                <motion.div
                  className="text-center"
                  variants={fadeInUp}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-3xl font-bold text-secondary text-glow-secondary">1:4.5</p>
                  <p className="text-text-body text-sm">{t('sroiPage.rataRataRasio')}</p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Hero Image - slide in from right */}
            <motion.div
              className="relative"
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>
              <div className="relative">
                <ImageSlider images={heroImages} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Apa itu SROI */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* SROI Info Text - slide in from left */}
            <motion.div
              className="space-y-6"
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <span className="text-primary font-semibold">{t('sroiPage.whyLabel')}</span>
              <h2 className="heading-primary">
                {t('sroiPage.whyTitle1')}{' '}
                <span className="gradient-text">{t('sroiPage.whyTitle2')}</span>
              </h2>
              <p className="text-body">{t('sroiPage.whyDesc')}</p>
              <motion.div
                className="space-y-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {Array.isArray(benefits) &&
                  benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3"
                      variants={fadeInUp}
                      transition={{ duration: 0.4 }}
                    >
                      <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-text-body">{benefit}</span>
                    </motion.div>
                  ))}
              </motion.div>
            </motion.div>

            {/* Stages grid - staggered cards, slide in from right */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {Array.isArray(stages) &&
                stages.map((stage, index) => {
                  const IconComponent = stageIcons[index] || BarChart3
                  return (
                    <motion.div
                      key={index}
                      className="card-glow p-5 card-lift"
                      variants={scaleIn}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-3 shadow-glow-primary">
                        <IconComponent className="text-dark" size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-text-heading mb-1">{stage.title}</h4>
                      <p className="text-text-body text-xs">{stage.description}</p>
                    </motion.div>
                  )
                })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project SROI */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          {/* Section header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-primary font-semibold">{t('sroiPage.projectLabel')}</span>
            <h2 className="heading-primary mt-2 mb-4">
              {t('sroiPage.projectTitle1')}{' '}
              <span className="gradient-text">{t('sroiPage.projectTitle2')}</span>
            </h2>
          </motion.div>

          {loadingProjects ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-body text-lg">{t('sroiPage.noProject')}</p>
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="card-glow overflow-hidden card-lift group cursor-pointer flex flex-col"
                  variants={scaleIn}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative overflow-hidden bg-dark-100">
                    {project.gambar ? (
                      <img
                        src={getImageUrl(project.gambar)}
                        alt={project.judul}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-48 bg-dark-200/30 flex items-center justify-center">
                        <BarChart3 className="text-text-muted" size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60 pointer-events-none"></div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    {Array.isArray(project.tags) && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-text-heading mb-2">{project.judul}</h3>
                    <p className="text-text-body text-sm">{project.deskripsi}</p>
                    <p className="text-primary text-xs mt-3 font-medium">
                      {t('sroiPage.clickDetail')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Galeri Kegiatan SROI */}
      <section id="galeri-sroi" className="section-padding bg-dark-50">
        <div className="container-custom">
          {/* Section header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-primary font-semibold flex items-center justify-center gap-2">
              <Camera size={18} />
              {t('sroiPage.galeriLabel')}
            </span>
            <h2 className="heading-primary mt-2 mb-4">
              {t('sroiPage.galeriTitle1')}{' '}
              <span className="gradient-text">{t('sroiPage.galeriTitle2')}</span>
            </h2>
            <p className="text-body">{t('sroiPage.galeriDesc')}</p>
          </motion.div>

          {loadingGaleri ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : galeri.length === 0 ? (
            <motion.div
              className="text-center py-20"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ImageIcon className="mx-auto text-text-muted mb-4" size={48} />
              <p className="text-text-body text-lg">{t('sroiPage.noGaleri')}</p>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {paginatedGaleri.map((item) => (
                  <motion.div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group relative overflow-hidden rounded-2xl border border-dark-200 hover:border-primary/30 transition-all duration-300 cursor-pointer card-lift"
                    variants={scaleIn}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    whileHover={{ y: -5 }}
                  >
                    {item.gambar ? (
                      <img
                        src={getImageUrl(item.gambar)}
                        alt={item.judul}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-64 bg-dark-200/30 flex items-center justify-center">
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
                        <p className="text-white/60 text-xs mt-2">{t('sroiPage.clickDetail')}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark/90 to-transparent group-hover:opacity-0 transition-opacity duration-300">
                      <div className="flex items-center space-x-2 text-white">
                        <Camera size={16} className="text-primary" />
                        <span className="text-sm font-medium">{item.judul}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

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
                    {t('sroiPage.showingInfo')} {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, galeri.length)} {t('sroiPage.fromInfo')}{' '}
                    {galeri.length} {t('sroiPage.docInfo')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Popup Detail - Animated with AnimatePresence */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
            variants={popupOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-dark-50 rounded-2xl border border-dark-200/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              variants={popupContent}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative">
                {selectedItem.gambar ? (
                  <img
                    src={getImageUrl(selectedItem.gambar)}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Popup - Animated with AnimatePresence */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
            variants={popupOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-dark-50 rounded-2xl border border-dark-200/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              variants={popupContent}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative">
                {selectedProject.gambar ? (
                  <img
                    src={getImageUrl(selectedProject.gambar)}
                    alt={selectedProject.judul}
                    className="w-full h-72 object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-72 bg-dark-200/30 flex items-center justify-center rounded-t-2xl">
                    <ImageIcon className="text-text-muted" size={64} />
                  </div>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-dark/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-text-heading">{selectedProject.judul}</h3>
                {Array.isArray(selectedProject.tags) && selectedProject.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {selectedProject.deskripsi && (
                  <p className="text-text-body leading-relaxed">{selectedProject.deskripsi}</p>
                )}
                {selectedProject.detail && (
                  <div className="bg-dark/30 rounded-xl p-4">
                    <p className="text-text-body leading-relaxed whitespace-pre-line">
                      {selectedProject.detail}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="section-padding bg-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-heading mb-6">
              {t('sroiPage.ctaTitle')}
            </h2>
            <p className="text-lg text-text-body mb-8">{t('sroiPage.ctaDesc')}</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Link
                to="/kegiatan/social-impact-assessment"
                className="btn-primary inline-flex group"
              >
                {t('sroiPage.ctaBtn')}
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default SocialReturnOnInvestment
