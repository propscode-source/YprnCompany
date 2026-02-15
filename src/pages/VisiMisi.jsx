import { Eye, Target, CheckCircle, Heart, Leaf, Users, Award } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const VisiMisi = () => {
  const { t } = useLanguage()

  const icons = [Heart, Leaf, Users, Award]
  const values = t('visiMisi.values')

  return (
    <div className="pt-20 bg-dark">
      {/* Hero Section */}
      <section className="section-padding bg-dark hero-pattern cyber-grid relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-semibold">{t('visiMisi.heroLabel')}</span>
            <h1 className="heading-primary mt-2 mb-6">
              {t('visiMisi.heroTitle1')}{' '}
              <span className="gradient-text">{t('visiMisi.heroTitle2')}</span>
            </h1>
            <p className="text-body">{t('visiMisi.heroDesc')}</p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="card-glow p-8 card-lift group">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300">
                <Eye className="text-dark" size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-heading mb-3">
                {t('visiMisi.visiTitle')}
              </h3>
              <p className="text-text-body leading-relaxed">{t('visiMisi.visiDesc')}</p>
            </div>

            {/* Mission */}
            <div className="card-glow p-8 card-lift group">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300">
                <Target className="text-dark" size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-heading mb-3">
                {t('visiMisi.misiTitle')}
              </h3>
              <ul className="space-y-2">
                {Array.isArray(t('visiMisi.misiItems')) &&
                  t('visiMisi.misiItems').map((item, index) => (
                    <li key={index} className="flex items-center text-sm text-text-muted">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold">{t('visiMisi.valuesLabel')}</span>
            <h2 className="heading-primary mt-2 mb-4">
              {t('visiMisi.valuesTitle1')}{' '}
              <span className="gradient-text">{t('visiMisi.valuesTitle2')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.isArray(values) &&
              values.map((value, index) => {
                const IconComponent = icons[index] || Heart
                return (
                  <div key={index} className="card-glow p-6 text-center card-lift">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-primary">
                      <IconComponent className="text-dark" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-text-heading mb-2">{value.title}</h3>
                    <p className="text-text-body text-sm">{value.description}</p>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {/* About Organization */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>
              <img
                src="/assets/images/Beranda/beranda2.jpg"
                alt="Kegiatan Yayasan Rimba Nusantara"
                className="relative rounded-2xl shadow-2xl w-full border border-dark-200"
              />
            </div>
            <div className="space-y-6">
              <span className="text-primary font-semibold">{t('visiMisi.aboutLabel')}</span>
              <h2 className="heading-primary">
                {t('visiMisi.aboutTitle1')}{' '}
                <span className="gradient-text">{t('visiMisi.aboutTitle2')}</span>
              </h2>
              <p className="text-body">{t('visiMisi.aboutDesc1')}</p>
              <p className="text-body">{t('visiMisi.aboutDesc2')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VisiMisi
