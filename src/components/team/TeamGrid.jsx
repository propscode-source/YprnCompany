import TeamCard from './TeamCard'
import { teamMembers } from '../../data/companyData'

const TeamGrid = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teamMembers.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </div>
  )
}

export default TeamGrid
