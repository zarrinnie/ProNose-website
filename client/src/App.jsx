import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import AuthPage from './pages/auth/AuthPage'
import AdminLogin from './pages/admin/AdminLogin'
import SetPassword from './pages/auth/SetPassword'
import Dashboard from './pages/Dashboard'
import Consultation from './pages/Consultation'
import CareGuide from './pages/CareGuide'
import CareGuideTopic from './pages/CareGuideTopic'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorMessages from './pages/doctor/DoctorMessages'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <Routes>
      {/* Public landing — choose a prosthesis type before signing in. */}
      <Route path="/" element={<Landing />} />

      {/* Public auth */}
      <Route path="/login" element={<AuthPage initialTab="login" />} />
      <Route path="/signup" element={<AuthPage initialTab="signup" />} />
      <Route path="/set-password" element={<SetPassword />} />

      {/* Hidden, dedicated admin login (reached by typing /admin). */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin console — same shell (the role-aware sidebar shows admin nav +
          Log Out), but logged-out visitors are sent to /admin/login, not the
          patient /login that guards the shell below. */}
      <Route
        element={
          <ProtectedRoute roles={['super_admin']} loginPath="/admin/login">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Protected app shell (sidebar on desktop, bottom nav on mobile) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Patient */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/care" element={<CareGuide />} />
        <Route path="/care/:slug" element={<CareGuideTopic />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:peerId" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />

        {/* Doctor */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute roles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute roles={['doctor']}>
              <DoctorMessages />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
