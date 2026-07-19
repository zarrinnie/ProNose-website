import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import {
  Users,
  Stethoscope,
  ShieldCheck,
  Trash2,
  Pencil,
  Camera,
  X,
  ClipboardList,
  MessageSquare,
  Siren,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react'
import TopBar from '../../components/TopBar'
import PillButton from '../../components/PillButton'
import ConsultationReview from '../../components/ConsultationReview'
import { useAuth } from '../../context/AuthContext'
import { listUsers, updateUser, deleteUser } from '../../api/users'
import { listAllConsultations } from '../../api/consultations'
import { listAllMessages, deleteMessage, deleteConversation } from '../../api/messages'

const TABS = [
  { key: 'users', label: 'Users', icon: Users },
  { key: 'consultations', label: 'Consultations', icon: ClipboardList },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('users')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Admin Console" />

      <div className="border-b border-white/50 px-6 md:px-8">
        <div className="mx-auto flex w-full max-w-5xl gap-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                tab === key
                  ? 'border-brand-dark text-brand-dark'
                  : 'border-transparent text-muted hover:text-brand-dark'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 overflow-y-auto px-6 pb-6 pt-5 no-scrollbar md:px-8">
        {tab === 'users' && <UsersTab />}
        {tab === 'consultations' && <ConsultationsTab />}
        {tab === 'messages' && <MessagesTab />}
      </div>
    </div>
  )
}

/* ---------------- Users ---------------- */

const ROLES = ['patient', 'doctor', 'super_admin']

function UsersTab() {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [editUser, setEditUser] = useState(null)

  const load = useCallback(() => {
    listUsers().then(setUsers).catch(() => setUsers([]))
  }, [])
  useEffect(() => {
    load()
  }, [load])

  const doctors = useMemo(() => users.filter((u) => u.role === 'doctor'), [users])
  const counts = useMemo(
    () => ({
      patient: users.filter((u) => u.role === 'patient').length,
      doctor: doctors.length,
      super_admin: users.filter((u) => u.role === 'super_admin').length,
    }),
    [users, doctors],
  )

  const changeRole = async (user, role) => {
    setBusyId(user.id)
    try {
      await updateUser(user.id, { role })
      load()
    } finally {
      setBusyId(null)
    }
  }

  const changeDoctor = async (user, doctorId) => {
    setBusyId(user.id)
    try {
      await updateUser(user.id, { assigned_doctor_id: doctorId ? Number(doctorId) : null })
      load()
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (user) => {
    setBusyId(user.id)
    try {
      await deleteUser(user.id)
      setConfirmId(null)
      load()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Users} label="Patients" value={counts.patient} chip="bg-pastel-lavender" />
        <StatCard icon={Stethoscope} label="Doctors" value={counts.doctor} chip="bg-pastel-pink" />
        <StatCard icon={ShieldCheck} label="Admins" value={counts.super_admin} chip="bg-pastel-peach" />
      </div>

      <div className="glass-card mt-6 overflow-hidden">
        <div className="stat-label hidden grid-cols-[1.4fr_1fr_1.2fr_auto] gap-4 border-b border-white/60 px-5 py-3.5 md:grid">
          <span>User</span>
          <span>Role</span>
          <span>Assigned doctor</span>
          <span>Actions</span>
        </div>
        {users.map((u) => {
          const isSelf = u.id === currentUser?.id
          return (
            <div
              key={u.id}
              className="grid grid-cols-1 gap-3 border-b border-white/50 px-5 py-4 last:border-0 md:grid-cols-[1.4fr_1fr_1.2fr_auto] md:items-center"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white/70"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{u.name}</p>
                  <p className="truncate text-xs text-muted">{u.email}</p>
                </div>
              </div>

              <select
                value={u.role}
                disabled={busyId === u.id}
                onChange={(e) => changeRole(u, e.target.value)}
                className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm font-medium text-ink outline-none focus:ring-2 focus:ring-brand"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {u.role === 'patient' ? (
                <select
                  value={u.assignedDoctorId || ''}
                  disabled={busyId === u.id}
                  onChange={(e) => changeDoctor(u, e.target.value)}
                  className="rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm font-medium text-ink outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="">— Unassigned —</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-muted/60">—</span>
              )}

              <div className="flex justify-end gap-1">
                {confirmId === u.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => remove(u)}
                      disabled={busyId === u.id}
                      className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="rounded-lg bg-white/70 px-3 py-1.5 text-xs font-semibold text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setEditUser(u)}
                      title="Edit user info & picture"
                      className="grid h-9 w-9 place-items-center rounded-lg text-muted transition hover:bg-white/70 hover:text-brand-dark"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmId(u.id)}
                      disabled={isSelf}
                      title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
                      className="grid h-9 w-9 place-items-center rounded-lg text-red-400 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={() => {
            setEditUser(null)
            load()
          }}
        />
      )}
    </>
  )
}

