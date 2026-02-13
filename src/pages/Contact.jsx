import ContactForm from '../components/contact/ContactForm'
import ContactInfo from '../components/contact/ContactInfo'
import { companyInfo } from '../data/companyData'

const Contact = () => {
  return (
    <div className="pt-20 bg-dark">
      {/* Hero Section */}
      <section className="section-padding bg-dark hero-pattern cyber-grid relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-semibold">Kontak</span>
            <h1 className="heading-primary mt-2 mb-6">
              Mari <span className="gradient-text">Berbicara</span>
            </h1>
            <p className="text-body">
              Punya pertanyaan atau ingin memulai proyek? Jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="card-glow p-8">
                <h2 className="heading-secondary mb-6">Kirim Pesan</h2>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="card-glow p-8 h-full">
                <ContactInfo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-dark">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-primary font-semibold">FAQ</span>
            <h2 className="heading-primary mt-2 mb-4">
              Pertanyaan <span className="gradient-text">Umum</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Berapa lama waktu yang dibutuhkan untuk menyelesaikan sebuah proyek?',
                answer: 'Waktu penyelesaian proyek bervariasi tergantung kompleksitas dan scope pekerjaan. Proyek sederhana bisa selesai dalam 2-4 minggu, sementara proyek kompleks bisa memakan waktu 3-6 bulan.'
              },
              {
                question: 'Bagaimana proses pembayaran untuk proyek?',
                answer: 'Kami menerapkan sistem pembayaran bertahap. Biasanya 30% di awal proyek, 40% saat progress 50%, dan 30% setelah proyek selesai.'
              },
              {
                question: 'Apakah ada garansi untuk proyek yang dikerjakan?',
                answer: 'Ya, kami memberikan garansi maintenance selama 3 bulan setelah proyek selesai untuk bug fixing dan minor adjustments.'
              },
              {
                question: 'Bisakah saya melihat progress proyek secara berkala?',
                answer: 'Tentu! Kami mengadakan weekly meeting dan memberikan akses ke project management tools sehingga Anda bisa memonitor progress secara real-time.'
              }
            ].map((faq, index) => (
              <div key={index} className="card-glow p-6 hover:border-primary/50 transition-all duration-300">
                <h3 className="text-lg font-semibold text-text-heading mb-2">{faq.question}</h3>
                <p className="text-text-body">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
