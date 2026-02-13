import { stats } from '../../data/companyData'

const Stats = () => {
  return (
    <section className="py-16 bg-dark-50 border-y border-dark-200/50 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.id}
              className="text-center group"
            >
              <p className={`text-4xl md:text-5xl font-bold mb-2 animate-pulse-slow ${
                index % 2 === 0 ? 'text-primary text-glow' : 'text-secondary text-glow-secondary'
              }`}>
                {stat.value}
              </p>
              <p className="text-text-body text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
