import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import PillButton from './PillButton'

const links = ['Features', 'Pricing', 'Support']

// Full-width public navbar shown on the auth pages.
export default function Navbar() {
  return (
    <header className="w-full bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/login" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
            <Activity size={20} strokeWidth={2.5} />
          </span>
          <span className="text-xl font-extrabold text-gray-800">
            pro<span className="text-brand">Nose</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm font-medium text-gray-500 transition hover:text-brand"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm font-semibold text-gray-600 transition hover:text-brand sm:block"
          >
            Log In
          </Link>
          <Link to="/signup">
            <PillButton className="!px-6 !py-2.5 text-sm">Sign Up</PillButton>
          </Link>
        </div>
      </nav>
    </header>
  )
}
