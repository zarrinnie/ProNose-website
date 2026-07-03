import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { navTabs, roleLabel } from '../lib/roles'

// Desktop-only vertical navigation rail.
export default function Sidebar() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const tabs = navTabs(currentUser?.role)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-100 bg-white p-5 md:flex">
      <div className="flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
          <Activity size={20} strokeWidth={2.5} />
        </span>
        <span className="text-xl font-extrabold text-gray-800">
          pro<span className="text-brand">Nose</span>
        </span>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
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

      <div className="mt-auto border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3 px-2">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-brand/30"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-700">{currentUser?.name}</p>
            <p className="text-xs text-gray-400">{roleLabel(currentUser?.role)}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </aside>
  )
}