// Admin modal: edit any user's name / email / mobile and upload a new picture.
function EditUserModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, mobile: user.mobile })
  const [photo, setPhoto] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  const pickPhoto = (file) => {
    if (file) setPhoto({ url: URL.createObjectURL(file), file })
  }

  const save = async () => {
    setError('')
    setSaving(true)
    try {
      await updateUser(
        user.id,
        { full_name: form.name, email: form.email, mobile_number: form.mobile },
        photo?.file,
      )
      onSaved()
    } catch (err) {
      setError(err.message || 'Could not save.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fade-in rounded-3xl border border-white/60 bg-white/90 p-6 shadow-shell backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Edit user</h3>
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative h-20 w-20 rounded-full ring-2 ring-brand/30"
            aria-label="Change profile picture"
          >
            <img
              src={photo?.url || user.avatar}
              alt={user.name}
              className="h-20 w-20 rounded-full object-cover"
            />
            <span className="absolute inset-0 grid place-items-center rounded-full bg-black/40">
              <Camera size={18} className="text-white" />
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pickPhoto(e.target.files?.[0])}
          />
          <p className="mt-2 text-xs text-muted">Tap the photo to change it</p>
        </div>

        <div className="mt-5 space-y-3">
          <ModalField label="Name" name="name" value={form.name} onChange={set} />
          <ModalField label="Email" name="email" value={form.email} onChange={set} />
          <ModalField label="Mobile" name="mobile" value={form.mobile} onChange={set} />
        </div>

        {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}

        <div className="mt-6 flex gap-3">
          <PillButton variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </PillButton>
          <PillButton onClick={save} disabled={saving} className="flex-1">
            {saving ? 'Saving…' : 'Save'}
          </PillButton>
        </div>
      </div>
    </div>
  )
}

function ModalField({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-white/60 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-brand"
      />
    </label>
  )
}

/* ---------------- Consultations ---------------- */

