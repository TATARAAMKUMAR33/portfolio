import { usePersona } from '../context/PersonaContext'
import { Link } from 'react-router-dom'
import { SITE, COMPANIES, SERVICES, SUBSCRIPTION_PLANS } from '../data/siteConfig'

// ── Stat Strip ────────────────────────────────────────────────
function StatStrip() {
  const stats = [
    { value: '5+',  label: 'Live Trackers' },
    { value: '10+', label: 'Research Briefs' },
    { value: '3+',  label: 'Fullstack Tools' },
    { value: '15+', label: 'Countries Covered' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto py-10 px-4">
      {stats.map(s => (
        <div key={s.label} className="text-center">
          <div className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>{s.value}</div>
          <div className="text-sm mt-1" style={{ color: 'var(--color-text-sub)' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Hero Section ──────────────────────────────────────────────
function HeroSection() {
  const { persona } = usePersona()
  return (
    <section className="gradient-hero text-white py-20 px-6 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
           style={{ background: 'var(--color-accent)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
           style={{ background: 'var(--color-accent)', transform: 'translate(-30%, 30%)' }} />

      <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
        {SITE.available && (
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--color-accent)', border: '1px solid var(--color-accent)' }}>
            ● Available for Work — Remote · Contract · Immediate
          </span>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-4">
          {persona.headline}
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
          {persona.subheadline}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to={persona.cta1Link}
            className="btn-primary text-sm"
            style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}>
            {persona.cta1} →
          </Link>
          <a href={persona.cta2Link.startsWith('http') ? persona.cta2Link : undefined}
             {...(persona.cta2Link.startsWith('http') ? { target:'_blank', rel:'noreferrer' } : {})}
             className="btn-outline text-sm"
             style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
             onClick={persona.cta2Link.startsWith('/') ? undefined : undefined}>
            {persona.cta2}
          </a>
          <Link to={persona.cta3Link}
            className="text-sm px-6 py-2 rounded-lg font-semibold transition-all"
            style={{ color: '#ccc', border: '1px solid #555' }}>
            {persona.cta3}
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Companies Section ─────────────────────────────────────────
function CompaniesSection() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title text-center mb-10">Companies I Founded</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {COMPANIES.map(c => (
            <div key={c.name} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-xl" style={{ color: c.color }}>{c.name}</h3>
                <span className="text-xs text-gray-400 mt-1">Since {c.since}</span>
              </div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-sub)' }}>
                {c.role}
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-sub)' }}>
                {c.description}
              </p>
              {c.registered && (
                <p className="text-xs text-gray-400 mb-3">✓ {c.registered}</p>
              )}
              <div className="flex gap-3 flex-wrap">
                <a href={c.url} target="_blank" rel="noreferrer"
                   className="text-sm font-semibold hover:underline"
                   style={{ color: c.color }}>
                  Visit {c.name} ↗
                </a>
                {c.telegram && (
                  <a href={c.telegram} target="_blank" rel="noreferrer"
                     className="text-sm text-blue-400 hover:underline">
                    Telegram ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Services Section ──────────────────────────────────────────
function ServicesSection() {
  const { personaId } = usePersona()
  const filtered = SERVICES.filter(s => s.personas.includes(personaId))
  const shown = filtered.length ? filtered : SERVICES.slice(0, 4)

  return (
    <section className="py-14 px-6" style={{ background: 'var(--color-card-bg)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title text-center mb-2">Services</h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--color-text-sub)' }}>
          Project-based · Monthly retainer · Hourly — discuss what fits your need
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map(s => (
            <div key={s.id} className="card p-5">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--color-text-main)' }}>
                {s.title}
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-sub)' }}>{s.description}</p>
              <p className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                For: {s.audience}
              </p>
              <p className="text-xs mt-1 text-gray-400">{s.model}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/contact" className="btn-primary text-sm">Discuss a Project →</Link>
        </div>
      </div>
    </section>
  )
}

// ── Subscribe Teaser ──────────────────────────────────────────
function SubscribeTeaser() {
  return (
    <section className="py-14 px-6 gradient-hero text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-3xl font-bold mb-3">
          Subscribe to Intelligence
        </h2>
        <p className="text-gray-300 mb-2">
          Premium subscribers get full tracker data (district + panchayat level),
          deep-dive PDFs, and monthly intelligence briefings.
        </p>
        <p className="mb-6" style={{ color: 'var(--color-accent)' }}>
          Starting at Rs. 499/month · $9/month · Cancel anytime
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link to="/subscribe" className="btn-primary">See Plans →</Link>
          <Link to="/library"
            className="btn-outline"
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>
            Browse Free Briefs
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Home Page ─────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <StatStrip />
      <CompaniesSection />
      <ServicesSection />
      <SubscribeTeaser />
    </div>
  )
}
