import { AlertTriangle, Info, ShieldAlert } from 'lucide-react'

// Visual callout used inside care-guide content. Variants map to the markers
// authors write in Markdown: > [!WARNING] / [!CAUTION] / [!NOTE] / [!EXTRAPOLATED].
const VARIANTS = {
  warning: {
    label: 'Important',
    icon: ShieldAlert,
    wrap: 'border-red-300 bg-red-50/80',
    iconColor: 'text-red-500',
    label_: 'text-red-600',
  },
  caution: {
    label: 'Take care',
    icon: AlertTriangle,
    wrap: 'border-amber-300 bg-pastel-peach/25',
    iconColor: 'text-amber-600',
    label_: 'text-amber-700',
  },
  note: {
    label: 'Good to know',
    icon: Info,
    wrap: 'border-brand/30 bg-brand/10',
    iconColor: 'text-brand-dark',
    label_: 'text-brand-dark',
  },
  extrapolated: {
    label: 'Adapted from related care',
    icon: Info,
    wrap: 'border-pastel-blue/50 bg-pastel-blue/15',
    iconColor: 'text-brand-dark',
    label_: 'text-brand-dark',
  },
}

export default function Callout({ variant = 'note', children }) {
  const v = VARIANTS[variant] || VARIANTS.note
  const Icon = v.icon
  return (
    <div className={`my-4 flex gap-3 rounded-2xl border ${v.wrap} px-4 py-3.5 backdrop-blur-sm`}>
      <Icon size={20} className={`mt-0.5 shrink-0 ${v.iconColor}`} />
      <div className="min-w-0 flex-1">
        <p className={`mb-1 text-xs font-bold uppercase tracking-wide ${v.label_}`}>{v.label}</p>
        <div className="callout-body text-sm leading-relaxed text-ink/90 [&_p]:my-1 [&_a]:text-brand-dark [&_a]:underline [&_strong]:font-semibold [&_strong]:text-ink">
          {children}
        </div>
      </div>
    </div>
  )
}
