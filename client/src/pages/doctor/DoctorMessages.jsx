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
      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-5 no-scrollbar">
        <p className="text-sm text-gray-400">
          {currentUser?.name ? `${currentUser.name}, select` : 'Select'} a patient to open the
          conversation and reply.
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
              onClick={() => openChat(p)}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-brand/40"
            >
              <img src={p.avatar} alt={p.name} className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800">{p.name}</p>
                <p className="truncate text-sm text-gray-400">{p.email}</p>
              </div>
              <MessageCircle size={18} className="text-brand" />
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
