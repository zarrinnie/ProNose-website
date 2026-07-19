import { useState } from 'react'
import { CalendarCheck, Siren, MessageSquareHeart, X } from 'lucide-react'
import PillButton from './PillButton'

const slides = [
  {
    icon: CalendarCheck,
    title: 'Weekly Consultations',
    body: 'Every week, snap a clear photo of your prosthetic and answer a few quick questions. Your doctor reviews each check-in to keep your recovery on track.',
  },
  {
    icon: Siren,
    title: 'Emergency Consultation',
    body: 'Notice sudden pain, colour change, or the prosthetic shifting? Flag your submission as Urgent and your care team is alerted right away.',
  },
  {
    icon: MessageSquareHeart,
    title: 'Chat With Your Doctor',
    body: 'Have a quick question between check-ins? Message your assigned doctor directly from the Chat tab anytime.',
  },
]

// Dismissible swipeable carousel shown on a patient's first login.
export default function OnboardingTutorial({ onClose }) {
  const [index, setIndex] = useState(0)
  const isLast = index === slides.length - 1
  const { icon: Icon, title, body } = slides[index]

  const next = () => (isLast ? onClose() : setIndex((i) => i + 1))

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-sm animate-fade-in rounded-3xl border border-white/70 bg-white/90 p-7 text-center shadow-shell backdrop-blur-xl">
        <button
          onClick={onClose}
          aria-label="Skip tutorial"
          className="ml-auto block text-muted hover:text-brand-dark"
        >
          <X size={22} />
        </button>

        <div className="mx-auto mb-6 mt-2 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-soft">
          <Icon size={48} strokeWidth={1.8} />
        </div>

        <h2 className="text-2xl font-bold text-ink">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>

        <div className="my-6 flex justify-center gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-dark' : 'w-2 bg-brand/25'
              }`}
            />
          ))}
        </div>

        <PillButton onClick={next} className="w-full">
          {isLast ? 'Get Started' : 'Next'}
        </PillButton>

        {!isLast && (
          <button
            onClick={onClose}
            className="mt-3 text-sm font-medium text-muted hover:text-brand-dark"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
