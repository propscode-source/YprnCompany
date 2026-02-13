import { ExternalLink } from 'lucide-react'

const PortfolioCard = ({ project }) => {
  return (
    <div className="card-glow overflow-hidden card-lift group">
      {/* Image */}
      <div className="relative img-zoom h-56">
        <img 
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block px-3 py-1 bg-primary text-dark text-xs font-semibold rounded-full mb-2">
              {project.category}
            </span>
          </div>
        </div>
        
        {/* Hover overlay with link */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow-primary hover:bg-primary-400 transition-all duration-300">
            <ExternalLink size={20} className="text-dark" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-primary text-sm font-medium mb-1">{project.client}</p>
        <h3 className="text-xl font-bold text-text-heading mb-2">{project.title}</h3>
        <p className="text-text-body text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-dark-200 text-text-body text-xs rounded-full border border-dark-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PortfolioCard
