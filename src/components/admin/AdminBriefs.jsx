import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../utils/supabase'
import { formatDate } from '../../utils/helpers'

const ACCESS_LEVELS = ['public', 'premium', 'recruiter']

export default function AdminBriefs() {
  const [briefs, setBriefs]         = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [uploading, setUploading]   = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [editItem, setEditItem]     = useState(null)
  const fileRef = useRef()

  const emptyForm = {
    title: '', summary: '', category_id: '', tags: '',
    access_level: 'public', is_featured: false,
  }
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: b }, { data: c }] = await Promise.all([
      supabase.from('briefs').select('*').order('published_at', { ascending: false }),
      supabase.from('categories').select('*').order('display_order'),
    ])
    setBriefs(b || [])
    setCategories(c || [])
    setLoading(false)
  }

  function openEdit(brief) {
    setEditItem(brief)
    setForm({
      title:        brief.title || '',
      summary:      brief.summary || '',
      category_id:  brief.category_id || '',
      tags:         (brief.tags || []).join(', '),
      access_level: brief.access_level || 'public',
      is_featured:  brief.is_featured || false,
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setShowForm(false)
    setEditItem(null)
    setForm(emptyForm)
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setUploading(true)

    let pdf_url = editItem?.pdf_url || ''

    // Upload PDF if new file selected
    if (file) {
      const ext  = file.name.split('.').pop()
      const path = `briefs/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('pdfs').upload(path, file, { upsert: true })
      if (upErr) { alert('Upload failed: ' + upErr.message); setUploading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('pdfs').getPublicUrl(path)
      pdf_url = publicUrl
    }

    const payload = {
      title:         form.title,
      summary:       form.summary,
      category_id:   form.category_id || null,
      tags:          form.tags.split(',').map(t => t.trim()).filter(Boolean),
      access_level:  form.access_level,
      is_featured:   form.is_featured,
      pdf_url,
      published_at:  editItem?.published_at || new Date().toISOString(),
    }

    if (editItem) {
      await supabase.from('briefs').update(payload).eq('id', editItem.id)
    } else {
      await supabase.from('briefs').insert([{ ...payload, download_count: 0 }])
    }

    setUploading(false)
    resetForm()
    fetchAll()
  }

  async function deleteBrief(id) {
    if (!confirm('Delete this brief? This cannot be undone.')) return
    await supabase.from('briefs').delete().eq('id', id)
    fetchAll()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">PDF Library</h2>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="btn-primary text-sm">
          + Upload New Brief
        </button>
      </div>

      {/* Upload / Edit Form */}
      {showForm && (
        <div className="card p-6 mb-8 border-2" style={{ borderColor: 'var(--color-accent)' }}>
          <h3 className="font-bold text-base mb-4">
            {editItem ? 'Edit Brief' : 'Upload New Brief'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Title *</label>
                <input required value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                  placeholder="Clear, specific brief title"/>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <select value={form.category_id}
                  onChange={e => setForm({...form, category_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                  <option value="">-- Select Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">1-Sentence Executive Summary *</label>
              <textarea required rows={2} value={form.summary}
                onChange={e => setForm({...form, summary: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                placeholder="One sentence — decision-intelligence framing for the reader"/>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Tags (comma separated)</label>
                <input value={form.tags}
                  onChange={e => setForm({...form, tags: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                  placeholder="BRICS, India Policy, 2026"/>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Access Level *</label>
                <select value={form.access_level}
                  onChange={e => setForm({...form, access_level: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
                  {ACCESS_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                PDF File {editItem ? '(leave empty to keep current)' : '*'}
              </label>
              <input ref={fileRef} type="file" accept=".pdf"
                onChange={e => setFile(e.target.files[0])}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
                required={!editItem}/>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_featured}
                onChange={e => setForm({...form, is_featured: e.target.checked})}
                className="w-4 h-4"/>
              Feature this brief on the homepage highlights
            </label>

            <div className="flex gap-3">
              <button type="submit" disabled={uploading} className="btn-primary text-sm">
                {uploading ? 'Uploading…' : editItem ? 'Save Changes' : 'Publish Brief'}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Briefs Table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="card p-4 animate-pulse h-16"/>
          ))}
        </div>
      ) : briefs.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-gray-500 mb-4">No briefs yet. Upload your first brief above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {briefs.map(b => (
            <div key={b.id} className="card p-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`badge badge-${b.access_level === 'public' ? 'public' : b.access_level === 'premium' ? 'premium' : 'recruiter'}`}>
                    {b.access_level}
                  </span>
                  {b.is_featured && <span className="badge badge-premium">Featured</span>}
                  <span className="text-xs text-gray-400">{formatDate(b.published_at)}</span>
                </div>
                <p className="font-semibold text-sm truncate">{b.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{b.summary}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {b.pdf_url && (
                  <a href={b.pdf_url} target="_blank" rel="noreferrer"
                     className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-500 hover:text-gray-700">
                    View
                  </a>
                )}
                <button onClick={() => openEdit(b)}
                  className="text-xs px-2 py-1 rounded border text-blue-600 border-blue-300 hover:bg-blue-50">
                  Edit
                </button>
                <button onClick={() => deleteBrief(b.id)}
                  className="text-xs px-2 py-1 rounded border text-red-600 border-red-300 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
