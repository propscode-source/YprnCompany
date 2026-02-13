import { useState } from 'react'
import PortfolioCard from './PortfolioCard'
import { portfolioProjects } from '../../data/companyData'

const PortfolioGrid = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  
  const categories = ['All', ...new Set(portfolioProjects.map(p => p.category))]
  
  const filteredProjects = activeFilter === 'All' 
    ? portfolioProjects 
    : portfolioProjects.filter(p => p.category === activeFilter)

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              activeFilter === category
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <PortfolioCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

export default PortfolioGrid
