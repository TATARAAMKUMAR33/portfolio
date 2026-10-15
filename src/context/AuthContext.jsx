import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null)
  const [isAdmin, setIsAdmin]       = useState(false)
  const [isSubscriber, setIsSubscriber] = useState(false)
  const [loading, setLoading]       = useState(true)

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

  useEffect(() => {
    // Timeout safety — if Supabase unreachable, still render the site
    const timeout = setTimeout(() => setLoading(false), 3000)

    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        clearTimeout(timeout)
        setUser(session?.user ?? null)
        checkRoles(session?.user)
      }).catch(() => {
        clearTimeout(timeout)
        setLoading(false)
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_e, session) => {
          setUser(session?.user ?? null)
          checkRoles(session?.user)
        }
      )
      return () => {
        clearTimeout(timeout)
        subscription.unsubscribe()
      }
    } catch {
      clearTimeout(timeout)
      setLoading(false)
    }
  }, [])

  async function checkRoles(u) {
    setLoading(true)
    if (!u) {
      setIsAdmin(false)
      setIsSubscriber(false)
      setLoading(false)
      return
    }
    setIsAdmin(ADMIN_EMAIL && u.email === ADMIN_EMAIL)
    try {
      const { data } = await supabase
        .from('subscribers')
        .select('is_active, plan_expiry')
        .eq('email', u.email)
        .single()
      const active = data?.is_active && new Date(data.plan_expiry) > new Date()
      setIsSubscriber(active || false)
    } catch {
      setIsSubscriber(false)
    }
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isSubscriber, loading, signOut }}>
      {/* Never block render — show children even while loading */}
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
