import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { homeForRole } from '../lib/roles'
import { ALL_PROSTHESES } from '../lib/prostheses'

// Public front door. The patient picks which prosthesis they're being cared
// for; that choice themes the app and is carried into registration. Already
// authenticated users are sent straight to their home.
export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated, currentUser, setSelectedProsthesis } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate(homeForRole(currentUser.role), { replace: true })
  }, [isAuthenticated, currentUser, navigate])

  const choose = (slug) => {
    setSelectedProsthesis(slug)
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Slim brand header */}
      <header className="w-full border-b border-white/50 bg-white/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft">
              <Activity size={20} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold text-ink">
              pro<span className="text-brand-dark">Nose</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-brand-dark transition hover:text-brand-deep"
          >
            Log In
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:py-14">
        <div className="text-center">
          <p className="stat-label">Prosthetic rehabilitation, connected</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            Which prosthesis are you being cared for?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted">
            Choose your prosthesis type to get started. We&apos;ll tailor your care guides and
            check-ins — and you can message your care team along the way.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {ALL_PROSTHESES.map((p) => (
            <ProsthesisCard key={p.slug} prosthesis={p} onChoose={choose} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-brand-dark hover:text-brand-deep"
          >
            Log in
          </button>
        </p>
      </main>
    </div>
  )
}

function ProsthesisCard({ prosthesis, onChoose }) {
  const { label, tagline, icon: Icon, swatch, status } = prosthesis
  const live = status === 'live'
  const [from, to] = swatch

  return (
    <button
      type="button"
      disabled={!live}
      onClick={() => live && onChoose(prosthesis.slug)}
      className={`glass-card group relative flex items-center gap-4 p-5 text-left transition ${
        live ? 'hover:bg-white/90' : 'cursor-not-allowed opacity-60'
      }`}
    >
      <span
        className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-soft"
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <Icon size={26} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-ink">{label}</p>
          {!live && (
            <span className="rounded-full bg-muted/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
              Coming soon
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted">{tagline}</p>
      </div>

      {live && (
        <ArrowRight
          size={18}
          className="shrink-0 text-muted/60 transition group-hover:translate-x-0.5 group-hover:text-brand-dark"
        />
      )}
    </button>
  )
}
