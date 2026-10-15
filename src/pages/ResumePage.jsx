import { SITE } from '../data/siteConfig'
import { Link } from 'react-router-dom'

export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="section-title mb-2">CV / Resume</h1>
        <p style={{ color: 'var(--color-text-sub)' }}>
          Download or view my resume. Recruiters can request the full detailed version.
        </p>
      </div>
      <div className="card p-8 text-center mb-8">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="font-bold text-xl mb-2">{SITE.name}</h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-sub)' }}>
          Fullstack Developer · Policy Intelligence Researcher · AI Evaluator · Tamil Specialist
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/TATA_RAAM_KUMAR_CV.pdf" download
             className="btn-primary text-sm">
            Download CV (PDF)
          </a>
          <Link to="/contact" className="btn-outline text-sm">
            Request Recruiter Access
          </Link>
        </div>
      </div>
      <div className="text-center text-sm" style={{ color: 'var(--color-text-sub)' }}>
        <p>Recruiters can request the full version including project documentation,
        AI evaluation rubric samples, and methodology statements.</p>
        <p className="mt-2">
          Contact: <a href={`mailto:${SITE.email}`}
            className="font-semibold hover:underline"
            style={{ color: 'var(--color-accent)' }}>{SITE.email}</a>
        </p>
      </div>
    </div>
  )
}
