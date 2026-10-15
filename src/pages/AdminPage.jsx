import { useState } from 'react'
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminBriefs    from '../components/admin/AdminBriefs'
import AdminCategories from '../components/admin/AdminCategories'
import AdminTrackers  from '../components/admin/AdminTrackers'
import AdminContent   from '../components/admin/AdminContent'
import AdminTools     from '../components/admin/AdminTools'
import AdminContacts  from '../components/admin/AdminContacts'
import AdminSettings  from '../components/admin/AdminSettings'

const NAV = [
  { to: '',           label: '📊 Dashboard',   end: true },
  { to: 'briefs',     label: '📁 PDF Library' },
  { to: 'categories', label: '🏷 Categories' },
  { to: 'trackers',   label: '📈 Trackers' },
  { to: 'content',    label: '📡 Content Feed' },
  { to: 'tools',      label: '🛠 Tools' },
  { to: 'contacts',   label: '📬 Enquiries' },
  { to: 'settings',   label: '⚙ Settings' },
]

function AdminDashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NAV.filter(n => n.to).map(n => (
          <Link key={n.to} to={n.to}
            className="card p-5 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{n.label.split(' ')[0]}</div>
            <div className="font-semibold text-sm">{n.label.split(' ').slice(1).join(' ')}</div>
          </Link>
        ))}
      </div>
      <div className="mt-8 card p-5">
        <h3 className="font-semibold mb-2">Quick Tips</h3>
        <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-sub)' }}>
          <li>• <strong>PDF Library:</strong> Upload a brief → fill details → published instantly</li>
          <li>• <strong>Categories:</strong> Create a new topic → filter appears on /library immediately</li>
          <li>• <strong>Trackers:</strong> Create tracker → fill monthly update → chart updates automatically</li>
          <li>• <strong>Content Feed:</strong> Paste LinkedIn URL + image → card live in 30 seconds</li>
          <li>• <strong>Enquiries:</strong> See all contact form submissions here</li>
        </ul>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { signOut } = useAuth()
  const navigate    = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      {/* Admin Header */}
      <div className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow"
           style={{ background: '#0B1F3A', borderBottom: '2px solid #D4AF37' }}>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-yellow-400 font-bold text-sm">← Portfolio</Link>
          <span className="text-white font-bold">Admin Panel</span>
        </div>
        <button onClick={handleSignOut}
          className="text-gray-400 hover:text-white text-sm px-3 py-1 rounded border border-gray-600">
          Sign Out
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <nav className="w-52 flex-shrink-0 py-4 px-3 shadow-sm hidden md:block"
             style={{ background: 'var(--color-card-bg)', borderRight: '1px solid var(--color-border)' }}>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors ${
                  isActive
                    ? 'text-navy font-bold'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
              style={({ isActive }) =>
                isActive ? { background: '#FFF8DC', color: '#0B1F3A' } : {}
              }>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route index          element={<AdminDashboard />} />
            <Route path="briefs"      element={<AdminBriefs />} />
            <Route path="categories"  element={<AdminCategories />} />
            <Route path="trackers/*"  element={<AdminTrackers />} />
            <Route path="content"     element={<AdminContent />} />
            <Route path="tools"       element={<AdminTools />} />
            <Route path="contacts"    element={<AdminContacts />} />
            <Route path="settings"    element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
