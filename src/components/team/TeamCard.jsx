import { Linkedin, Twitter } from 'lucide-react'

const TeamCard = ({ member }) => {
  return (
    <div className="card-glow overflow-hidden card-lift group text-center">
      {/* Image */}
      <div className="relative img-zoom">
        <img 
          src={member.image}
          alt={member.name}
          className="w-full h-72 object-cover"
        />
        
        {/* Social overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <div className="flex space-x-3">
            <a 
              href={member.social.linkedin}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-400 hover:shadow-glow-primary transition-all duration-300"
            >
              <Linkedin size={18} className="text-dark" />
            </a>
            <a 
              href={member.social.twitter}
              className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary-400 hover:shadow-glow-secondary transition-all duration-300"
            >
              <Twitter size={18} className="text-dark" />
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-text-heading mb-1">{member.name}</h3>
        <p className="text-primary font-medium mb-3">{member.position}</p>
        <p className="text-text-body text-sm">{member.bio}</p>
      </div>
    </div>
  )
}

export default TeamCard
