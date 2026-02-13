import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { companyInfo } from '../data/companyData'

const Kontak = () => {
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
            <span className="text-primary font-semibold">Hubungi Kami</span>
            <h1 className="heading-primary mt-2 mb-6">
              Kontak <span className="gradient-text">Kami</span>
            </h1>
            <p className="text-body">
              Jangan ragu untuk menghubungi kami. Kami siap membantu dan menjawab pertanyaan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Info Kontak & Maps */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info Kontak */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-text-heading mb-6">
                  Informasi <span className="gradient-text">Kontak</span>
                </h2>
                <p className="text-text-body mb-8">
                  Hubungi kami untuk informasi lebih lanjut mengenai kegiatan, program, atau kerjasama dengan Yayasan Pemerhati Rimba Nusantara.
                </p>
              </div>

              <div className="space-y-6">
                <div className="card-glow p-5 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-primary">
                    <MapPin className="text-dark" size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-heading mb-1">Alamat</h3>
                    <p className="text-text-body text-sm">{companyInfo.address}</p>
                  </div>
                </div>

                <div className="card-glow p-5 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-primary">
                    <Phone className="text-dark" size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-heading mb-1">Telepon</h3>
                    <p className="text-text-body text-sm">{companyInfo.phone}</p>
                  </div>
                </div>

                <div className="card-glow p-5 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-primary">
                    <Mail className="text-dark" size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-heading mb-1">Email</h3>
                    <p className="text-text-body text-sm">{companyInfo.email}</p>
                  </div>
                </div>

                <div className="card-glow p-5 flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-primary">
                    <Clock className="text-dark" size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-heading mb-1">Jam Operasional</h3>
                    <p className="text-text-body text-sm">Senin - Jumat: 08.00 - 17.00 WIB</p>
                    <p className="text-text-body text-sm">Sabtu - Minggu: Tutup</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-text-heading mb-6">
                Lokasi <span className="gradient-text">Kantor</span>
              </h2>
              <div className="card-glow overflow-hidden rounded-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d1675.3005048349974!2d104.74117721986681!3d-2.942332581252365!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMsKwNTYnMzAuNiJTIDEwNMKwNDQnMjkuNSJF!5e0!3m2!1sid!2sid!4v1770376310906!5m2!1sid!2sid"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Kantor"
                  className="w-full"
                ></iframe>
              </div>
              <p className="text-text-muted text-xs text-center">
                * Klik peta untuk melihat lokasi lebih detail di Google Maps
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Kontak
