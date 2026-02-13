import { CheckCircle, Target, Eye, Heart, Award, Users, Zap } from 'lucide-react'
import { companyInfo, stats } from '../data/companyData'

const AboutUs = () => {
  const values = [
    {
      icon: Heart,
      title: 'Integritas',
      description: 'Kami berkomitmen pada kejujuran dan transparansi dalam setiap aspek pekerjaan kami.'
    },
    {
      icon: Zap,
      title: 'Inovasi',
      description: 'Selalu mencari solusi kreatif dan teknologi terbaru untuk hasil terbaik.'
    },
    {
      icon: Users,
      title: 'Kolaborasi',
      description: 'Bekerja sama dengan klien sebagai partner untuk mencapai tujuan bersama.'
    },
    {
      icon: Award,
      title: 'Kualitas',
      description: 'Tidak ada kompromi dalam memberikan kualitas terbaik di setiap proyek.'
    }
  ]

  const milestones = [
    { year: '2014', event: 'Perusahaan didirikan dengan 3 orang tim' },
    { year: '2016', event: 'Mencapai 50 klien pertama' },
    { year: '2018', event: 'Ekspansi tim menjadi 25 orang' },
    { year: '2020', event: 'Meraih penghargaan Best Digital Agency' },
    { year: '2022', event: 'Melayani 100+ klien enterprise' },
    { year: '2024', event: 'Tim berkembang menjadi 50+ profesional' }
  ]

  return (
    <div className="pt-20 bg-dark">
      {/* Hero Section */}
      <section className="section-padding bg-dark hero-pattern cyber-grid relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-primary font-semibold">Tentang Kami</span>
              <h1 className="heading-primary">
                Membangun Masa Depan Digital{' '}
                <span className="gradient-text">Bersama</span>
              </h1>
              <p className="text-body">
                {companyInfo.description}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {stats.slice(0, 4).map((stat, index) => (
                  <div key={stat.id} className="text-center p-4 bg-dark-100 border border-dark-200 rounded-xl hover:border-primary/30 transition-all duration-300">
                    <p className={`text-3xl font-bold ${index % 2 === 0 ? 'text-primary text-glow' : 'text-secondary text-glow-secondary'}`}>{stat.value}</p>
                    <p className="text-text-body text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                alt="Our Team"
                className="relative rounded-2xl shadow-2xl w-full border border-dark-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="card-glow p-8 border-l-4 border-primary">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow-primary">
                  <Eye className="text-dark" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-text-heading">Visi</h3>
              </div>
              <p className="text-text-body leading-relaxed">
                Menjadi perusahaan teknologi terdepan di Indonesia yang memberikan solusi digital inovatif dan berdampak positif bagi masyarakat dan bisnis.
              </p>
            </div>

            {/* Mission */}
            <div className="card-glow p-8 border-l-4 border-secondary">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-glow-secondary">
                  <Target className="text-dark" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-text-heading">Misi</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                  <span className="text-text-body">Memberikan solusi teknologi berkualitas tinggi</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                  <span className="text-text-body">Mengembangkan SDM yang kompeten dan inovatif</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="text-primary flex-shrink-0 mt-1" size={18} />
                  <span className="text-text-body">Membangun kemitraan jangka panjang dengan klien</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold">Nilai Perusahaan</span>
            <h2 className="heading-primary mt-2 mb-4">
              Nilai yang Kami <span className="gradient-text">Pegang Teguh</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
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

      {/* Timeline */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold">Perjalanan Kami</span>
            <h2 className="heading-primary mt-2 mb-4">
              Milestone <span className="gradient-text">Perusahaan</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start mb-8 last:mb-0">
                <div className="flex-shrink-0 w-24 text-right pr-6">
                  <span className="text-xl font-bold text-primary text-glow">{milestone.year}</span>
                </div>
                <div className="relative">
                  <div className="w-4 h-4 bg-primary rounded-full shadow-glow-primary"></div>
                  {index !== milestones.length - 1 && (
                    <div className="absolute top-4 left-1.5 w-1 h-full bg-gradient-to-b from-primary to-secondary/30"></div>
                  )}
                </div>
                <div className="flex-1 pl-6 pb-8">
                  <div className="card-glow p-4 hover:border-primary/50 transition-all duration-300">
                    <p className="text-text-body">{milestone.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
