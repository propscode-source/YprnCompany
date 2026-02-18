import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { companyInfo } from '../../data/companyData'
import { useLanguage } from '../../hooks/useLanguage'
import { staggerContainer, staggerItem, fadeInUp, defaultViewport } from '../../utils/animations'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  const menuTentang = [
    { name: t('nav.visiMisi'), path: '/tentang/visi-misi' },
    { name: t('nav.strukturOrganisasi'), path: '/tentang/struktur-organisasi' },
  ]

  const menuKegiatan = [
    { name: t('nav.galeriKegiatan'), path: '/kegiatan' },
    { name: t('nav.sia'), path: '/kegiatan/social-impact-assessment' },
    { name: t('nav.sroi'), path: '/kegiatan/social-return-on-investment' },
  ]

  return (
    <footer className="bg-dark border-t border-dark-200/50 text-text-heading">
      {/* Main Footer — stagger columns */}
      <div className="container-custom section-padding">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          custom={0.15}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Company Info */}
          <motion.div variants={staggerItem} className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="/kegiatan.jpg"
                alt="Logo Yayasan"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-text-body leading-relaxed">{companyInfo.tagline}</p>
          </motion.div>

          {/* Tentang Kami */}
          <motion.div variants={staggerItem}>
            <h4 className="text-lg font-semibold mb-6 text-text-heading">
              {t('footer.tentangKami')}
            </h4>
            <ul className="space-y-3">
              {menuTentang.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-body hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Kegiatan */}
          <motion.div variants={staggerItem}>
            <h4 className="text-lg font-semibold mb-6 text-text-heading">{t('footer.kegiatan')}</h4>
            <ul className="space-y-3">
              {menuKegiatan.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-body hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={staggerItem}>
            <h4 className="text-lg font-semibold mb-6 text-text-heading">{t('footer.kontak')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
                <span className="text-text-body">{companyInfo.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary flex-shrink-0" />
                <span className="text-text-body">{companyInfo.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <span className="text-text-body">{companyInfo.email}</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Footer — simple fade in */}
      <div className="border-t border-dark-200/50">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          custom={0}
          className="container-custom py-6"
        >
          <p className="text-text-muted text-sm text-center">
            © {currentYear} {companyInfo.name}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
