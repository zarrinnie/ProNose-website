import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { homeForRole } from '../lib/roles'

// Gate for authenticated routes. Optionally restrict to specific roles, and
// send unauthenticated visitors to a specific login page (defaults to /login).
export default function ProtectedRoute({ children, roles, loginPath = '/login' }) {
  const { isAuthenticated, loading, currentUser } = useAuth()

  // Wait for the stored session to rehydrate before deciding.
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F8FAFC] text-brand-dark">
        <span className="animate-pulse text-sm font-medium">Loading…</span>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to={loginPath} replace />

  // Role mismatch — send the user to their own home.
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to={homeForRole(currentUser.role)} replace />
  }

  return children
}
