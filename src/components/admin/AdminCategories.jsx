import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [newName, setNewName]       = useState('')
  const [newParent, setNewParent]   = useState('')
  const [adding, setAdding]         = useState(false)
  const [editId, setEditId]         = useState(null)
  const [editName, setEditName]     = useState('')

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    setLoading(true)
    const { data } = await supabase
      .from('categories').select('*').order('display_order')
    setCategories(data || [])
    setLoading(false)
  }

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function addCategory(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.display_order || 0), 0)
    await supabase.from('categories').insert([{
      name:         newName.trim(),
      slug:         slugify(newName.trim()),
      parent_id:    newParent || null,
      display_order: maxOrder + 1,
    }])
    setNewName('')
    setNewParent('')
    setAdding(false)
    fetchCategories()
  }

  async function saveEdit(id) {
    if (!editName.trim()) return
    await supabase.from('categories').update({
      name: editName.trim(),
      slug: slugify(editName.trim()),
    }).eq('id', id)
    setEditId(null)
    setEditName('')
    fetchCategories()
  }

  async function deleteCategory(id) {
    if (!confirm('Delete this category? Briefs in it will become uncategorised.')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  async function moveUp(cat, i) {
    if (i === 0) return
    const above = categories[i - 1]
    await Promise.all([
      supabase.from('categories').update({ display_order: above.display_order }).eq('id', cat.id),
      supabase.from('categories').update({ display_order: cat.display_order }).eq('id', above.id),
    ])
    fetchCategories()
  }

  async function moveDown(cat, i) {
    if (i === categories.length - 1) return
    const below = categories[i + 1]
    await Promise.all([
      supabase.from('categories').update({ display_order: below.display_order }).eq('id', cat.id),
      supabase.from('categories').update({ display_order: cat.display_order }).eq('id', below.id),
    ])
    fetchCategories()
  }

  const roots    = categories.filter(c => !c.parent_id)
  const children = (parentId) => categories.filter(c => c.parent_id === parentId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Filter Categories</h2>
          <p className="text-sm text-gray-500 mt-1">
            Categories created here appear instantly as filter buttons on the Research Library.
            No code needed — ever.
          </p>
        </div>
      </div>

      {/* Add New Category */}
      <div className="card p-5 mb-8" style={{ borderLeft: '4px solid var(--color-accent)' }}>
        <h3 className="font-semibold mb-3">Create New Category</h3>
        <form onSubmit={addCategory} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="text-sm font-medium block mb-1">Category Name *</label>
            <input required value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
              placeholder="e.g. BRICS, Geopolitics, Energy Policy"/>
          </div>
          <div className="w-52">
            <label className="text-sm font-medium block mb-1">Parent Category (optional)</label>
            <select value={newParent}
              onChange={e => setNewParent(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
              <option value="">-- Top Level --</option>
              {roots.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={adding} className="btn-primary text-sm self-end">
            {adding ? 'Adding…' : '+ Add Category'}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          The new filter button will appear on /library immediately after saving.
        </p>
      </div>

      {/* Category List */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="card p-4 animate-pulse h-12"/>)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-3xl mb-2">🏷</p>
          <p className="text-gray-500">No categories yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {roots.map((cat, i) => (
            <div key={cat.id}>
              {/* Root category row */}
              <div className="card p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveUp(cat, i)}
                      className="text-gray-300 hover:text-gray-600 text-xs leading-none">▲</button>
                    <button onClick={() => moveDown(cat, i)}
                      className="text-gray-300 hover:text-gray-600 text-xs leading-none">▼</button>
                  </div>
                  {editId === cat.id ? (
                    <input autoFocus value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(cat.id)}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      style={{ borderColor: 'var(--color-accent)' }}/>
                  ) : (
                    <span className="font-semibold text-sm">{cat.name}</span>
                  )}
                  <span className="text-xs text-gray-400 font-mono">{cat.slug}</span>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {editId === cat.id ? (
                    <>
                      <button onClick={() => saveEdit(cat.id)}
                        className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-semibold">
                        Save
                      </button>
                      <button onClick={() => setEditId(null)}
                        className="text-xs px-2 py-1 rounded border text-gray-500">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditId(cat.id); setEditName(cat.name) }}
                        className="text-xs px-2 py-1 rounded border text-blue-600 border-blue-300">
                        Rename
                      </button>
                      <button onClick={() => deleteCategory(cat.id)}
                        className="text-xs px-2 py-1 rounded border text-red-600 border-red-300">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Sub-categories */}
              {children(cat.id).map(child => (
                <div key={child.id}
                  className="card p-3 flex items-center justify-between gap-2 ml-8 mt-1"
                  style={{ borderLeft: '3px solid var(--color-border)' }}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-gray-300 text-xs">↳</span>
                    {editId === child.id ? (
                      <input autoFocus value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveEdit(child.id)}
                        className="flex-1 px-2 py-1 border rounded text-sm"
                        style={{ borderColor: 'var(--color-accent)' }}/>
                    ) : (
                      <span className="text-sm text-gray-600">{child.name}</span>
                    )}
                    <span className="text-xs text-gray-400 font-mono">{child.slug}</span>
                  </div>
                  <div className="flex gap-2">
                    {editId === child.id ? (
                      <>
                        <button onClick={() => saveEdit(child.id)}
                          className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 font-semibold">
                          Save
                        </button>
                        <button onClick={() => setEditId(null)}
                          className="text-xs px-2 py-1 rounded border text-gray-500">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditId(child.id); setEditName(child.name) }}
                          className="text-xs px-2 py-1 rounded border text-blue-600 border-blue-300">
                          Rename
                        </button>
                        <button onClick={() => deleteCategory(child.id)}
                          className="text-xs px-2 py-1 rounded border text-red-600 border-red-300">
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
