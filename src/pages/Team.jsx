import TeamGrid from '../components/team/TeamGrid'
import { Link } from 'react-router-dom'
import { Users, Award, Coffee, Heart } from 'lucide-react'

const Team = () => {
  const teamStats = [
    { icon: Users, value: '50+', label: 'Tim Profesional' },
    { icon: Award, value: '15+', label: 'Penghargaan' },
    { icon: Coffee, value: '∞', label: 'Kopi Diminum' },
    { icon: Heart, value: '100%', label: 'Passion' }
  ]

  return (
    <div className="pt-20 bg-dark">
      {/* Hero Section */}
      <section className="section-padding bg-dark hero-pattern cyber-grid relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-semibold">Tim Kami</span>
            <h1 className="heading-primary mt-2 mb-6">
              Kenali <span className="gradient-text">Tim Hebat</span> di Balik Kesuksesan
            </h1>
            <p className="text-body">
              Tim profesional kami terdiri dari individu-individu berbakat yang berdedikasi untuk memberikan hasil terbaik bagi setiap klien.
            </p>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {teamStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="card-glow p-6 text-center hover:border-primary/50 transition-all duration-300">
                  <IconComponent className={`mx-auto mb-3 ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`} size={32} />
                  <p className={`text-3xl font-bold ${index % 2 === 0 ? 'text-primary text-glow' : 'text-secondary text-glow-secondary'}`}>{stat.value}</p>
                  <p className="text-text-body text-sm">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-secondary">
              Leadership Team
            </h2>
            <p className="text-body mt-4">
              Para pemimpin visioner yang mengarahkan perusahaan menuju kesuksesan.
            </p>
          </div>
          <TeamGrid />
        </div>
      </section>

      {/* Join Our Team */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold">Karir</span>
              <h2 className="heading-primary mt-2 mb-6">
                Bergabung dengan <span className="gradient-text">Tim Kami</span>
              </h2>
              <p className="text-body mb-6">
                Kami selalu mencari talenta-talenta terbaik untuk bergabung dengan tim kami. Jika Anda memiliki passion di bidang teknologi dan ingin berkembang bersama, kami ingin mendengar dari Anda.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-glow-primary">
                    <span className="text-dark text-xs font-bold">✓</span>
                  </div>
                  <span className="text-text-body">Lingkungan kerja yang kolaboratif</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-glow-primary">
                    <span className="text-dark text-xs font-bold">✓</span>
                  </div>
                  <span className="text-text-body">Kesempatan belajar dan berkembang</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-glow-primary">
                    <span className="text-dark text-xs font-bold">✓</span>
                  </div>
                  <span className="text-text-body">Kompensasi dan benefit yang kompetitif</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-glow-primary">
                    <span className="text-dark text-xs font-bold">✓</span>
                  </div>
                  <span className="text-text-body">Work-life balance yang sehat</span>
                </li>
              </ul>
              <Link to="/contact" className="btn-primary">
                Lihat Lowongan
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Join Our Team"
                className="relative rounded-2xl shadow-xl w-full border border-dark-200"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Team
