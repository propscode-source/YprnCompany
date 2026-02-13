import { ArrowRight, Sparkles, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center hero-pattern cyber-grid bg-dark pt-20 overflow-hidden">
      {/* Background layout wallpaper */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "url('/assets/images/Layout/layout.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] floating-orb"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] floating-orb" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-dark-100 border border-primary/30 rounded-full shadow-glow-primary">
              <Leaf className="w-4 h-4 text-primary mr-2 animate-pulse" />
              <span className="text-primary text-sm font-medium">Pelestarian Lingkungan & Pemberdayaan Masyarakat</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading leading-tight">
              Yayasan Pemerhati{' '}
              <span className="gradient-text text-glow">Rimba Nusantara</span>
            </h1>

            <p className="text-lg md:text-xl text-text-body leading-relaxed max-w-xl">
              Menjaga lingkungan dan kelestarian hutan Indonesia melalui pemberdayaan masyarakat, penelitian, advokasi kebijakan, dan edukasi lingkungan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/tentang/visi-misi"
                className="btn-primary group"
              >
                Tentang Kami
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                to="/kegiatan/social-impact-assessment"
                className="btn-glow group"
              >
                <Sparkles className="mr-2" size={20} />
                Lihat Kegiatan
              </Link>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative animate-slide-up">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl rotate-6 blur-2xl"></div>
              <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl rotate-3"></div>
              <div className="relative rounded-3xl shadow-2xl border border-dark-200 overflow-hidden bg-dark-100" style={{ aspectRatio: '4 / 3' }}>
                <img
                  src="/assets/images/Beranda/beranda1.jpg"
                  alt="Kegiatan Yayasan"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-dark-50/90 backdrop-blur-xl p-6 rounded-2xl border border-primary/30 shadow-glow-primary animate-float">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-glow-primary">
                  <Leaf className="text-dark" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-heading">2</p>
                  <p className="text-text-body text-sm">Tahun Berdedikasi</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-dark-50/90 backdrop-blur-xl px-4 py-3 rounded-xl border border-secondary/30 shadow-glow-secondary animate-float" style={{ animationDelay: '-1.5s' }}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-secondary text-sm font-medium">Sumatera Selatan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
