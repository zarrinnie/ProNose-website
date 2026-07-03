import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Teal header bar matching the mockup: optional back chevron + centered title.
export default function TopBar({ title, showBack = false, onBack, rounded = true }) {
  const navigate = useNavigate()
  const handleBack = onBack || (() => navigate(-1))

  return (
    <div
      className={`relative flex items-center justify-center bg-brand px-5 pb-5 pt-3 text-white ${
        rounded ? 'rounded-b-[2rem]' : ''
      }`}
    >
      {showBack && (
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="absolute left-4 grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15"
        >
          <ChevronLeft size={26} strokeWidth={2.5} />
        </button>
      )}
      <h1 className="text-xl font-bold tracking-wide">{title}</h1>
    </div>
  )
}
