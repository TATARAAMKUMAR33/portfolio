import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { SITE } from '../../data/siteConfig'

const LINKS = [
  { to: '/library',   label: 'Library' },
  { to: '/trackers',  label: 'Trackers' },
  { to: '/tools',     label: 'Tools' },
  { to: '/content',   label: 'Feed' },
  { to: '/about',     label: 'About' },
  { to: '/subscribe', label: 'Subscribe' },
  { to: '/contact',   label: 'Contact' },
]

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 shadow-md"
      style={{ background: 'var(--color-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif font-bold text-xl" style={{ color: 'var(--color-accent)' }}>
            {SITE.name}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) =>
                `text-sm px-3 py-2 rounded-md font-medium transition-all ${
                  isActive
                    ? 'text-yellow-400 bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <Link to="/admin"
              className="text-sm px-3 py-2 rounded-md font-semibold ml-2"
              style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}>
              Admin
            </Link>
          )}
          {user && (
            <button onClick={signOut}
              className="text-sm text-gray-400 hover:text-white ml-2 px-2">
              Sign out
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-300 p-2" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ background: 'var(--color-primary)' }}>
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-white py-2 px-3 rounded-md text-sm font-medium">
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)}
              className="py-2 px-3 rounded-md text-sm font-semibold mt-1"
              style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}>
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
