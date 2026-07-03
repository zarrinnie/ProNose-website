import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Gate for authenticated routes. Optionally restrict to specific roles.
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, currentUser } = useAuth()

  // Wait for the stored session to rehydrate before deciding.
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F8FAFC] text-brand-dark">
        <span className="animate-pulse text-sm font-medium">Loading…</span>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  // Role mismatch — send the user to their own home.
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
