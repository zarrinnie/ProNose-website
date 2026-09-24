import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Siren,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  MessageCircle,
} from 'lucide-react'
import TopBar from '../../components/TopBar'
import ConsultationReview from '../../components/ConsultationReview'
import { useAuth } from '../../context/AuthContext'
import { listUsers } from '../../api/users'
import { listConsultations } from '../../api/consultations'
import { prosthesisConfig } from '../../lib/prostheses'

export default function DoctorDashboard() {
  const { currentUser } = useAuth()
  const [patients, setPatients] = useState([])
  const [selected, setSelected] = useState(null) // selected patient

  useEffect(() => {
    listUsers().then(setPatients).catch(() => setPatients([]))
  }, [])

  if (selected) {
    return <PatientConsultations patient={selected} onBack={() => setSelected(null)} />
  }

  const firstName = currentUser?.name?.split(' ')[0] || 'Doctor'
  const prosthesisLabel = currentUser?.prosthesisType
    ? prosthesisConfig(currentUser.prosthesisType).label
    : null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar
        eyebrow={prosthesisLabel ? `${prosthesisLabel} care team · Welcome back, ${firstName} 👋` : `Welcome back, ${firstName} 👋`}
        title="My Patients"
      />
      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-2 no-scrollbar md:px-8">
        <p className="text-sm text-muted">Select a patient to review their consultations.</p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {patients.length === 0 && (
            <p className="glass-card px-4 py-5 text-center text-sm text-muted">
              No patients assigned to you yet.
            </p>
          )}
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="glass-card flex items-center gap-4 p-4 text-left transition hover:bg-white/90"
            >
              <img
                src={p.avatar}
                alt={p.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white/70"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{p.name}</p>
                <p className="truncate text-sm text-muted">{p.email}</p>
              </div>
              <ChevronRight size={18} className="text-muted/60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PatientConsultations({ patient, onBack }) {
  const navigate = useNavigate()
  const [consultations, setConsultations] = useState([])
  const [active, setActive] = useState(null)

  const load = useCallback(() => {
    listConsultations(patient.id).then(setConsultations).catch(() => setConsultations([]))
  }, [patient.id])

  useEffect(() => {
    load()
  }, [load])

  if (active) {
    return (
      <ConsultationReview
        consultation={active}
        personName={patient.name}
        personAvatar={patient.avatar}
        onBack={() => setActive(null)}
        onSaved={(updated) => {
          setConsultations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
          setActive(null)
        }}
      />
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title={patient.name} showBack onBack={onBack} />
      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-2 no-scrollbar md:px-8">
        <button
          onClick={() =>
            navigate(`/chat/${patient.id}`, {
              state: {
                peerId: patient.id,
                peerName: patient.name,
                peerAvatar: patient.avatar,
                peerSubtitle: 'Patient',
              },
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand to-brand-dark px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:from-brand-dark hover:to-brand-deep"
        >
          <MessageCircle size={18} /> Message {patient.name.split(' ')[0]}
        </button>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {consultations.length === 0 && (
            <p className="glass-card px-4 py-5 text-center text-sm text-muted">
              No consultations submitted yet.
            </p>
          )}
          {consultations.map((c) => {
            const reviewed = c.status === 'reviewed'
            const isEmergency = c.type === 'emergency'
            return (
              <button
                key={c.id}
                onClick={() => setActive(c)}
                className="glass-card flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/90"
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
                  <p className="text-sm text-muted">{c.date}</p>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    reviewed ? 'bg-brand/15 text-brand-dark' : 'bg-pastel-peach/30 text-amber-600'
                  }`}
                >
                  {reviewed ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                  {reviewed ? 'Reviewed' : 'Pending'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