function ConsultationsTab() {
  const [items, setItems] = useState([])
  const [active, setActive] = useState(null)

  const load = useCallback(() => {
    listAllConsultations().then(setItems).catch(() => setItems([]))
  }, [])
  useEffect(() => {
    load()
  }, [load])

  if (active) {
    return (
      <ConsultationReview
        consultation={active}
        personName={active.patientName || 'Patient'}
        personAvatar={active.patientAvatar}
        onBack={() => setActive(null)}
        onSaved={(updated) => {
          setItems((prev) =>
            prev.map((c) => (c.id === updated.id ? { ...updated, patientName: c.patientName, patientAvatar: c.patientAvatar } : c)),
          )
          setActive(null)
        }}
        onDeleted={(id) => {
          setItems((prev) => prev.filter((c) => c.id !== id))
          setActive(null)
        }}
      />
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.length === 0 && (
        <p className="glass-card px-4 py-5 text-center text-sm text-muted">
          No consultations in the system.
        </p>
      )}
      {items.map((c) => {
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
              <p className="truncate font-semibold text-ink">{c.patientName || 'Unknown'}</p>
              <p className="text-sm text-muted">
                {isEmergency ? 'Urgent' : 'Weekly'} · {c.date}
              </p>
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
  )
}

/* ---------------- Messages ---------------- */

function MessagesTab() {
  const [messages, setMessages] = useState([])
  const [openKey, setOpenKey] = useState(null)

  const load = useCallback(() => {
    listAllMessages().then(setMessages).catch(() => setMessages([]))
  }, [])
  useEffect(() => {
    load()
  }, [load])

  // Group messages into conversations keyed by the sorted participant pair.
  const conversations = useMemo(() => {
    const map = new Map()
    for (const m of messages) {
      const [lo, hi] = [m.senderId, m.receiverId].sort((a, b) => a - b)
      const key = `${lo}-${hi}`
      if (!map.has(key)) {
        const nameFor = (id) => (m.senderId === id ? m.senderName : m.receiverName)
        map.set(key, {
          key,
          a: lo,
          b: hi,
          aName: nameFor(lo) || `User ${lo}`,
          bName: nameFor(hi) || `User ${hi}`,
          messages: [],
        })
      }
      const conv = map.get(key)
      // Backfill names if a later message reveals them.
      if (m.senderId === conv.a) conv.aName = m.senderName || conv.aName
      if (m.senderId === conv.b) conv.bName = m.senderName || conv.bName
      if (m.receiverId === conv.a) conv.aName = m.receiverName || conv.aName
      if (m.receiverId === conv.b) conv.bName = m.receiverName || conv.bName
      conv.messages.push(m)
    }
    return [...map.values()]
  }, [messages])

  const open = conversations.find((c) => c.key === openKey)

  const removeMessage = async (id) => {
    await deleteMessage(id)
    load()
  }
  const removeConversation = async (conv) => {
    await deleteConversation(conv.a, conv.b)
    setOpenKey(null)
    load()
  }

  if (open) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <button onClick={() => setOpenKey(null)} className="text-sm font-semibold text-brand-dark">
            ← All conversations
          </button>
          <button
            onClick={() => removeConversation(open)}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} /> Delete conversation
          </button>
        </div>
        <p className="mt-3 text-base font-bold text-ink">
          {open.aName} ↔ {open.bName}
        </p>

        <div className="mt-4 space-y-3">
          {open.messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.senderId === open.a ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`group max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  m.senderId === open.a
                    ? 'border border-white/70 bg-white/80 text-ink backdrop-blur'
                    : 'bg-gradient-to-br from-brand to-brand-dark text-white'
                }`}
              >
                <p className="text-[10px] font-semibold opacity-70">{m.senderName}</p>
                <p className="leading-relaxed">{m.text}</p>
                <div className="mt-1 flex items-center justify-end gap-2">
                  <span className={`text-[10px] ${m.senderId === open.a ? 'text-muted' : 'text-white/70'}`}>
                    {m.time}
                  </span>
                  <button
                    onClick={() => removeMessage(m.id)}
                    title="Delete message"
                    className={`opacity-60 transition hover:opacity-100 ${
                      m.senderId === open.a ? 'text-red-400' : 'text-white'
                    }`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {conversations.length === 0 && (
        <p className="glass-card px-4 py-5 text-center text-sm text-muted">
          No conversations in the system.
        </p>
      )}
      {conversations.map((c) => {
        const last = c.messages[c.messages.length - 1]
        return (
          <button
            key={c.key}
            onClick={() => setOpenKey(c.key)}
            className="glass-card flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/90"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pastel-blue text-white">
              <MessageSquare size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">
                {c.aName} ↔ {c.bName}
              </p>
              <p className="truncate text-sm text-muted">{last?.text}</p>
            </div>
            <span className="text-xs font-semibold text-muted">{c.messages.length}</span>
            <ChevronRight size={18} className="text-muted/60" />
          </button>
        )
      })}
    </div>
  )
}

/* ---------------- Shared ---------------- */

function StatCard({ icon: Icon, label, value, chip = 'bg-pastel-lavender' }) {
  return (
    <div className="glass-card flex items-center gap-3 p-4 md:p-5">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-white ${chip}`}>
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="stat-label truncate">{label}</p>
        <p className="text-2xl font-bold text-ink">{value}</p>
      </div>
    </div>
  )
}
