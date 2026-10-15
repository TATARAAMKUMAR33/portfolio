import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

const TOOL_CATEGORIES = ['Finance Tools', 'Research Tools', 'EdTech Tools', 'Automation', 'Data Tools', 'Other']

export default function AdminTools() {
  const [tools, setTools]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [saving, setSaving]   = useState(false)
  const emptyForm = { name:'', description:'', github_url:'', demo_url:'', tech_stack:'', category:'Finance Tools', is_featured:false }
  const [form, setForm]       = useState(emptyForm)

  useEffect(() => { fetchTools() }, [])

  async function fetchTools() {
    setLoading(true)
    const { data } = await supabase.from('tools').select('*').order('display_order')
    setTools(data || [])
    setLoading(false)
  }

  function openEdit(tool) {
    setEditItem(tool)
    setForm({
      name:        tool.name,
      description: tool.description,
      github_url:  tool.github_url || '',
      demo_url:    tool.demo_url || '',
      tech_stack:  (tool.tech_stack || []).join(', '),
      category:    tool.category || 'Other',
      is_featured: tool.is_featured || false,
    })
    setShowForm(true)
  }

  function resetForm() { setShowForm(false); setEditItem(null); setForm(emptyForm) }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const maxOrder = tools.reduce((m, t) => Math.max(m, t.display_order || 0), 0)
    const payload = {
      name:        form.name,
      description: form.description,
      github_url:  form.github_url,
      demo_url:    form.demo_url,
      tech_stack:  form.tech_stack.split(',').map(t => t.trim()).filter(Boolean),
      category:    form.category,
      is_featured: form.is_featured,
    }
    if (editItem) {
      await supabase.from('tools').update(payload).eq('id', editItem.id)
    } else {
      await supabase.from('tools').insert([{ ...payload, display_order: maxOrder + 1 }])
    }
    setSaving(false)
    resetForm()
    fetchTools()
  }

  async function deleteTool(id) {
    if (!confirm('Delete this tool?')) return
    await supabase.from('tools').delete().eq('id', id)
    fetchTools()
  }

  async function toggleFeatured(tool) {
    await supabase.from('tools').update({ is_featured: !tool.is_featured }).eq('id', tool.id)
    fetchTools()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Fullstack Tools</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add a tool here with its GitHub URL and live demo URL — card appears on /tools instantly.
          </p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary text-sm">
          + Add Tool
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6" style={{ borderLeft:'4px solid var(--color-accent)' }}>
          <h3 className="font-semibold mb-4">{editItem ? 'Edit Tool' : 'Add New Tool'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Tool Name *</label>
                <input required value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                  placeholder="e.g. US Sanctions Landing Cost Calculator"/>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <select value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}>
                  {TOOL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Description *</label>
              <textarea required rows={2} value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                placeholder="What does this tool do? Who is it for?"/>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">GitHub Repo URL</label>
                <input type="url" value={form.github_url}
                  onChange={e => setForm({...form, github_url: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                  placeholder="https://github.com/TATARAAMKUMAR33/..."/>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Live Demo URL</label>
                <input type="url" value={form.demo_url}
                  onChange={e => setForm({...form, demo_url: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                  placeholder="https://tool-name.pages.dev"/>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Tech Stack (comma separated)</label>
              <input value={form.tech_stack}
                onChange={e => setForm({...form, tech_stack: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                placeholder="React, Tailwind, Cloudflare Pages"/>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_featured}
                onChange={e => setForm({...form, is_featured: e.target.checked})}
                className="w-4 h-4"/>
              Feature this tool (larger card on /tools page)
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Add Tool →'}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2].map(i => <div key={i} className="card p-4 animate-pulse h-16"/>)}</div>
      ) : tools.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-3xl mb-2">🛠</p>
          <p className="text-gray-500">No tools yet. Add your first tool above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tools.map(t => (
            <div key={t.id} className="card p-4 flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {t.is_featured && <span className="badge badge-premium">Featured</span>}
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{t.category}</span>
                </div>
                <p className="font-semibold text-sm">{t.name}</p>
                <div className="flex gap-3 mt-1 flex-wrap">
                  {t.github_url && <a href={t.github_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">GitHub ↗</a>}
                  {t.demo_url   && <a href={t.demo_url}   target="_blank" rel="noreferrer" className="text-xs text-green-500 hover:underline">Live Demo ↗</a>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggleFeatured(t)}
                  className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-500">
                  {t.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                <button onClick={() => openEdit(t)}
                  className="text-xs px-2 py-1 rounded border text-blue-600 border-blue-300">
                  Edit
                </button>
                <button onClick={() => deleteTool(t.id)}
                  className="text-xs px-2 py-1 rounded border text-red-600 border-red-300">
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
