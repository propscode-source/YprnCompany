import { Code, Smartphone, Palette, TrendingUp, Cloud, Headphones, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../../data/companyData'

const iconMap = {
  Code: Code,
  Smartphone: Smartphone,
  Palette: Palette,
  TrendingUp: TrendingUp,
  Cloud: Cloud,
  HeadphonesIcon: Headphones
}

const Services = () => {
  return (
    <section className="section-padding bg-dark-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold">Layanan Kami</span>
          <h2 className="heading-primary mt-2 mb-4">
            Solusi Lengkap untuk{' '}
            <span className="gradient-text">Kebutuhan Digital</span>
          </h2>
          <p className="text-body">
            Kami menyediakan berbagai layanan digital untuk membantu bisnis Anda berkembang di era digital.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon]
            return (
              <div 
                key={service.id}
                className="card-glow p-8 card-lift group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300">
                  {IconComponent && <IconComponent className="text-dark" size={28} />}
                </div>
                <h3 className="text-xl font-bold text-text-heading mb-3">
                  {service.title}
                </h3>
                <p className="text-text-body mb-4 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-text-muted">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/services" 
                  className="inline-flex items-center text-primary font-semibold hover:text-primary-400 group"
                >
                  Selengkapnya
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/services" className="btn-primary">
            Lihat Semua Layanan
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Services
