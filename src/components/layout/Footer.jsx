import { Link } from 'react-router-dom'
import { SITE, COMPANIES } from '../../data/siteConfig'

export default function Footer() {
  return (
    <footer className="mt-16 py-12 px-6"
      style={{ background: 'var(--color-primary)', borderTop: '2px solid var(--color-accent)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Col 1: Identity */}
        <div>
          <h3 className="font-serif font-bold text-lg mb-2" style={{ color: 'var(--color-accent)' }}>
            {SITE.name}
          </h3>
          <p className="text-gray-400 text-sm mb-3">{SITE.tagline}</p>
          <p className="text-gray-500 text-xs">{SITE.location}</p>
          <p className="text-gray-500 text-xs mt-1">MSME & Startup India Registered</p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: '/library',   l: 'Research Library' },
              { to: '/trackers',  l: 'Live Trackers' },
              { to: '/tools',     l: 'Tools' },
              { to: '/subscribe', l: 'Subscribe' },
              { to: '/resume',    l: 'CV / Resume' },
              { to: '/contact',   l: 'Contact' },
            ].map(({ to, l }) => (
              <Link key={to} to={to} className="text-gray-400 hover:text-white text-sm transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>

        {/* Col 3: Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm">
            <a href={`mailto:${SITE.email}`} className="text-gray-400 hover:text-white transition-colors">
              📧 {SITE.email}
            </a>
            <a href={`https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}`}
               target="_blank" rel="noreferrer"
               className="text-gray-400 hover:text-white transition-colors">
              💬 WhatsApp
            </a>
            <a href={SITE.calendly} target="_blank" rel="noreferrer"
               className="text-gray-400 hover:text-white transition-colors">
              📅 Book a Call
            </a>
            <a href={SITE.github} target="_blank" rel="noreferrer"
               className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
            <a href={SITE.linkedin} target="_blank" rel="noreferrer"
               className="text-gray-400 hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href={SITE.substack} target="_blank" rel="noreferrer"
               className="text-gray-400 hover:text-white transition-colors">
              Substack
            </a>
          </div>
        </div>

        {/* Col 4: Companies */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Companies</h4>
          {COMPANIES.map(c => (
            <div key={c.name} className="mb-3">
              <a href={c.url} target="_blank" rel="noreferrer"
                 className="font-semibold text-sm hover:underline"
                 style={{ color: c.color }}>
                {c.name} ↗
              </a>
              <p className="text-gray-500 text-xs mt-1">{c.tagline}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
        <div className="flex gap-4 text-xs text-gray-500">
          <Link to="/contact" className="hover:text-gray-300">Privacy Policy</Link>
          <Link to="/about#methodology" className="hover:text-gray-300">Methodology</Link>
        </div>
      </div>
    </footer>
  )
}
