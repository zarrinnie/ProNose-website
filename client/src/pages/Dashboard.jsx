import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Plus, CalendarCheck, Siren, CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import TopBar from '../components/TopBar'
import OnboardingTutorial from '../components/OnboardingTutorial'
import { useAuth } from '../context/AuthContext'
import { homeForRole } from '../lib/roles'

export default function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, consultations, isFirstLogin, dismissOnboarding } = useAuth()
  const [toast, setToast] = useState(location.state?.submitted ? location.state : null)

  // Clear the one-time success banner after a few seconds.
  useEffect(() => {
    if (!toast) return
    navigate(location.pathname, { replace: true, state: {} })
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The patient dashboard is the shared default route; send staff to theirs.
  if (currentUser && currentUser.role !== 'patient') {
    return <Navigate to={homeForRole(currentUser.role)} replace />
  }

  const weekly = consultations.filter((c) => c.type === 'regular')
  const emergency = consultations.filter((c) => c.type === 'emergency')
  const firstName = currentUser?.name?.split(' ')[0] || 'there'

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isFirstLogin && <OnboardingTutorial onClose={dismissOnboarding} />}

      <TopBar eyebrow={`Welcome back, ${firstName} 👋`} title="Dashboard" />

      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-2 no-scrollbar md:px-8">
        {toast && (
          <div className="glass-card mb-5 flex items-center gap-2 px-4 py-3 text-sm font-medium text-brand-dark animate-fade-in">
            <CheckCircle2 size={18} />
            Consultation submitted{toast.urgent ? ' as urgent' : ''}. Your doctor will review it soon.
          </div>
        )}

        {/* New consultation CTA — deep teal gradient banner */}
        <button
          onClick={() => navigate('/consultation')}
          className="relative flex w-full items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark to-brand-deep px-7 py-6 text-left text-white shadow-soft transition hover:from-brand-deep hover:to-brand-deep"
        >
          <span className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Weekly check-in
            </p>
            <p className="mt-1 text-2xl font-bold">New Consultation</p>
            <span className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-bold text-brand-dark">
              Start check-in
            </span>
          </div>
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20">
            <Plus size={26} />
          </span>
        </button>

        <Section
          title="Emergency / Urgent"
          icon={Siren}
          items={emergency}
          empty="No urgent consultations."
        />
        <Section
          title="Regular Weekly"
          icon={CalendarCheck}
          items={weekly}
          empty="No weekly consultations yet."
        />
      </div>
    </div>
  )
}

function Section({ title, icon: Icon, items, empty }) {
  return (
    <div className="glass-card mt-6 p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={18} className="text-brand-dark" />
        <h3 className="text-base font-bold text-ink">{title}</h3>
        <span className="teal-link ml-auto">{items.length} total</span>
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl bg-white/50 px-4 py-5 text-center text-sm text-muted">
          {empty}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((c) => (
            <ConsultationCard key={c.id} consultation={c} />
          ))}
        </div>
      )}
    </div>
  )
}

function ConsultationCard({ consultation }) {
  const navigate = useNavigate()
  const reviewed = consultation.status === 'reviewed'
  const isEmergency = consultation.type === 'emergency'

  return (
    <button
      onClick={() => navigate(`/consultation`, { state: { viewId: consultation.id } })}
      className="flex w-full items-center gap-4 rounded-2xl border border-white/70 bg-white/70 p-4 text-left shadow-sm transition hover:bg-white/95"
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-white ${
          isEmergency ? 'bg-pastel-pink' : 'bg-pastel-lavender'
        }`}
      >
        {isEmergency ? <Siren size={22} /> : <CalendarCheck size={22} />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">
          {isEmergency ? 'Urgent Check-in' : 'Weekly Check-in'}
        </p>
        <p className="text-sm text-muted">{consultation.date}</p>
      </div>

      <span
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
          reviewed ? 'bg-brand/15 text-brand-dark' : 'bg-pastel-peach/30 text-amber-600'
        }`}
      >
        {reviewed ? <CheckCircle2 size={13} /> : <Clock size={13} />}
        {reviewed ? 'Reviewed' : 'Pending'}
      </span>
      <ChevronRight size={18} className="text-muted/60" />
    </button>
  )
}
