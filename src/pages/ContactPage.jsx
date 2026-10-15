import { useState } from 'react'
import { supabase } from '../utils/supabase'
import { SITE } from '../data/siteConfig'

const INQUIRY_TYPES = [
  'Hire Me — Fullstack Development',
  'Commission Research / Brief',
  'Subscribe to Intelligence Products',
  'Book a Briefing Call',
  'Media / Publishing Collaboration',
  'Think Tank / Institutional Enquiry',
  'AI Evaluation Contract',
  'Other',
]

export default function ContactPage() {
  const [form, setForm]     = useState({ name:'', org:'', email:'', type: INQUIRY_TYPES[0], message:'' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      // Save to Supabase
      await supabase.from('contact_requests').insert([{
        name:         form.name,
        organisation: form.org,
        email:        form.email,
        inquiry_type: form.type,
        message:      form.message,
        created_at:   new Date().toISOString(),
        status:       'new',
      }])
      setStatus('sent')
      setForm({ name:'', org:'', email:'', type: INQUIRY_TYPES[0], message:'' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="section-title mb-2">Contact</h1>
        <p style={{ color: 'var(--color-text-sub)' }}>
          For research commissions, hiring enquiries, intelligence subscriptions, or collaboration.
          I respond within 24 hours.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Form */}
        <div className="card p-6">
          <h2 className="font-bold text-lg mb-5">Send an Enquiry</h2>
          {status === 'sent' ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-lg mb-2">Message Received</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-sub)' }}>
                I will respond to {form.email || 'you'} within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Name *</label>
                  <input required value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                    placeholder="Your name"/>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Organisation</label>
                  <input value={form.org}
                    onChange={e => setForm({...form, org: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                    placeholder="Optional"/>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Email *</label>
                <input required type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                  placeholder="your@email.com"/>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Enquiry Type *</label>
                <select required value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}>
                  {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Message *</label>
                <textarea required rows={5} value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border text-sm resize-none"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-main)' }}
                  placeholder="Tell me about your project, need, or question..."/>
              </div>
              {status === 'error' && (
                <p className="text-red-500 text-sm">Something went wrong. Please email directly.</p>
              )}
              <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
                {status === 'sending' ? 'Sending…' : 'Send Enquiry →'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Details */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold mb-4">Direct Contact</h3>
            <div className="space-y-3">
              <a href={`mailto:${SITE.email}`}
                 className="flex items-center gap-3 text-sm hover:underline"
                 style={{ color: 'var(--color-text-main)' }}>
                <span className="text-xl">📧</span>
                <span>{SITE.email}</span>
              </a>
              <a href={`https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}`}
                 target="_blank" rel="noreferrer"
                 className="flex items-center gap-3 text-sm hover:underline"
                 style={{ color: 'var(--color-text-main)' }}>
                <span className="text-xl">💬</span>
                <span>WhatsApp — {SITE.whatsapp}</span>
              </a>
              <a href={SITE.calendly} target="_blank" rel="noreferrer"
                 className="flex items-center gap-3 text-sm hover:underline"
                 style={{ color: 'var(--color-text-main)' }}>
                <span className="text-xl">📅</span>
                <span>Book a 30-minute call on Calendly</span>
              </a>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-4">Professional Profiles</h3>
            <div className="space-y-2">
              {[
                { label: 'LinkedIn',  url: SITE.linkedin,  icon: '💼' },
                { label: 'GitHub',    url: SITE.github,    icon: '⚡' },
                { label: 'Substack',  url: SITE.substack,  icon: '📰' },
              ].map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                   className="flex items-center gap-3 text-sm hover:underline"
                   style={{ color: 'var(--color-text-main)' }}>
                  <span>{l.icon}</span>
                  <span>{l.label} ↗</span>
                </a>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-2">Response Time</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-sub)' }}>
              I respond to all enquiries within <strong>24 hours</strong>.
              For urgent research commissions, WhatsApp is fastest.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"/>
              <span className="text-sm text-green-600 font-medium">Available for new projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
