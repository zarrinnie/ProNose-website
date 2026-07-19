import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, ChevronRight } from 'lucide-react'
import TopBar from '../../components/TopBar'
import { useAuth } from '../../context/AuthContext'
import { listUsers } from '../../api/users'

// Doctor-facing messaging inbox: lists assigned patients and opens the shared
// Chat page (with peer state) so the doctor can read and reply to any thread.
export default function DoctorMessages() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [patients, setPatients] = useState([])

  useEffect(() => {
    listUsers().then(setPatients).catch(() => setPatients([]))
  }, [])

  const openChat = (p) =>
    navigate(`/chat/${p.id}`, {
      state: {
        peerId: p.id,
        peerName: p.name,
        peerAvatar: p.avatar,
        peerSubtitle: 'Patient',
      },
    })

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Messages" />
      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-2 no-scrollbar md:px-8">
        <p className="text-sm text-muted">
          {currentUser?.name ? `${currentUser.name}, select` : 'Select'} a patient to open the
          conversation and reply.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {patients.length === 0 && (
            <p className="glass-card px-4 py-5 text-center text-sm text-muted">
              No patients assigned to you yet.
            </p>
          )}
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => openChat(p)}
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
              <MessageCircle size={18} className="text-brand-dark" />
              <ChevronRight size={18} className="text-muted/60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
