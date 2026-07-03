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

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="My Patients" />
      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-5 no-scrollbar">
        <p className="text-sm text-gray-400">
          Welcome, {currentUser?.name}. Select a patient to review their consultations.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {patients.length === 0 && (
            <p className="rounded-2xl bg-gray-50 px-4 py-5 text-center text-sm text-gray-400">
              No patients assigned to you yet.
            </p>
          )}
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-brand/40"
            >
              <img src={p.avatar} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800">{p.name}</p>
                <p className="truncate text-sm text-gray-400">{p.email}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
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
      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-5 no-scrollbar">
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
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-dark"
        >
          <MessageCircle size={18} /> Message {patient.name.split(' ')[0]}
        </button>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {consultations.length === 0 && (
            <p className="rounded-2xl bg-gray-50 px-4 py-5 text-center text-sm text-gray-400">
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
                  <p className="text-sm text-gray-400">{c.date}</p>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                    reviewed ? 'bg-brand/15 text-brand-dark' : 'bg-amber-100 text-amber-600'
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
