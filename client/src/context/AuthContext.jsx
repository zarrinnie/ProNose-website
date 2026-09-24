import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { loginRequest, registerRequest, fetchMe } from '../api/auth'
import { listConsultations } from '../api/consultations'
import { updateUser as updateUserRequest } from '../api/users'
import { getToken, setToken } from '../api/client'

const AuthContext = createContext(null)

const PROSTHESIS_KEY = 'pronose_prosthesis'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [consultations, setConsultations] = useState([])
  // Prosthesis chosen on the public landing page, before an account exists.
  // Persisted so the auth screens stay themed across a refresh.
  const [selectedProsthesis, setSelectedProsthesisState] = useState(
    () => localStorage.getItem(PROSTHESIS_KEY) || null,
  )
  // While we rehydrate the session from a stored token on first load.
  const [loading, setLoading] = useState(Boolean(getToken()))

  const setSelectedProsthesis = useCallback((slug) => {
    setSelectedProsthesisState(slug)
    if (slug) localStorage.setItem(PROSTHESIS_KEY, slug)
    else localStorage.removeItem(PROSTHESIS_KEY)
  }, [])

  // Apply the active theme to the document root. Once logged in, a user's own
  // type drives it (doctors → their prosthesis; admins/staff without a type →
  // neutral nose). Before login, the landing selection themes the auth screens.
  const activeProsthesis = currentUser
    ? currentUser.prosthesisType || 'nose'
    : selectedProsthesis || 'nose'
  useEffect(() => {
    document.documentElement.dataset.prosthesis = activeProsthesis
  }, [activeProsthesis])

  // Patients have a global consultation list backing the dashboard.
  const refreshConsultations = useCallback(async (user) => {
    const u = user || currentUser
    if (!u || u.role !== 'patient') {
      setConsultations([])
      return
    }
    try {
      setConsultations(await listConsultations(u.id))
    } catch {
      setConsultations([])
    }
  }, [currentUser])

  // Rehydrate the user from a stored JWT on app mount / refresh.
  useEffect(() => {
    if (!getToken()) return
    let active = true
    ;(async () => {
      try {
        const user = await fetchMe()
        if (!active) return
        // Admin sessions are intentionally not persisted — a fresh load of
        // /admin must always go back through /admin/login.
        if (user.role === 'super_admin') {
          setToken(null)
          return // finally{} still runs -> setLoading(false)
        }
        setCurrentUser(user)
        await refreshConsultations(user)
      } catch {
        setToken(null)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async ({ email, password }) => {
    const user = await loginRequest({ email, password })
    setCurrentUser(user)
    setIsFirstLogin(false)
    await refreshConsultations(user)
    return user
  }

  const register = async (form) => {
    const user = await registerRequest(form)
    setCurrentUser(user)
    setIsFirstLogin(true)
    await refreshConsultations(user)
    return user
  }

  const logout = () => {
    setToken(null)
    setCurrentUser(null)
    setConsultations([])
    setIsFirstLogin(false)
  }

  const dismissOnboarding = () => setIsFirstLogin(false)
  const showOnboarding = () => setIsFirstLogin(true)

  // Locally prepend a freshly submitted consultation (already created via API).
  const addConsultation = (consultation) => {
    setConsultations((prev) => [consultation, ...prev])
  }

  // Profile edits — persist contact details (and optional avatar) then update
  // local state so the new name/picture appear everywhere immediately.
  const updateUser = async (updates) => {
    if (!currentUser) return
    const saved = await updateUserRequest(
      currentUser.id,
      {
        full_name: updates.name,
        mobile_number: updates.mobile,
        email: updates.email,
      },
      updates.avatarFile,
    )
    setCurrentUser((prev) => ({ ...prev, ...saved }))
  }

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      loading,
      isFirstLogin,
      consultations,
      selectedProsthesis,
      activeProsthesis,
      setSelectedProsthesis,
      login,
      register,
      logout,
      dismissOnboarding,
      showOnboarding,
      addConsultation,
      refreshConsultations,
      updateUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, loading, isFirstLogin, consultations, selectedProsthesis, activeProsthesis],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
