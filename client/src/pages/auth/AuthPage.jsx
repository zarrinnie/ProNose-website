import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'
import TextField from '../../components/TextField'
import PillButton from '../../components/PillButton'
import SocialLogins from '../../components/SocialLogins'
import { useAuth } from '../../context/AuthContext'
import { homeForRole } from '../../lib/roles'
import { prosthesisConfig } from '../../lib/prostheses'

// Tabbed auth card. `initialTab` comes from the route so tabs stay URL-synced.
export default function AuthPage({ initialTab = 'login' }) {
  const navigate = useNavigate()
  const { selectedProsthesis } = useAuth()
  const isLogin = initialTab === 'login'
  const prosthesis = selectedProsthesis ? prosthesisConfig(selectedProsthesis) : null

  return (
    <AuthLayout>
      {/* Brand header strip (themed to the chosen prosthesis) */}
      <div className="bg-brand px-6 py-5 text-center md:rounded-tr-3xl">
        <h1 className="text-xl font-bold text-white">{isLogin ? 'Welcome Back' : 'New Account'}</h1>
        {prosthesis && (
          <p className="mt-1 text-sm font-medium text-white/85">{prosthesis.label} care</p>
        )}
      </div>

      {/* Let the user go back and pick a different prosthesis. */}
      <button
        onClick={() => navigate('/')}
        className="px-6 pt-3 text-left text-xs font-semibold text-brand-dark transition hover:text-brand-deep"
      >
        ← Change prosthesis
      </button>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <Tab active={isLogin} onClick={() => navigate('/login')}>
          Log In
        </Tab>
        <Tab active={!isLogin} onClick={() => navigate('/signup')}>
          Create Account
        </Tab>
      </div>

      <div className="px-7 py-7">
        {isLogin ? <LoginForm /> : <SignUpForm />}
      </div>
    </AuthLayout>
  )
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 border-b-2 px-4 py-4 text-center text-base font-semibold transition ${
        active ? 'border-brand text-brand' : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      {children}
    </button>
  )
}

/* ---------------- Log In ---------------- */

function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login({ email: form.email, password: form.password })
      navigate(homeForRole(user.role))
    } catch (err) {
      setError(err.message || 'Unable to log in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <TextField
        label="Email or Mobile Number"
        name="email"
        value={form.email}
        onChange={update}
        placeholder="example@example.com"
      />
      <div>
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={update}
          placeholder="••••••••••••"
        />
        <Link to="/set-password" className="mt-2 block text-right text-sm font-medium text-brand">
          Forget Password
        </Link>
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <PillButton type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Logging in…' : 'Log In'}
      </PillButton>

      <SocialLogins />

      <p className="text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={() => navigate('/signup')} className="font-semibold text-brand">
          Sign Up
        </button>
      </p>
    </form>
  )
}

/* ---------------- Create Account ---------------- */

function SignUpForm() {
  const navigate = useNavigate()
  const { register, selectedProsthesis } = useAuth()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    dob: '',
    mobile: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      // Carry the prosthesis chosen on the landing page into the new account.
      const user = await register({ ...form, prosthesisType: selectedProsthesis || 'nose' })
      navigate(homeForRole(user.role))
    } catch (err) {
      setError(err.message || 'Unable to create account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={update}
            placeholder="Amelia Rose"
          />
        </div>

        <TextField
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={update}
          placeholder="example@example.com"
        />
        <TextField
          label="Date Of Birth"
          name="dob"
          value={form.dob}
          onChange={update}
          placeholder="DD / MM / YYYY"
        />

        <div className="md:col-span-2">
          <TextField
            label="Mobile Number"
            name="mobile"
            value={form.mobile}
            onChange={update}
            placeholder="+1 (415) 555-0142"
          />
        </div>

        <TextField
          label="Create Password"
          name="password"
          type="password"
          value={form.password}
          onChange={update}
          placeholder="••••••••••••"
        />
        <TextField
          label="Confirm Password"
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={update}
          placeholder="••••••••••••"
        />
      </div>

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}

      <p className="text-center text-xs text-gray-400">
        By continuing, you agree to our{' '}
        <span className="font-semibold text-brand">Terms of Use</span> and{' '}
        <span className="font-semibold text-brand">Privacy Policy.</span>
      </p>

      <PillButton type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Create Account & Set Password'}
      </PillButton>

      <SocialLogins />

      <p className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <button type="button" onClick={() => navigate('/login')} className="font-semibold text-brand">
          Log In
        </button>
      </p>
    </form>
  )
}
