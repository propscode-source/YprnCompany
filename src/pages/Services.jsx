import { Code, Smartphone, Palette, TrendingUp, Cloud, Headphones, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../data/companyData'

const iconMap = {
  Code: Code,
  Smartphone: Smartphone,
  Palette: Palette,
  TrendingUp: TrendingUp,
  Cloud: Cloud,
  HeadphonesIcon: Headphones
}

const Services = () => {
  const process = [
    {
      step: '01',
      title: 'Konsultasi',
      description: 'Diskusi mendalam tentang kebutuhan dan tujuan bisnis Anda.'
    },
    {
      step: '02',
      title: 'Perencanaan',
      description: 'Membuat roadmap dan strategi implementasi yang terperinci.'
    },
    {
      step: '03',
      title: 'Eksekusi',
      description: 'Pengembangan solusi dengan standar kualitas tinggi.'
    },
    {
      step: '04',
      title: 'Peluncuran',
      description: 'Deployment dan dukungan berkelanjutan pasca peluncuran.'
    }
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
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-semibold">Layanan Kami</span>
            <h1 className="heading-primary mt-2 mb-6">
              Solusi Digital <span className="gradient-text">Lengkap</span> untuk Bisnis Anda
            </h1>
            <p className="text-body">
              Kami menyediakan berbagai layanan digital untuk membantu bisnis Anda berkembang dan sukses di era digital.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="space-y-24">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon]
              const isEven = index % 2 === 0

              return (
                <div 
                  key={service.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className={`${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl rotate-3 blur-xl"></div>
                      <div className="relative bg-dark-100 border border-dark-200 rounded-3xl p-12 flex items-center justify-center">
                        <div className={`w-32 h-32 bg-gradient-to-br ${isEven ? 'from-primary to-secondary' : 'from-secondary to-primary'} rounded-3xl flex items-center justify-center animate-float shadow-glow-primary`}>
                          {IconComponent && <IconComponent className="text-dark" size={64} />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-6 ${!isEven ? 'lg:order-1' : ''}`}>
                    <span className={`inline-block px-4 py-2 ${isEven ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'} rounded-full text-sm font-medium`}>
                      Layanan #{service.id}
                    </span>
                    <h2 className="heading-secondary">{service.title}</h2>
                    <p className="text-body">{service.description}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="text-primary flex-shrink-0" size={18} />
                          <span className="text-text-body">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link to="/contact" className="btn-primary inline-flex group">
                      Mulai Proyek
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold">Proses Kerja</span>
            <h2 className="heading-primary mt-2 mb-4">
              Bagaimana Kami <span className="gradient-text">Bekerja</span>
            </h2>
            <p className="text-body">
              Proses kerja kami yang terstruktur memastikan setiap proyek berjalan lancar dan menghasilkan output berkualitas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="card-glow p-6 text-center card-lift">
                  <div className={`text-5xl font-bold mb-4 ${index % 2 === 0 ? 'text-primary text-glow' : 'text-secondary text-glow-secondary'}`}>{item.step}</div>
                  <h3 className="text-xl font-bold text-text-heading mb-2">{item.title}</h3>
                  <p className="text-text-body text-sm">{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="text-primary/50" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-dark-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-text-heading mb-6">
            Siap Memulai Proyek Anda?
          </h2>
          <p className="text-lg text-text-body mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk konsultasi gratis dan diskusikan bagaimana kami dapat membantu mewujudkan visi digital Anda.
          </p>
          <Link to="/contact" className="btn-primary">
            Hubungi Kami Sekarang
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Services
