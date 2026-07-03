import { Home, ClipboardPlus, MessageCircle, User, Users, Stethoscope } from 'lucide-react'

// Landing route for each role after login.
export function homeForRole(role) {
  if (role === 'doctor') return '/doctor'
  if (role === 'super_admin') return '/admin'
  return '/'
}

export function roleLabel(role) {
  if (role === 'doctor') return 'Doctor'
  if (role === 'super_admin') return 'Administrator'
  return 'Patient'
}

const PATIENT_TABS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/consultation', label: 'Consult', icon: ClipboardPlus, end: false },
  { to: '/chat', label: 'Chat', icon: MessageCircle, end: false },
  { to: '/profile', label: 'Profile', icon: User, end: false },
]

const DOCTOR_TABS = [
  { to: '/doctor', label: 'Patients', icon: Stethoscope, end: true },
  { to: '/messages', label: 'Messages', icon: MessageCircle, end: true },
  { to: '/profile', label: 'Profile', icon: User, end: false },
]

const ADMIN_TABS = [
  { to: '/admin', label: 'Users', icon: Users, end: true },
  { to: '/profile', label: 'Profile', icon: User, end: false },
]

// Navigation tabs for the current role.
export function navTabs(role) {
  if (role === 'doctor') return DOCTOR_TABS
  if (role === 'super_admin') return ADMIN_TABS
  return PATIENT_TABS
}
