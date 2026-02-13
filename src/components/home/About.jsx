import { CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
  const features = [
    'Pendampingan masyarakat sekitar hutan',
    'Penelitian dan kajian lingkungan',
    'Advokasi kebijakan sumber daya alam',
    'Edukasi lingkungan dan kesadaran publik'
  ]

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
                  <p className="text-sm">Tahun Berdedikasi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <span className="text-primary font-semibold">Tentang Kami</span>
            <h2 className="heading-primary">
              Menjaga Kelestarian Alam{' '}
              <span className="gradient-text">Indonesia</span>
            </h2>
            <p className="text-body">
              Yayasan Pemerhati Rimba Nusantara adalah organisasi nirlaba yang berdedikasi untuk menjaga lingkungan dan kelestarian hutan Indonesia. Kami fokus pada upaya pemberdayaan masyarakat sekitar hutan, mendorong praktik-praktik bisnis yang berkelanjutan di sektor kehutanan, pertambangan, serta mengkampanyekan pentingnya menjaga lingkungan. Kami juga terlibat dalam kajian transisi energi khususnya di wilayah penghasil batubara Provinsi Sumatera Selatan.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-primary flex-shrink-0" size={20} />
                  <span className="text-text-body">{feature}</span>
                </div>
              ))}
            </div>

            <Link 
              to="/tentang/visi-misi" 
              className="btn-primary inline-flex group mt-4"
            >
              Pelajari Lebih Lanjut
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
