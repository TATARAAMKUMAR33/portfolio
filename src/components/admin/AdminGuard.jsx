import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { supabase } from '../../utils/supabase'

export default function AdminGuard({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [sending, setSending] = useState(false)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-gold-DEFAULT border-t-transparent rounded-full"/>
    </div>
  )

  if (user && isAdmin) return children

  async function handleLogin(e) {
    e.preventDefault()
    setSending(true)
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.href } })
    setSent(true)
    setSending(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: '#0B1F3A' }}>
      <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h2 className="font-bold text-xl text-navy-DEFAULT">Admin Panel</h2>
          <p className="text-sm text-gray-500 mt-1">TATA RAAM KUMAR — Portfolio Admin</p>
        </div>
        {sent ? (
          <div className="text-center">
            <div className="text-3xl mb-3">📧</div>
            <p className="font-semibold text-gray-700 mb-1">Check your email</p>
            <p className="text-sm text-gray-400">
              Magic link sent to <strong>{email}</strong>. Click it to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">Admin Email</label>
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="your_admin@email.com"/>
            </div>
            <button type="submit" disabled={sending}
              className="w-full btn-primary"
              style={{ background: '#D4AF37', color: '#0B1F3A' }}>
              {sending ? 'Sending…' : 'Send Magic Link →'}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Only the registered admin email has access.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
