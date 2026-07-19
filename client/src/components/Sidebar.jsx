import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { navTabs, roleLabel } from '../lib/roles'

// Desktop-only vertical navigation rail, transparent over the glass shell.
// Active item is a teal gradient pill like the reference mockup.
export default function Sidebar() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const tabs = navTabs(currentUser?.role)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/50 p-6 md:flex">
      <div className="flex items-center gap-2 px-1">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft">
          <Activity size={20} strokeWidth={2.5} />
        </span>
        <span className="text-xl font-extrabold text-ink">
          pro<span className="text-brand-dark">Nose</span>
        </span>
      </div>

      <nav className="mt-9 flex flex-col gap-1.5">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft'
                  : 'text-brand-dark/70 hover:bg-white/50 hover:text-brand-dark'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/60 pt-4">
        <div className="flex items-center gap-3 px-2">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white/70"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{currentUser?.name}</p>
            <p className="text-xs text-muted">{roleLabel(currentUser?.role)}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-brand-dark/70 transition hover:bg-red-50/70 hover:text-red-500"
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </aside>
  )
}
