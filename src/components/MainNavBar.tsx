import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Users, Search, User } from 'lucide-react'

export function MainNavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const getCurrentIndex = () => {
    if (location.pathname === '/') return 0
    if (location.pathname.startsWith('/groups')) return 1
    if (location.pathname === '/explore') return 2
    if (location.pathname === '/profile') return 3
    return -1
  }

  const currentIndex = getCurrentIndex()

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: User, label: 'Profile', path: '/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = currentIndex === index
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                <Icon size={24} />
                <span
                  className={`text-xs mt-1 ${
                    isActive ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

