import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import TopBar from '../components/TopBar'
import { listCareGuides } from '../api/careGuides'
import { careIcon, careAccent } from '../lib/careIcons'

// Patient care-guide hub: a disclaimer banner + a list of topic cards linking
// to the detail pages.
export default function CareGuide() {
  const navigate = useNavigate()
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listCareGuides()
      .then(setGuides)
      .catch(() => setGuides([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TopBar eyebrow="Looking after yourself" title="Care Guide" />

      <div className="mx-auto w-full max-w-4xl flex-1 overflow-y-auto px-6 pb-6 pt-2 no-scrollbar md:px-8">
        <div className="glass-card mb-5 flex items-start gap-3 px-4 py-3.5">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand-dark" />
          <p className="text-sm leading-relaxed text-muted">
            These guides are adapted from published evidence to support your recovery. They
            don&apos;t replace the instructions of your own care team — always follow their advice.
          </p>
        </div>

        {loading ? (
          <p className="rounded-2xl bg-white/50 px-4 py-8 text-center text-sm text-muted">
            Loading guides…
          </p>
        ) : guides.length === 0 ? (
          <p className="rounded-2xl bg-white/50 px-4 py-8 text-center text-sm text-muted">
            No care guides are available yet.
          </p>
        ) : (
          <div className="space-y-3">
            {guides.map((g) => {
              const Icon = careIcon(g.icon)
              return (
                <button
                  key={g.slug}
                  onClick={() => navigate(`/care/${g.slug}`)}
                  className="glass-card flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/90"
                >
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-white ${careAccent(
                      g.accent,
                    )}`}
                  >
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{g.title}</p>
                    {g.summary && <p className="mt-0.5 text-sm text-muted">{g.summary}</p>}
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-muted/60" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
