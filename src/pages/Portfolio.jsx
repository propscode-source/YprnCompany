import PortfolioGrid from '../components/portfolio/PortfolioGrid'
import { Link } from 'react-router-dom'

const Portfolio = () => {
  return (
    <div className="pt-20 bg-dark">
      {/* Hero Section */}
      <section className="section-padding bg-dark hero-pattern cyber-grid relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-semibold">Portfolio</span>
            <h1 className="heading-primary mt-2 mb-6">
              Karya Terbaik <span className="gradient-text">Kami</span>
            </h1>
            <p className="text-body">
              Jelajahi berbagai proyek yang telah kami kerjakan untuk klien-klien kami. Setiap proyek adalah bukti komitmen kami terhadap kualitas dan inovasi.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <PortfolioGrid />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <div className="card-glow p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
            <div className="relative z-10">
              <h2 className="heading-secondary mb-4">
                Ingin Proyek Anda Berikutnya?
              </h2>
              <p className="text-body mb-8">
                Mari diskusikan bagaimana kami dapat membantu mewujudkan ide Anda menjadi kenyataan.
              </p>
              <Link to="/contact" className="btn-primary">
                Mulai Proyek Bersama Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Portfolio
