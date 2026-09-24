import { Ear, Eye, Hand, Wind } from 'lucide-react'

// Single source of truth for the prosthesis types the platform supports.
// Drives the landing chooser, the per-type colour theme (see index.css
// [data-prosthesis="…"]) and the consultation question copy. `status: 'live'`
// types are selectable and fully built; `'soon'` types show as greyed-out
// "coming soon" cards.
export const PROSTHESES = {
  nose: {
    slug: 'nose',
    label: 'Nose',
    // The theme key must match a [data-prosthesis="…"] block in index.css.
    theme: 'nose',
    status: 'live',
    icon: Wind,
    // Fixed swatch for the landing card chip, independent of the active theme.
    swatch: ['#1FB5AC', '#0E7C88'],
    tagline: 'Post-rhinectomy nasal prosthesis care and check-ins.',
    // Descriptive noun woven into the consultation copy below.
    noun: 'nasal prosthesis',
    questions: {
      photoTitle: 'Upload a prosthetic photo',
      photoHelp:
        'Take a clear, well-lit photo of your nasal prosthesis so your doctor can assess it.',
      doingOkay: 'Are you feeling alright?',
      discomfort: 'Any discomfort with the new prosthesis?',
      discomfortPlaceholder: 'e.g. itching, pressure, soreness',
      colorFading: "Is the prosthesis's colour fading or changing?",
      deforming: 'Is the prosthesis deforming or changing shape?',
      dailyIssues: 'Any issues with daily use of the prosthesis?',
      dailyIssuesPlaceholder: 'e.g. cleaning, adhesive, fit',
    },
  },
  microtia: {
    slug: 'microtia',
    label: 'Microtia (Ear)',
    theme: 'microtia',
    status: 'live',
    icon: Ear,
    swatch: ['#8B7EE0', '#5B4CB8'],
    tagline: 'Ear (auricular) prosthesis care and recovery check-ins.',
    noun: 'ear prosthesis',
    questions: {
      photoTitle: 'Upload a prosthetic photo',
      photoHelp:
        'Take a clear, well-lit photo of your ear prosthesis so your doctor can assess it.',
      doingOkay: 'Are you feeling alright?',
      discomfort: 'Any discomfort with the new ear prosthesis?',
      discomfortPlaceholder: 'e.g. itching, pressure behind the ear, soreness',
      colorFading: "Is the ear prosthesis's colour fading or changing?",
      deforming: 'Is the ear prosthesis deforming or changing shape?',
      dailyIssues: 'Any issues with daily use of the ear prosthesis?',
      dailyIssuesPlaceholder: 'e.g. cleaning, adhesive, fit behind the ear, glasses',
    },
  },
  ocular: {
    slug: 'ocular',
    label: 'Ocular (Eye)',
    status: 'soon',
    icon: Eye,
    swatch: ['#9AA6BF', '#6B778F'],
    tagline: 'Eye prosthesis care — coming soon.',
  },
  digit: {
    slug: 'digit',
    label: 'Finger / Toe',
    status: 'soon',
    icon: Hand,
    swatch: ['#9AA6BF', '#6B778F'],
    tagline: 'Finger and toe prostheses — coming soon.',
  },
}

// Convenience arrays for the landing page.
export const ALL_PROSTHESES = Object.values(PROSTHESES)
export const LIVE_PROSTHESES = ALL_PROSTHESES.filter((p) => p.status === 'live')

// The set a patient may actually register under (validated on the server too).
export const LIVE_PROSTHESIS_SLUGS = LIVE_PROSTHESES.map((p) => p.slug)

// Always returns a config, falling back to nose so theming/copy never break.
export function prosthesisConfig(slug) {
  return PROSTHESES[slug] || PROSTHESES.nose
}
