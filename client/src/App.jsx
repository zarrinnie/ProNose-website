import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import AuthPage from './pages/auth/AuthPage'
import SetPassword from './pages/auth/SetPassword'
import Dashboard from './pages/Dashboard'
import Consultation from './pages/Consultation'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorMessages from './pages/doctor/DoctorMessages'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <Routes>
      {/* Public auth */}
      <Route path="/login" element={<AuthPage initialTab="login" />} />
      <Route path="/signup" element={<AuthPage initialTab="signup" />} />
      <Route path="/set-password" element={<SetPassword />} />

      {/* Protected app shell (sidebar on desktop, bottom nav on mobile) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Patient */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/consultation" element={<Consultation />} />
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

        {/* Super admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
