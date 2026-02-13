import { Star, Quote } from 'lucide-react'
import { testimonials } from '../../data/companyData'

const Testimonials = () => {
  return (
    <section className="section-padding bg-dark">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold">Testimoni</span>
          <h2 className="heading-primary mt-2 mb-4">
            Apa Kata <span className="gradient-text">Klien Kami</span>
          </h2>
          <p className="text-body">
            Kepuasan klien adalah prioritas utama kami. Dengarkan apa yang mereka katakan tentang layanan kami.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="card-glow p-8 relative group"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-primary/20 group-hover:text-primary/40 transition-colors">
                <Quote size={40} />
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                ))}
              </div>

              {/* Content */}
              <p className="text-text-body leading-relaxed mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                />
                <div>
                  <p className="font-semibold text-text-heading">{testimonial.name}</p>
                  <p className="text-sm text-text-muted">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
