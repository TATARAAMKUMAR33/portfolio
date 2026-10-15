import { SITE, COMPANIES, SERVICES } from '../data/siteConfig'
import { Link } from 'react-router-dom'

const SKILLS = [
  { icon:'🏛', label:'Policy Intelligence',    desc:'India central, state, district, panchayat level' },
  { icon:'🔍', label:'OSINT',                  desc:'Open-source intelligence, Tamil + Hindi sources' },
  { icon:'📝', label:'Research Writing',        desc:'Long-form briefs, gap analysis, executive memos' },
  { icon:'⚡', label:'Fullstack Development',  desc:'React, Supabase, Cloudflare, Python' },
  { icon:'🤖', label:'AI Evaluation / RLHF',  desc:'Tamil native, Physics domain, rubric design' },
  { icon:'📊', label:'Data Analysis',          desc:'Quantitative research, Recharts, SQL, Python' },
]

const EXPERIENCE = [
  {
    role:    'Founder & Intelligence Analyst',
    org:     'Voxia Global',
    period:  '2024 – Present',
    desc:    'Policy intelligence platform for foreign clients. Registered MSME + Startup India. Covering India government policy, regulatory changes, and ground-level execution gaps for international investors, NGOs, and media.',
    color:   '#D4AF37',
  },
  {
    role:    'Founder & Fullstack Developer',
    org:     'TryIT Educations',
    period:  '2023 – Present',
    desc:    'Built a full-stack exam prep platform — React 18, Vite, Tailwind, Supabase, Capacitor. Covers Class 1 to PhD, all Indian competitive and entrance exams, all Indian languages. 100% free.',
    color:   '#0E7C7B',
  },
  {
    role:    'Independent Consultant & Researcher',
    org:     'Self',
    period:  '2023 – Present',
    desc:    'AI evaluation (RLHF), fact-checking, competitive intelligence, policy intelligence writing. Tamil language AI evaluation specialist. Physics and STEM domain evaluator.',
    color:   '#0B1F3A',
  },
  {
    role:    'Academic Coordinator & Senior Mentor',
    org:     "Mahendra's Institutions, Bangalore",
    period:  '2020 – 2024',
    desc:    'Physics, Mathematics, Quantitative Ability, Logical Reasoning, Current Affairs. 1000+ learners mentored. 500+ assessment items quality-checked.',
    color:   '#4A5568',
  },
  {
    role:    'Sales Manager',
    org:     'Corporate (B2B)',
    period:  '2016 – 2020',
    desc:    'B2B sales, client research, competitive positioning, stakeholder presentations.',
    color:   '#718096',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Bio */}
      <section className="mb-14">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h1 className="section-title mb-4">{SITE.name}</h1>
            <p className="text-lg mb-4" style={{ color: 'var(--color-text-sub)' }}>
              Policy Intelligence Researcher · Fullstack Developer · Founder
            </p>
            <p className="mb-3" style={{ color: 'var(--color-text-sub)' }}>
              I track how India's policy announcements translate — or fail to translate —
              into ground-level implementation, from central government down to individual panchayats.
              I build the tools and platforms that make this research accessible to foreign investors,
              media, think tanks, and decision-makers worldwide.
            </p>
            <p className="mb-4" style={{ color: 'var(--color-text-sub)' }}>
              Tamil native and Physics graduate with ~9 years across sales, education,
              fullstack development, and independent research. I read primary sources
              in Tamil, Hindi, and English — including state gazette notifications
              and regional-language panchayat circulars that most English-only researchers miss.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link to="/resume" className="btn-primary text-sm">Download CV</Link>
              <Link to="/contact" className="btn-outline text-sm">Contact Me</Link>
              <a href={SITE.calendly} target="_blank" rel="noreferrer"
                 className="btn-outline text-sm">Book a Call</a>
            </div>
          </div>
          <div className="space-y-3">
            <div className="card p-4">
              <p className="text-xs font-semibold text-gray-400 mb-1">LOCATION</p>
              <p className="font-medium text-sm">{SITE.location}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-gray-400 mb-1">LANGUAGES</p>
              <p className="font-medium text-sm">Tamil (Native) · English (Professional)</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-gray-400 mb-1">EDUCATION</p>
              <p className="font-medium text-sm">B.Sc. Physics, Periyar University (2013–2016)</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-gray-400 mb-1">AVAILABILITY</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"/>
                <p className="font-medium text-sm text-green-600">Remote · Contract · Immediate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-14" id="skills">
        <h2 className="section-title mb-6">Skills & Expertise</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS.map(s => (
            <div key={s.label} className="card p-4 flex items-start gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-semibold text-sm">{s.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-sub)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="mb-14">
        <h2 className="section-title mb-6">Experience</h2>
        <div className="space-y-4">
          {EXPERIENCE.map((e, i) => (
            <div key={i} className="card p-5 flex gap-4">
              <div className="w-1 rounded-full flex-shrink-0" style={{ background: e.color }}/>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-sm">{e.role}</h3>
                  <span className="text-xs text-gray-400">{e.period}</span>
                </div>
                <p className="font-semibold text-xs mb-2" style={{ color: e.color }}>{e.org}</p>
                <p className="text-sm" style={{ color: 'var(--color-text-sub)' }}>{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Evaluation Section */}
      <section className="mb-14" id="ai">
        <h2 className="section-title mb-4">AI Evaluation & RLHF</h2>
        <div className="card p-6">
          <p className="mb-4" style={{ color: 'var(--color-text-sub)' }}>
            Specialised in AI response evaluation, rubric design, hallucination detection,
            and multi-turn conversational evaluation. Tamil native — one of the rarest
            language combinations in AI evaluation. Physics and STEM domain expert.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'AI response evaluation & rubric-based feedback',
              'Fact-checking & hallucination detection',
              'Prompt testing & multi-turn conversation evaluation',
              'Tamil language AI evaluation (native-level)',
              'Physics / STEM domain evaluation',
              'Comparative model evaluation across AI systems',
            ].map(s => (
              <div key={s} className="flex items-start gap-2 text-sm">
                <span className="text-purple-500 mt-0.5">✓</span>
                <span style={{ color: 'var(--color-text-sub)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section id="methodology">
        <h2 className="section-title mb-4">Intelligence Methodology</h2>
        <div className="card p-6">
          <p className="mb-4" style={{ color: 'var(--color-text-sub)' }}>
            All trackers and research briefs follow a verified, documented methodology.
            Primary sources take precedence over secondary aggregators.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Primary Sources</h4>
              <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-sub)' }}>
                <li>• Central Government Gazette (Official)</li>
                <li>• PIB (Press Information Bureau)</li>
                <li>• State Government Gazette notifications</li>
                <li>• Parliamentary records and debates</li>
                <li>• District and panchayat circulars (Tamil + Hindi)</li>
                <li>• SEBI, RBI, MCA official circulars</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Verification Process</h4>
              <ul className="text-sm space-y-1" style={{ color: 'var(--color-text-sub)' }}>
                <li>• Primary source citation required for every claim</li>
                <li>• Cross-referenced against at least two independent sources</li>
                <li>• Ground-level OSINT for implementation gap analysis</li>
                <li>• Monthly update cadence with timestamped data points</li>
                <li>• Tamil and Hindi sources verified by native reader</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
