import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { companyInfo } from '../../data/companyData'

const ContactInfo = () => {
  const contactItems = [
    {
      icon: MapPin,
      title: 'Alamat',
      content: companyInfo.address,
      link: `https://maps.google.com/?q=${encodeURIComponent(companyInfo.address)}`
    },
    {
      icon: Phone,
      title: 'Telepon',
      content: companyInfo.phone,
      link: `tel:${companyInfo.phone.replace(/\s/g, '')}`
    },
    {
      icon: Mail,
      title: 'Email',
      content: companyInfo.email,
      link: `mailto:${companyInfo.email}`
    },
    {
      icon: Clock,
      title: 'Jam Kerja',
      content: 'Senin - Jumat: 09:00 - 18:00',
      link: null
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-text-heading mb-2">Hubungi Kami</h3>
        <p className="text-text-body">
          Punya pertanyaan atau ingin memulai proyek? Kami siap membantu Anda.
        </p>
      </div>

      <div className="space-y-6">
        {contactItems.map((item, index) => {
          const IconComponent = item.icon
          const content = (
            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-300">
                <IconComponent className="text-dark" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-text-heading">{item.title}</h4>
                <p className="text-text-body">{item.content}</p>
              </div>
            </div>
          )

          return item.link ? (
            <a 
              key={index}
              href={item.link}
              target={item.icon === MapPin ? "_blank" : undefined}
              rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
              className="block hover:bg-dark-100 p-2 -m-2 rounded-xl transition-colors duration-300"
            >
              {content}
            </a>
          ) : (
            <div key={index} className="p-2 -m-2">
              {content}
            </div>
          )
        })}
      </div>

      {/* Map */}
      <div className="mt-8">
        <div className="rounded-2xl overflow-hidden h-64 bg-dark-100 border border-dark-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2904695289955!2d106.82295821476882!3d-6.224909995493742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJl.%20Jend.%20Sudirman%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1635000000000!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          ></iframe>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
