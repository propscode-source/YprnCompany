import { Eye, Target, CheckCircle, Heart, Leaf, Users, Award } from 'lucide-react'

const VisiMisi = () => {
  const values = [
    {
      icon: Heart,
      title: 'Integritas',
      description:
        'Berkomitmen pada kejujuran dan transparansi dalam setiap aspek pekerjaan dan advokasi kami.',
    },
    {
      icon: Leaf,
      title: 'Keberlanjutan',
      description:
        'Mendorong praktik pengelolaan sumber daya alam yang berkelanjutan dan ramah lingkungan.',
    },
    {
      icon: Users,
      title: 'Pemberdayaan',
      description:
        'Memberdayakan masyarakat lokal untuk berpartisipasi aktif dalam pelestarian lingkungan.',
    },
    {
      icon: Award,
      title: 'Profesionalisme',
      description: 'Menjalankan setiap program dan kajian dengan standar profesional yang tinggi.',
    },
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
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-semibold">Tentang Kami</span>
            <h1 className="heading-primary mt-2 mb-6">
              Visi & <span className="gradient-text">Misi</span>
            </h1>
            <p className="text-body">
              Yayasan Pemerhati Rimba Nusantara (YPRN) didirikan tahun 2024. Berkedudukan di Kota
              Palembang Provinsi Sumatera Selatan. Kami memiliki kompetensi dibidang riset dan
              kajian yang berguna dalam pengambilan keputusan strategis. Beberapa kegiatan yang
              pernah dilakukan berkaitan dengan Social Impact Assement (SIA) dan analisis Social
              Return on Investment (SROI) pada beberapa entitas bisnis di Sumatera Selatan.
            </p>
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
              <h3 className="text-xl font-bold text-text-heading mb-3">Visi</h3>
              <p className="text-text-body leading-relaxed">
                Menjadi Organisasi Lingkungan Hidup yang dapat membangun keberlanjutan dan kemitraan
                dalam pengelolaan lingkungan hidup kesejahteraan masyarakat.
              </p>
            </div>

            {/* Mission */}
            <div className="card-glow p-8 card-lift group">
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300">
                <Target className="text-dark" size={28} />
              </div>
              <h3 className="text-xl font-bold text-text-heading mb-3">Misi</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-text-muted">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Melakukan pendampingan dan pemberdayaan masyarakat.
                </li>
                <li className="flex items-center text-sm text-text-muted">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Mendorong kemitraan antara pemangku kepentingan.
                </li>
                <li className="flex items-center text-sm text-text-muted">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Mengembangkan program dan kebijakan pengelolaan lingkungan hidup yang bermanfaat
                  secara ekonomi dan sosial.
                </li>
                <li className="flex items-center text-sm text-text-muted">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                  Mewujudkan sumber daya organisasi yang profesional, kredibel dan kompeten.
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
            <span className="text-primary font-semibold">Nilai Kami</span>
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
              <span className="text-primary font-semibold">Tentang Yayasan</span>
              <h2 className="heading-primary">
                Yayasan Pemerhati <span className="gradient-text">Rimba Nusantara</span>
              </h2>
              <p className="text-body">
                Yayasan Pemerhati Rimba Nusantara adalah organisasi nirlaba yang berdedikasi untuk
                menjaga lingkungan dan kelestarian hutan Indonesia. Kami fokus pada upaya
                pemberdayaan masyarakat sekitar hutan, mendorong praktik-praktik bisnis yang
                berkelanjutan di sektor kehutanan, pertambangan, serta mengkampanyekan pentingnya
                menjaga lingkungan.
              </p>
              <p className="text-body">
                Kami juga terlibat dalam kajian transisi energi khususnya di wilayah penghasil
                batubara Provinsi Sumatera Selatan. Kegiatan kami meliputi pendampingan masyarakat,
                penelitian, advokasi kebijakan tata kelola sumberdaya alam, energi, dan edukasi
                lingkungan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VisiMisi
