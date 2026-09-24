import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock } from 'lucide-react'
import TextField from '../../components/TextField'
import PillButton from '../../components/PillButton'
import { useAuth } from '../../context/AuthContext'

// Standalone, unlinked admin entry (reached by typing /admin). Deliberately
// separate from the public patient/doctor auth and not prosthesis-themed.
export default function AdminLogin() {
  const navigate = useNavigate()
  const { login, logout, isAuthenticated, currentUser, setSelectedProsthesis } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Keep the admin screens on the neutral default theme, clearing any leftover
  // prosthesis choice from a previous patient session. Also skip the login form
  // if an admin is already signed in.
  useEffect(() => {
    setSelectedProsthesis(null)
    if (isAuthenticated && currentUser?.role === 'super_admin') {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, currentUser, navigate, setSelectedProsthesis])

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login({ email: form.email, password: form.password })
      if (user.role !== 'super_admin') {
        logout()
        setError('This account is not an administrator.')
        return
      }
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to log in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="glass-card overflow-hidden">
          <div className="flex flex-col items-center bg-gradient-to-br from-brand to-brand-dark px-6 py-8 text-center text-white">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur">
              <ShieldCheck size={28} strokeWidth={2.2} />
            </span>
            <h1 className="mt-3 text-xl font-bold">Admin Console</h1>
            <p className="mt-1 text-sm text-white/85">Restricted access — administrators only.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-7 py-7">
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="admin@pronose.com"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={update}
              placeholder="••••••••••••"
            />

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <PillButton type="submit" className="w-full" disabled={submitting}>
              <Lock size={16} /> {submitting ? 'Signing in…' : 'Sign In'}
            </PillButton>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Not an administrator?{' '}
          <button
            onClick={() => navigate('/')}
            className="font-semibold text-brand-dark hover:text-brand-deep"
          >
            Return to proNose
          </button>
        </p>
      </div>
    </div>
  )
}
