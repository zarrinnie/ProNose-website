import { Link } from 'react-router-dom'
import { Activity } from 'lucide-react'
import PillButton from './PillButton'

const links = ['Features', 'Pricing', 'Support']

// Full-width public navbar shown on the auth pages.
export default function Navbar() {
  return (
    <header className="w-full border-b border-white/50 bg-white/40 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/login" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft">
            <Activity size={20} strokeWidth={2.5} />
          </span>
          <span className="text-xl font-extrabold text-ink">
            pro<span className="text-brand-dark">Nose</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm font-medium text-muted transition hover:text-brand-dark"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm font-semibold text-brand-dark transition hover:text-brand-deep sm:block"
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
