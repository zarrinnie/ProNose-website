import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Page header in the glass style: optional teal eyebrow line ("Welcome back…"),
// big bold navy title, frosted back button, and the signed-in user chip on the
// right (desktop only) — mirroring the reference mockup's top row.
export default function TopBar({ title, eyebrow, showBack = false, onBack }) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const handleBack = onBack || (() => navigate(-1))

  return (
    <div className="flex items-center gap-4 px-6 pb-3 pt-6 md:px-8">
      {showBack && (
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/60 bg-white/60 text-brand-dark shadow-card backdrop-blur transition hover:bg-white/90"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
      )}

      <div className="min-w-0 flex-1">
        {eyebrow && <p className="text-sm font-semibold text-brand-dark">{eyebrow}</p>}
        <h1 className="truncate text-2xl font-bold text-ink md:text-3xl">{title}</h1>
      </div>

      {currentUser && (
        <div className="hidden shrink-0 items-center gap-2.5 md:flex">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white/70"
          />
          <span className="text-sm font-semibold text-ink">{currentUser.name}</span>
        </div>
      )}
    </div>
  )
}
