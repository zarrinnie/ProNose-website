import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { navTabs } from '../lib/roles'

// Bottom tab bar pinned within the phone frame.
export default function BottomNav() {
  const { currentUser } = useAuth()
  const tabs = navTabs(currentUser?.role)

  return (
    <nav className="sticky bottom-0 z-10 mt-auto flex items-center justify-around border-t border-gray-100 bg-white px-2 py-2.5 md:hidden">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-xs font-medium transition ${
              isActive ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
