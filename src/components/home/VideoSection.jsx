import { Play, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { API_URL, getImageUrl } from '../../config/api'
import { useLanguage } from '../../hooks/useLanguage'
import { backdropVariant, defaultViewport, fadeInUp, modalVariant } from '../../utils/animations'

const VideoSection = () => {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [videoData, setVideoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef(null)
  const thumbnailRef = useRef(null)

  // Set thumbnail ke detik ke-3 agar tidak menampilkan frame hitam
  const handleThumbnailLoaded = useCallback(() => {
    if (thumbnailRef.current) {
      thumbnailRef.current.currentTime = 3
    }
  }, [])

  // Fetch video aktif dari API
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`${API_URL}/video-beranda`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.video) {
            setVideoData(data)
          }
        }
      } catch {
        // Gagal fetch — section tidak ditampilkan
        console.error('Gagal memuat video beranda')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [])

  const videoSrc = videoData ? getImageUrl(videoData.video) : null

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      // Reset src agar browser lepas buffer memori
      videoRef.current.removeAttribute('src')
      videoRef.current.load()
    }
    setIsOpen(false)
  }, [])

  // Lock body scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Tutup modal dengan tombol Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, closeModal])

  // Jangan render section jika loading atau tidak ada video
  if (loading || !videoSrc) return null

  return (
    <>
      <section className="section-padding bg-dark relative overflow-hidden">
        {/* Background decorative */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="container-custom relative z-10">
          {/* Section heading */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            custom={0}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="text-primary font-semibold">{t('homeVideo.label')}</span>
            <h2 className="heading-primary mt-2 mb-4">
              {t('homeVideo.title1')} <span className="gradient-text">{t('homeVideo.title2')}</span>
            </h2>
            <p className="text-body">{t('homeVideo.description')}</p>
          </motion.div>

          {/* Video thumbnail / play trigger */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            custom={0.2}
            className="max-w-4xl mx-auto"
          >
            <button
              onClick={openModal}
              className="relative w-full aspect-video rounded-2xl overflow-hidden group cursor-pointer border border-dark-200/50 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={t('homeVideo.playLabel')}
            >
              {/* Thumbnail dari frame pertama video -- preload metadata saja */}
              <video
                ref={thumbnailRef}
                className="w-full h-full object-cover"
                src={videoSrc}
                preload="metadata"
                muted
                playsInline
                tabIndex={-1}
                aria-hidden="true"
                onLoadedMetadata={handleThumbnailLoaded}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/30 transition-colors duration-300" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/90 rounded-full flex items-center justify-center shadow-glow-primary group-hover:scale-110 transition-transform duration-300">
                  <Play className="text-dark ml-1" size={36} />
                </div>
              </div>

              {/* Caption bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/80 to-transparent p-6">
                <p className="text-text-heading font-medium text-lg">
                  {videoData.judul || t('homeVideo.caption')}
                </p>
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Video Modal Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark/90 backdrop-blur-sm p-4"
          >
            <motion.div
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-text-muted hover:text-text-heading transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={28} />
              </button>

              {/* Video player */}
              <div className="rounded-2xl overflow-hidden bg-dark-100 shadow-2xl">
                <video
                  ref={videoRef}
                  className="w-full aspect-video"
                  src={videoSrc}
                  controls
                  autoPlay
                  preload="auto"
                  playsInline
                >
                  Browser Anda tidak mendukung tag video.
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VideoSection
