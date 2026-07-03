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

      <TopBar title="Dashboard" />

      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-5 no-scrollbar">
        {/* Greeting */}
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatar}
            alt="Your profile"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-brand/40"
          />
          <div>
            <p className="text-sm text-gray-400">Welcome back,</p>
            <h2 className="text-xl font-bold text-gray-800">Hello, {firstName}!</h2>
          </div>
        </div>

        {toast && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-brand/10 px-4 py-3 text-sm font-medium text-brand-dark animate-fade-in">
            <CheckCircle2 size={18} />
            Consultation submitted{toast.urgent ? ' as urgent' : ''}. Your doctor will review it soon.
          </div>
        )}

        {/* New consultation CTA */}
        <button
          onClick={() => navigate('/consultation')}
          className="mt-6 flex w-full items-center justify-between rounded-3xl bg-brand px-6 py-5 text-left text-white shadow-soft transition hover:bg-brand-dark"
        >
          <div>
            <p className="text-lg font-bold">New Consultation</p>
            <p className="text-sm text-white/80">Submit your weekly check-in</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-white/20">
            <Plus size={24} />
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
    <div className="mt-7">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className="text-brand" />
        <h3 className="text-base font-bold text-gray-700">{title}</h3>
        <span className="ml-auto text-xs font-semibold text-gray-400">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl bg-gray-50 px-4 py-5 text-center text-sm text-gray-400">
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
      className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-brand/40"
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
          isEmergency ? 'bg-red-50 text-red-500' : 'bg-brand/10 text-brand'
        }`}
      >
        {isEmergency ? <Siren size={22} /> : <CalendarCheck size={22} />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-800">
          {isEmergency ? 'Urgent Check-in' : 'Weekly Check-in'}
        </p>
        <p className="text-sm text-gray-400">{consultation.date}</p>
      </div>

      <span
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
          reviewed ? 'bg-brand/15 text-brand-dark' : 'bg-amber-100 text-amber-600'
        }`}
      >
        {reviewed ? <CheckCircle2 size={13} /> : <Clock size={13} />}
        {reviewed ? 'Reviewed' : 'Pending'}
      </span>
      <ChevronRight size={18} className="text-gray-300" />
    </button>
  )
}
