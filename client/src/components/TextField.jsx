import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Rounded, faint-blue input with a bold label and optional password show/hide toggle.
export default function TextField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  required = false,
}) {
  const isPassword = type === 'password'
  const [visible, setVisible] = useState(false)
  const inputType = isPassword ? (visible ? 'text' : 'password') : type

  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-base font-bold text-gray-800">{label}</span>
      )}
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-2xl bg-input px-5 py-4 text-gray-700 placeholder:text-brand/60 outline-none transition focus:ring-2 focus:ring-brand"
        />
        {isPassword && (
          <button
            type="button"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand/70 hover:text-brand"
          >
            {visible ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        )}
      </div>
    </label>
  )
}
