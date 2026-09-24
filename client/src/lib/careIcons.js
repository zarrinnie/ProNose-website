import { createElement } from 'react'
import { SprayCan, Droplets, Pill, Apple, AlertTriangle, HeartPulse, BookOpen } from 'lucide-react'

// Maps the icon name stored on a care guide to a lucide component, with a
// sensible fallback. Admins pick from these names in the editor.
const ICONS = { SprayCan, Droplets, Pill, Apple, AlertTriangle, HeartPulse, BookOpen }

export const CARE_ICON_NAMES = Object.keys(ICONS)

export function careIcon(name) {
  return ICONS[name] || HeartPulse
}

// Renders a care-guide icon by name. Using createElement keeps callers from
// assigning a component to a capitalised local during render.
export function CareGlyph({ name, ...props }) {
  return createElement(careIcon(name), props)
}

// Pastel accent key -> chip background class used on the hub cards.
const ACCENTS = {
  lavender: 'bg-pastel-lavender',
  pink: 'bg-pastel-pink',
  peach: 'bg-pastel-peach',
  blue: 'bg-pastel-blue',
  brand: 'bg-brand',
}

export const CARE_ACCENT_NAMES = Object.keys(ACCENTS)

export function careAccent(name) {
  return ACCENTS[name] || ACCENTS.lavender
}
