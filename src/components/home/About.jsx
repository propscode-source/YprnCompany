import { CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

const About = () => {
  const { t } = useLanguage()

  const features = t('about.features')

  return (
    <section className="section-padding bg-dark">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>
              <img
                src="/assets/images/Beranda/beranda2.jpg"
                alt="Kegiatan Yayasan"
                className="relative rounded-2xl shadow-xl w-full object-cover border border-dark-200"
              />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-dark shadow-glow-primary">
                <div className="text-center">
                  <p className="text-4xl font-bold">2</p>
                  <p className="text-sm">{t('about.yearsDedicated')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <span className="text-primary font-semibold">{t('about.label')}</span>
            <h2 className="heading-primary">
              {t('about.title1')} <span className="gradient-text">{t('about.title2')}</span>
            </h2>
            <p className="text-body">{t('about.description')}</p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {Array.isArray(features) &&
                features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span className="text-text-body">{feature}</span>
                  </div>
                ))}
            </div>

            <Link to="/tentang/visi-misi" className="btn-primary inline-flex group mt-4">
              {t('about.btnLearnMore')}
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
