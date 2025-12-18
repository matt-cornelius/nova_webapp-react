import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { MainNavBar } from '../components/MainNavBar'

interface DemoGroup {
  name: string
  membersLabel: string
  description: string
  organizationId: string
}

const groups: DemoGroup[] = [
  {
    name: 'Hack For Good Squad',
    membersLabel: '24 members · Online',
    description:
      'Developers running mini‑fundraisers during hackathons and meetups.',
    organizationId: 'org_coding_kids', // Code For Kids
  },
  {
    name: 'Local Climate Crew',
    membersLabel: '12 members · In‑person',
    description:
      'Neighbors organizing recurring donations for climate projects.',
    organizationId: 'org_tree_alliance', // Urban Tree Alliance
  },
  {
    name: 'Company Giving Circle',
    membersLabel: '58 members · Hybrid',
    description:
      'Coworkers pooling monthly contributions to vote on causes.',
    organizationId: 'org_clean_water', // Clean Water Now
  },
]

export function GroupsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-primary-dark text-center">
            Groups
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-on-surface mb-3">
            Join people who care about the same causes.
          </h2>
          <p className="text-on-surface-variant">
            Groups make it easier to coordinate donations, set shared goals, and
            see your combined impact over time.
          </p>
        </div>

        <div className="space-y-3">
          {groups.map((group) => (
            <div
              key={group.name}
              onClick={() =>
                navigate('/groups/chat', {
                  state: { groupName: group.name, organizationId: group.organizationId },
                })
              }
              className="bg-surface rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-dark font-bold text-base">
                    {group.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-on-surface mb-1">
                    {group.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium mb-2">
                    {group.membersLabel}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {group.description}
                  </p>
                </div>
                <ChevronRight className="text-on-surface-variant flex-shrink-0" size={20} />
              </div>
            </div>
          ))}
        </div>
      </main>

      <MainNavBar />
    </div>
  )
}

