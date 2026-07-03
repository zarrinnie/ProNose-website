import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout'
import TextField from '../../components/TextField'
import PillButton from '../../components/PillButton'

const LOREM =
  'Create a strong new password for your proNose account. Use at least 8 characters with a mix of letters and numbers.'

export default function SetPassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    navigate('/login')
  }

  return (
    <AuthLayout>
      <div className="bg-brand px-6 py-5 text-center md:rounded-tr-3xl">
        <h1 className="text-xl font-bold text-white">Set Password</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 px-7 py-7">
        <p className="text-sm leading-relaxed text-gray-400">{LOREM}</p>

        <TextField
          label="Password"
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
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        <PillButton type="submit" className="w-full">
          Create New Password
        </PillButton>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="block w-full text-center text-sm font-medium text-gray-400 hover:text-brand"
        >
          Back to Log In
        </button>
      </form>
    </AuthLayout>
  )
}
