import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MessageCircle, Phone, Clock, ShieldPlus, HeartHandshake } from 'lucide-react'
import TopBar from '../components/TopBar'
import CareContent from '../components/CareContent'
import { getCareGuide } from '../api/careGuides'
import { careAccent, CareGlyph } from '../lib/careIcons'

export default function CareGuideTopic() {
  const { slug } = useParams()
  const navigate = useNavigate()
  // Keyed by slug so a navigation to another topic derives 'loading' until its
  // own fetch resolves — no synchronous setState inside the effect.
  const [data, setData] = useState({ slug: null, status: 'loading', guide: null })

  useEffect(() => {
    let active = true
    getCareGuide(slug)
      .then((g) => active && setData({ slug, status: 'ready', guide: g }))
      .catch(() => active && setData({ slug, status: 'error', guide: null }))
    return () => {
      active = false
    }
  }, [slug])

  const status = data.slug === slug ? data.status : 'loading'
  const guide = data.slug === slug ? data.guide : null

  const contact = guide?.meta?.contact
  const reviewer = guide?.meta?.reviewer
  const lastReviewed = guide?.meta?.lastReviewed

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar
        eyebrow="Care Guide"
        title={guide?.title || 'Care Guide'}
        showBack
        onBack={() => navigate('/care')}
      />

      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-6 pb-8 pt-2 no-scrollbar md:px-8">
        {status === 'loading' && (
          <p className="rounded-2xl bg-white/50 px-4 py-8 text-center text-sm text-muted">
            Loading…
          </p>
        )}

        {status === 'error' && (
          <p className="rounded-2xl bg-white/50 px-4 py-8 text-center text-sm text-muted">
            This guide could not be loaded.
          </p>
        )}

        {status === 'ready' && guide && (
          <>
            <div className="glass-card p-5 md:p-7">
              <span
                className={`mb-4 grid h-12 w-12 place-items-center rounded-full text-white ${careAccent(
                  guide.accent,
                )}`}
              >
                <CareGlyph name={guide.icon} size={24} />
              </span>
              <CareContent>{guide.content}</CareContent>
            </div>

            {/* Clinic contact — shown when the topic carries contact details. */}
            {contact && (
              <div className="glass-card mt-5 p-5 md:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldPlus size={18} className="text-brand-dark" />
                  <h3 className="text-base font-bold text-ink">Who to contact</h3>
                </div>
                <div className="space-y-2.5">
                  {contact.clinicName && (
                    <ContactRow icon={HeartHandshake} label="Clinic" value={contact.clinicName} />
                  )}
                  {contact.phone && (
                    <ContactRow icon={Phone} label="Phone" value={contact.phone} />
                  )}
                  {contact.hours && (
                    <ContactRow icon={Clock} label="Hours" value={contact.hours} />
                  )}
                  {contact.afterHours && (
                    <ContactRow icon={Phone} label="After hours" value={contact.afterHours} />
                  )}
                </div>
              </div>
            )}

            {/* Psychosocial signpost — present on every topic. */}
            <div className="mt-5 rounded-3xl bg-gradient-to-br from-brand-dark to-brand-deep p-6 text-white shadow-soft">
              <p className="text-base font-bold">Something on your mind?</p>
              <p className="mt-1 text-sm text-white/80">
                Whether it&apos;s a symptom, a worry, or just how you&apos;re feeling — your care
                team is there for you. You don&apos;t have to manage it alone.
              </p>
              <button
                onClick={() => navigate('/chat')}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-dark shadow-soft transition hover:bg-white/90 active:scale-[0.98]"
              >
                <MessageCircle size={18} /> Message your doctor
              </button>
            </div>

            <p className="mt-5 px-1 text-xs leading-relaxed text-muted">
              This information does not replace your own clinical instructions.
              {reviewer ? ` Reviewed by: ${reviewer}.` : ''}
              {lastReviewed ? ` Last reviewed: ${lastReviewed}.` : ''}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function ContactRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/15 text-brand-dark">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  )
}
