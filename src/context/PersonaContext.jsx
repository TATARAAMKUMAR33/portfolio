import { createContext, useContext, useState, useEffect } from 'react'

// ── The 5 Personas ─────────────────────────────────────────
export const PERSONAS = [
  {
    id: 'policy',
    label: 'Policy Intelligence',
    icon: '🏛',
    shortLabel: 'Policy',
    headline: 'Decision Intelligence & Policy Architecture',
    subheadline: 'Live trackers, intelligence briefs, and ground-level research covering India — from central government to panchayat.',
    cta1: 'Browse Live Trackers',
    cta1Link: '/trackers',
    cta2: 'View Intelligence Library',
    cta2Link: '/library',
    cta3: 'Request Briefing',
    cta3Link: '/subscribe',
  },
  {
    id: 'developer',
    label: 'Fullstack Developer',
    icon: '⚡',
    shortLabel: 'Developer',
    headline: 'I Build Tools That Think',
    subheadline: 'Fullstack developer with React, Supabase, Cloudflare. Founder of TryIT Educations. I build the tools AND write the briefs.',
    cta1: 'See Live Tools',
    cta1Link: '/tools',
    cta2: 'View GitHub',
    cta2Link: 'https://github.com/TATARAAMKUMAR33',
    cta3: 'Hire Me',
    cta3Link: '/contact',
  },
  {
    id: 'media',
    label: 'Research & Media',
    icon: '📰',
    shortLabel: 'Media',
    headline: 'Ground-Level Research. Global Framing.',
    subheadline: 'Independent researcher covering India policy, geopolitics, and regulatory intelligence for foreign media, editors, and publishers.',
    cta1: 'Read Latest Dispatches',
    cta1Link: '/content',
    cta2: 'Browse Research Briefs',
    cta2Link: '/library',
    cta3: 'Pitch a Story',
    cta3Link: '/contact',
  },
  {
    id: 'investor',
    label: 'Investor & Business',
    icon: '📊',
    shortLabel: 'Investor',
    headline: 'India Intelligence for Decision-Makers',
    subheadline: 'State investment readiness, SEBI/RBI gap analysis, scam intelligence, and sector deep-dives — built for foreign investors and trade analysts.',
    cta1: 'View State Investment Index',
    cta1Link: '/trackers',
    cta2: 'Subscribe to Intelligence',
    cta2Link: '/subscribe',
    cta3: 'Book a Briefing',
    cta3Link: '/contact',
  },
  {
    id: 'ai',
    label: 'AI & EdTech',
    icon: '🤖',
    shortLabel: 'AI/EdTech',
    headline: 'Tamil-Native AI Evaluator & EdTech Builder',
    subheadline: 'RLHF specialist, Physics domain expert, Tamil native language evaluator. Founder of TryIT Educations — 100% free exam prep for India.',
    cta1: 'View TryIT Educations',
    cta1Link: 'https://tryiteducations.net',
    cta2: 'See AI Evaluation Work',
    cta2Link: '/about#ai',
    cta3: 'Download CV',
    cta3Link: '/resume',
  },
]

const PersonaContext = createContext(null)

export function PersonaProvider({ children }) {
  const [personaId, setPersonaId] = useState(() => {
    return localStorage.getItem('tata_persona') || 'policy'
  })

  const persona = PERSONAS.find(p => p.id === personaId) || PERSONAS[0]

  useEffect(() => {
    localStorage.setItem('tata_persona', personaId)
    document.documentElement.setAttribute('data-persona', personaId)
  }, [personaId])

  // URL param support: ?view=developer opens that persona
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const view = params.get('view')
    if (view && PERSONAS.find(p => p.id === view)) {
      setPersonaId(view)
    }
  }, [])

  return (
    <PersonaContext.Provider value={{ persona, personaId, setPersonaId, PERSONAS }}>
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  const ctx = useContext(PersonaContext)
  if (!ctx) throw new Error('usePersona must be used inside PersonaProvider')
  return ctx
}
