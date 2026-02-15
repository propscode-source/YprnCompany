import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { companyInfo } from '../../data/companyData'
import { useLanguage } from '../../context/LanguageContext'

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
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/Logo.svg"
                alt="Logo Yayasan"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-text-body leading-relaxed">{companyInfo.tagline}</p>
          </div>

          {/* Tentang Kami */}
          <div>
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
          </div>

          {/* Kegiatan */}
          <div>
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
          </div>

          {/* Contact Info */}
          <div>
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
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-dark-200/50">
        <div className="container-custom py-6">
          <p className="text-text-muted text-sm text-center">
            © {currentYear} {companyInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
