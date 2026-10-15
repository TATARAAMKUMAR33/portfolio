import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../utils/supabase'
import { formatDate } from '../../utils/helpers'

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ── Tracker List ──────────────────────────────────────────────
function TrackerList() {
  const [trackers, setTrackers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState({ name:'', description:'', update_frequency:'monthly', access_level:'public' })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]     = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchTrackers() }, [])

  async function fetchTrackers() {
    setLoading(true)
    const { data } = await supabase.from('trackers').select('*').order('created_at', { ascending: false })
    setTrackers(data || [])
    setLoading(false)
  }

  async function createTracker(e) {
    e.preventDefault()
    setSaving(true)
    const { data } = await supabase.from('trackers').insert([{
      name:             form.name,
      slug:             slugify(form.name),
      description:      form.description,
      update_frequency: form.update_frequency,
      access_level:     form.access_level,
      is_active:        true,
      last_updated:     null,
    }]).select().single()
    setSaving(false)
    setShowForm(false)
    setForm({ name:'', description:'', update_frequency:'monthly', access_level:'public' })
    fetchTrackers()
    if (data?.id) navigate(`update/${data.id}`)
  }

  async function toggleActive(tracker) {
    await supabase.from('trackers').update({ is_active: !tracker.is_active }).eq('id', tracker.id)
    fetchTrackers()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Live Trackers</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a tracker here → it gets its own page at /trackers/[slug] automatically.
            Add monthly updates via "Update" button.
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
          + New Tracker
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6" style={{ borderLeft: '4px solid var(--color-accent)' }}>
          <h3 className="font-semibold mb-4">Create New Tracker</h3>
          <form onSubmit={createTracker} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Tracker Name *</label>
                <input required value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                  placeholder="e.g. BRICS Delhi Declaration Scorecard"/>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">URL Slug (auto)</label>
                <input readOnly value={slugify(form.name)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 font-mono text-gray-500"
                  style={{ borderColor:'var(--color-border)' }}/>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Description *</label>
              <textarea required rows={2} value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                placeholder="2 sentences — what this tracker monitors and why it matters"/>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Update Frequency</label>
                <select value={form.update_frequency}
                  onChange={e => setForm({...form, update_frequency: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Access Level</label>
                <select value={form.access_level}
                  onChange={e => setForm({...form, access_level: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}>
                  <option value="public">Public</option>
                  <option value="premium">Premium Only</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Creating…' : 'Create Tracker + Add First Update'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card p-4 animate-pulse h-20"/>)}</div>
      ) : trackers.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-4xl mb-2">📊</p>
          <p className="text-gray-500">No trackers yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trackers.map(t => (
            <div key={t.id} className="card p-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`badge ${t.access_level === 'premium' ? 'badge-premium' : 'badge-public'}`}>
                    {t.access_level}
                  </span>
                  <span className="text-xs text-gray-400">{t.update_frequency}</span>
                  {!t.is_active && (
                    <span className="badge bg-gray-100 text-gray-400">Archived</span>
                  )}
                </div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  /trackers/{t.slug} · Last updated: {formatDate(t.last_updated) || 'No updates yet'}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                <Link to={`update/${t.id}`}
                  className="text-xs px-2 py-1 rounded border font-semibold"
                  style={{ borderColor:'var(--color-accent)', color:'var(--color-accent)' }}>
                  + Monthly Update
                </Link>
                <a href={`/trackers/${t.slug}`} target="_blank" rel="noreferrer"
                   className="text-xs px-2 py-1 rounded border text-gray-500 border-gray-300">
                  View
                </a>
                <button onClick={() => toggleActive(t)}
                  className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-500">
                  {t.is_active ? 'Archive' : 'Restore'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Monthly Update Form ───────────────────────────────────────
function TrackerUpdateForm() {
  const navigate = useNavigate()
  const trackerId = window.location.pathname.split('/').pop()
  const [tracker, setTracker] = useState(null)
  const [form, setForm] = useState({
    month: new Date().toLocaleString('default', { month:'long', year:'numeric' }),
    what_improved: '', what_remaining: '', gap_analysis: '',
    recommendation: '', progress_score: 50,
  })
  const [file, setFile]     = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('trackers').select('*').eq('id', trackerId).single()
      .then(({ data }) => setTracker(data))
  }, [trackerId])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    let pdf_url = null
    if (file) {
      const path = `tracker-updates/${trackerId}/${Date.now()}.pdf`
      await supabase.storage.from('pdfs').upload(path, file, { upsert: true })
      const { data: { publicUrl } } = supabase.storage.from('pdfs').getPublicUrl(path)
      pdf_url = publicUrl
    }
    await supabase.from('tracker_updates').insert([{
      tracker_id:      trackerId,
      month:           form.month,
      what_improved:   form.what_improved,
      what_remaining:  form.what_remaining,
      gap_analysis:    form.gap_analysis,
      recommendation:  form.recommendation,
      progress_score:  Number(form.progress_score),
      supporting_pdf_url: pdf_url,
      created_at:      new Date().toISOString(),
    }])
    // Update last_updated on tracker
    await supabase.from('trackers')
      .update({ last_updated: new Date().toISOString() })
      .eq('id', trackerId)
    setSaving(false)
    navigate('/admin/trackers')
  }

  return (
    <div>
      <button onClick={() => navigate('/admin/trackers')}
        className="text-sm mb-4 inline-block" style={{ color:'var(--color-accent)' }}>
        ← Back to Trackers
      </button>
      <h2 className="text-xl font-bold mb-1">Monthly Update</h2>
      {tracker && <p className="text-gray-500 text-sm mb-6">{tracker.name}</p>}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Month *</label>
              <input required value={form.month}
                onChange={e => setForm({...form, month: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                placeholder="e.g. October 2026"/>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">
                Progress Score: <strong style={{ color:'var(--color-accent)' }}>{form.progress_score}%</strong>
              </label>
              <input type="range" min="0" max="100" value={form.progress_score}
                onChange={e => setForm({...form, progress_score: e.target.value})}
                className="w-full mt-2" style={{ accentColor:'var(--color-accent)' }}/>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0% — Not started</span><span>100% — Complete</span>
              </div>
            </div>
          </div>

          {[
            { key:'what_improved',  label:'What Improved This Month *',     placeholder:'Specific improvements with data references...' },
            { key:'what_remaining', label:'What Is Still Remaining *',      placeholder:'What gaps or pending actions remain...' },
            { key:'gap_analysis',   label:'Gap Analysis',                   placeholder:'Decision-intelligence framing — what the gap means for your audience...' },
            { key:'recommendation', label:'Decision Recommendation',        placeholder:'One clear action sentence for a decision-maker...' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-sm font-medium block mb-1">{f.label}</label>
              <textarea rows={3} value={form[f.key]}
                onChange={e => setForm({...form, [f.key]: e.target.value})}
                required={f.label.endsWith('*')}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                placeholder={f.placeholder}/>
            </div>
          ))}

          <div>
            <label className="text-sm font-medium block mb-1">Supporting PDF (optional)</label>
            <input type="file" accept=".pdf"
              onChange={e => setFile(e.target.files[0])}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}/>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-sm">
              {saving ? 'Publishing…' : 'Publish Monthly Update →'}
            </button>
            <button type="button" onClick={() => navigate('/admin/trackers')}
              className="btn-outline text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminTrackers() {
  return (
    <Routes>
      <Route index            element={<TrackerList />} />
      <Route path="update/:id" element={<TrackerUpdateForm />} />
    </Routes>
  )
}
