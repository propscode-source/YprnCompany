import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitStatus('success')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })

    // Clear success message after 5 seconds
    setTimeout(() => setSubmitStatus(null), 5000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-body mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-text-heading placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary input-focus outline-none transition-all"
            placeholder="Masukkan nama Anda"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-body mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-text-heading placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary input-focus outline-none transition-all"
            placeholder="email@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text-body mb-2">
            Nomor Telepon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-text-heading placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary input-focus outline-none transition-all"
            placeholder="+62 xxx xxxx xxxx"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-text-body mb-2">
            Subjek *
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-text-heading focus:ring-2 focus:ring-primary/50 focus:border-primary input-focus outline-none transition-all"
          >
            <option value="" className="bg-dark-100">Pilih subjek</option>
            <option value="web-development" className="bg-dark-100">Web Development</option>
            <option value="mobile-development" className="bg-dark-100">Mobile Development</option>
            <option value="ui-ux-design" className="bg-dark-100">UI/UX Design</option>
            <option value="digital-marketing" className="bg-dark-100">Digital Marketing</option>
            <option value="consultation" className="bg-dark-100">Konsultasi</option>
            <option value="other" className="bg-dark-100">Lainnya</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-text-body mb-2">
          Pesan *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-text-heading placeholder-text-muted focus:ring-2 focus:ring-primary/50 focus:border-primary input-focus outline-none transition-all resize-none"
          placeholder="Ceritakan tentang proyek atau kebutuhan Anda..."
        ></textarea>
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-primary/20 text-primary rounded-lg border border-primary/30">
          Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="mr-2" size={20} />
            Kirim Pesan
          </>
        )}
      </button>
    </form>
  )
}

export default ContactForm
