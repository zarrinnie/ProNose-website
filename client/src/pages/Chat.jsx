import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Send } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { listMessages, sendMessage } from '../api/messages'
import { listUsers } from '../api/users'

const POLL_MS = 4000

export default function Chat() {
  const { currentUser } = useAuth()
  const location = useLocation()
  const { peerId: peerIdParam } = useParams()

  // Resolve the conversation partner. The peer id comes from the URL first
  // (stable across refresh/re-render) — a doctor opens /chat/:patientId — then
  // falls back to the patient's assigned doctor.
  const peerId = peerIdParam ? Number(peerIdParam) : currentUser?.assignedDoctorId ?? null

  // Display info (name/avatar) for the header. Prefer route state (fast path when
  // navigating in-app), then a looked-up patient (below), then the patient's own
  // doctor, then a neutral fallback so the composer still renders.
  const [peerLookup, setPeerLookup] = useState(null)
  const peer = location.state?.peerId
    ? {
        id: location.state.peerId,
        name: location.state.peerName || 'Patient',
        avatar: location.state.peerAvatar,
        subtitle: location.state.peerSubtitle || 'Patient',
      }
    : peerLookup
      ? peerLookup
      : !peerIdParam && currentUser?.doctor
        ? {
            id: currentUser.doctor.id,
            name: currentUser.doctor.name,
            avatar: currentUser.doctor.avatar,
            subtitle: currentUser.doctor.specialty,
          }
        : peerId
          ? { id: peerId, name: 'Patient', avatar: undefined, subtitle: 'Patient' }
          : null

  // If we arrived by URL (e.g. refresh / direct link) without route state, look
  // the peer up so the header shows their real name. Doctors can list their
  // assigned patients; that includes the peer.
  useEffect(() => {
    if (!peerIdParam || location.state?.peerId || currentUser?.role !== 'doctor') return
    let active = true
    listUsers()
      .then((users) => {
        if (!active) return
        const p = users.find((u) => u.id === Number(peerIdParam))
        if (p) setPeerLookup({ id: p.id, name: p.name, avatar: p.avatar, subtitle: 'Patient' })
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [peerIdParam, location.state?.peerId, currentUser?.role])

  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  const load = useCallback(async () => {
    if (!currentUser || !peerId) return
    try {
      setMessages(await listMessages(currentUser.id, peerId))
    } catch {
      /* keep showing whatever we have */
    }
  }, [currentUser, peerId])

  // Initial load + lightweight polling for "real-time" feel.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
    const t = setInterval(load, POLL_MS)
    return () => clearInterval(t)
  }, [load])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !peerId) return
    setDraft('')
    try {
      const msg = await sendMessage({ receiverId: peerId, body: text })
      setMessages((prev) => [...prev, msg])
    } catch {
      setDraft(text) // restore so the user can retry
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="bg-brand">
        <TopBar title="Chat" showBack rounded={false} />
        <div className="flex items-center gap-3 rounded-b-[2rem] bg-brand px-6 pb-4">
          {peer?.avatar && (
            <img
              src={peer.avatar}
              alt={peer.name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white/60"
            />
          )}
          <div className="text-white">
            <p className="font-semibold leading-tight">{peer?.name || 'No conversation'}</p>
            <p className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-green-300" /> Online · {peer?.subtitle || ''}
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gray-50 px-4 py-5 no-scrollbar">
        <div className="mx-auto w-full max-w-3xl space-y-3">
          {!peerId ? (
            <p className="mt-10 text-center text-sm text-gray-400">
              No care team assigned yet. Your doctor will appear here once you're matched.
            </p>
          ) : (
            messages.map((m) => <Bubble key={m.id} message={m} mine={m.senderId === currentUser.id} />)
          )}
        </div>
      </div>

      <form
        onSubmit={send}
        className="mx-auto flex w-full max-w-3xl items-center gap-2 border-t border-gray-100 bg-white px-4 py-3"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          disabled={!peerId}
          className="flex-1 rounded-full bg-input px-5 py-3 text-gray-700 placeholder:text-brand/60 outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!peerId}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-white shadow-soft transition hover:bg-brand-dark active:scale-95 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}

function Bubble({ message, mine }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
          mine ? 'rounded-br-md bg-brand text-white' : 'rounded-bl-md bg-white text-gray-700'
        }`}
      >
        <p className="leading-relaxed">{message.text}</p>
        <p className={`mt-1 text-right text-[10px] ${mine ? 'text-white/70' : 'text-gray-400'}`}>
          {message.time}
        </p>
      </div>
    </div>
  )
}
