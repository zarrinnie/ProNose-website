import { Fingerprint, Apple } from 'lucide-react'

// Circular alternative-login buttons (Google / Facebook / Apple / biometric).
export default function SocialLogins({ label = 'or join with' }) {
  const circle =
    'grid h-11 w-11 place-items-center rounded-full bg-brand text-white shadow-soft transition hover:bg-brand-dark active:scale-95'

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-4">
        <button aria-label="Continue with Google" className={circle}>
          <span className="text-lg font-bold">G</span>
        </button>
        <button aria-label="Continue with Facebook" className={circle}>
          <span className="font-serif text-lg font-bold">f</span>
        </button>
        <button aria-label="Continue with Apple" className={circle}>
          <Apple size={20} fill="white" strokeWidth={0} />
        </button>
        <button aria-label="Continue with biometrics" className={circle}>
          <Fingerprint size={22} />
        </button>
      </div>
    </div>
  )
}
