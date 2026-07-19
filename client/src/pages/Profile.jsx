import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  Phone,
  Cake,
  User,
  Camera,
  Stethoscope,
  CalendarClock,
  LogOut,
  Pencil,
  Check,
  HelpCircle,
} from 'lucide-react'
import TopBar from '../components/TopBar'
import PillButton from '../components/PillButton'
import { useAuth } from '../context/AuthContext'
import { roleLabel } from '../lib/roles'

export default function Profile() {
  const navigate = useNavigate()
  const { currentUser, logout, updateUser, showOnboarding } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    mobile: currentUser?.mobile || '',
  })
  // Locally-selected new profile picture (preview URL + File), pending save.
  const [photo, setPhoto] = useState(null)
  const fileRef = useRef(null)

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const pickPhoto = (file) => {
    if (file) setPhoto({ url: URL.createObjectURL(file), file })
  }

  const handleSave = async () => {
    try {
      await updateUser({ ...form, avatarFile: photo?.file })
    } catch {
      // Keep editing open if the save fails.
      return
    }
    setPhoto(null)
    setEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar title="Profile" />

      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-2 no-scrollbar md:px-8">
        <div className="glass-card flex flex-col items-center px-6 py-7">
          <button
            type="button"
            onClick={() => editing && fileRef.current?.click()}
            className={`relative h-24 w-24 rounded-full ring-4 ring-brand/30 ${
              editing ? 'cursor-pointer' : 'cursor-default'
            }`}
            aria-label={editing ? 'Change profile picture' : undefined}
          >
            <img
              src={photo?.url || currentUser?.avatar}
              alt={currentUser?.name}
              className="h-24 w-24 rounded-full object-cover"
            />
            {editing && (
              <span className="absolute inset-0 grid place-items-center rounded-full bg-ink/40">
                <Camera size={22} className="text-white" />
              </span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => pickPhoto(e.target.files?.[0])}
          />
          <h2 className="mt-3 text-xl font-bold text-ink">{currentUser?.name}</h2>
          <p className="text-sm text-brand-dark">{roleLabel(currentUser?.role)} · proNose</p>
        </div>

        <div className="mt-6">
        <div className="md:grid md:grid-cols-2 md:gap-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">Personal details</h3>
              <button
                onClick={() => (editing ? handleSave() : setEditing(true))}
                className="flex items-center gap-1 text-sm font-semibold text-brand-dark"
              >
                {editing ? <Check size={16} /> : <Pencil size={14} />}
                {editing ? 'Save' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-3">
              <Field icon={User} label="Name" name="name" value={form.name} editing={editing} onChange={update} />
              <Field icon={Mail} label="Email" name="email" value={form.email} editing={editing} onChange={update} />
              <Field icon={Phone} label="Mobile" name="mobile" value={form.mobile} editing={editing} onChange={update} />
              <Field icon={Cake} label="Date of Birth" value={currentUser?.dob} editing={false} />
            </div>
          </div>

          {currentUser?.role === 'patient' && (
          <div className="mt-7 md:mt-0">
            <h3 className="mb-3 text-base font-bold text-ink">Care details</h3>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-card backdrop-blur">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.doctor?.avatar}
              alt={currentUser?.doctor?.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white/70"
            />
            <div>
              <p className="font-semibold text-ink">{currentUser?.doctor?.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted">
                <Stethoscope size={13} /> {currentUser?.doctor?.specialty}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-brand/10 px-4 py-3">
            <CalendarClock size={20} className="text-brand-dark" />
            <div>
              <p className="text-xs text-muted">Prosthetic installed</p>
              <p className="text-sm font-semibold text-ink">
                {currentUser?.prostheticInstallDate}
              </p>
            </div>
            </div>
          </div>
          </div>
          )}
        </div>
        </div>

        <button
          onClick={showOnboarding}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-medium text-muted transition hover:text-brand-dark"
        >
          <HelpCircle size={16} /> Replay tutorial
        </button>

        <div className="mt-4 flex flex-col items-center gap-3">
          <PillButton variant="outline" onClick={handleLogout} className="w-full max-w-xs">
            <LogOut size={18} /> Log Out
          </PillButton>
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, name, value, editing, onChange }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-card backdrop-blur">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/15 text-brand-dark">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted">{label}</p>
        {editing && name ? (
          <input
            name={name}
            value={value}
            onChange={onChange}
            className="w-full rounded-lg bg-white/80 px-2 py-1 text-sm text-ink outline-none ring-1 ring-white/70 focus:ring-2 focus:ring-brand"
          />
        ) : (
          <p className="truncate text-sm font-semibold text-ink">{value}</p>
        )}
      </div>
    </div>
  )
}
