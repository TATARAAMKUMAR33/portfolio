import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { formatDate } from '../../utils/helpers'

export default function AdminContent() {
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm] = useState({
    title: '', url: '', thumbnail_url: '',
    excerpt: '', access_level: 'public', is_featured: false,
    published_at: new Date().toISOString().split('T')[0],
  })

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase.from('content_feed')
      .select('*').eq('type', 'linkedin')
      .order('published_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('content_feed').insert([{
      type:          'linkedin',
      title:          form.title,
      url:            form.url,
      thumbnail_url:  form.thumbnail_url,
      excerpt:        form.excerpt,
      access_level:   form.access_level,
      is_featured:    form.is_featured,
      published_at:   form.published_at,
    }])
    setSaving(false)
    setShowForm(false)
    setForm({ title:'', url:'', thumbnail_url:'', excerpt:'', access_level:'public', is_featured:false, published_at: new Date().toISOString().split('T')[0] })
    fetchPosts()
  }

  async function deletePost(id) {
    if (!confirm('Remove this post card?')) return
    await supabase.from('content_feed').delete().eq('id', id)
    fetchPosts()
  }

  async function toggleFeatured(post) {
    await supabase.from('content_feed').update({ is_featured: !post.is_featured }).eq('id', post.id)
    fetchPosts()
  }

  async function toggleAccess(post) {
    const next = post.access_level === 'public' ? 'premium' : 'public'
    await supabase.from('content_feed').update({ access_level: next }).eq('id', post.id)
    fetchPosts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Content Feed</h2>
          <p className="text-sm text-gray-500 mt-1">
            Substack articles auto-appear via RSS — no action needed after publishing.
            Add LinkedIn posts manually here in ~30 seconds each.
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
          + Add LinkedIn Post
        </button>
      </div>

      <div className="card p-4 mb-6" style={{ background:'#f0fdf4', borderLeft:'3px solid #22c55e' }}>
        <p className="text-sm font-semibold text-green-700">✓ Substack Auto-Sync Active</p>
        <p className="text-xs text-green-600 mt-0.5">
          Your Substack articles appear automatically via RSS. No manual action needed.
          Substack articles show as separate cards on the Content Feed page.
        </p>
      </div>

      {showForm && (
        <div className="card p-6 mb-6" style={{ borderLeft:'4px solid #0A66C2' }}>
          <h3 className="font-semibold mb-4">Add LinkedIn Post Card</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Post Title *</label>
              <input required value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                placeholder="Your LinkedIn post headline"/>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">LinkedIn Post URL *</label>
                <input required type="url" value={form.url}
                  onChange={e => setForm({...form, url: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                  placeholder="https://linkedin.com/posts/..."/>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Post Date</label>
                <input type="date" value={form.published_at}
                  onChange={e => setForm({...form, published_at: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}/>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Banner / Thumbnail Image URL</label>
              <input type="url" value={form.thumbnail_url}
                onChange={e => setForm({...form, thumbnail_url: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                placeholder="Paste image URL or leave blank for text-only card"/>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Brief Excerpt (optional)</label>
              <textarea rows={2} value={form.excerpt}
                onChange={e => setForm({...form, excerpt: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}
                placeholder="First 1-2 lines of your post..."/>
            </div>
            <div className="flex gap-6 flex-wrap">
              <div>
                <label className="text-sm font-medium block mb-1">Access Level</label>
                <select value={form.access_level}
                  onChange={e => setForm({...form, access_level: e.target.value})}
                  className="px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor:'var(--color-border)', background:'var(--color-surface)' }}>
                  <option value="public">Public — visible and clickable to all</option>
                  <option value="premium">Premium — teaser visible, subscribe to open</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer self-end pb-1">
                <input type="checkbox" checked={form.is_featured}
                  onChange={e => setForm({...form, is_featured: e.target.checked})}
                  className="w-4 h-4"/>
                Feature on homepage
              </label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-sm">
                {saving ? 'Saving…' : 'Add Post Card →'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card p-4 animate-pulse h-16"/>)}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-3xl mb-2">📡</p>
          <p className="text-gray-500">No LinkedIn posts added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="card p-4 flex items-center gap-3 flex-wrap">
              {p.thumbnail_url && (
                <img src={p.thumbnail_url} alt=""
                  className="w-14 h-10 object-cover rounded flex-shrink-0"/>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-blue-600">LinkedIn</span>
                  <span className={`badge ${p.access_level === 'premium' ? 'badge-premium' : 'badge-public'}`}>
                    {p.access_level}
                  </span>
                  {p.is_featured && <span className="badge badge-premium">Featured</span>}
                  <span className="text-xs text-gray-400">{formatDate(p.published_at)}</span>
                </div>
                <p className="text-sm font-semibold truncate">{p.title}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                <button onClick={() => toggleAccess(p)}
                  className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-500">
                  {p.access_level === 'public' ? 'Make Premium' : 'Make Public'}
                </button>
                <button onClick={() => toggleFeatured(p)}
                  className="text-xs px-2 py-1 rounded border border-gray-300 text-gray-500">
                  {p.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                <a href={p.url} target="_blank" rel="noreferrer"
                   className="text-xs px-2 py-1 rounded border text-blue-600 border-blue-300">
                  View
                </a>
                <button onClick={() => deletePost(p.id)}
                  className="text-xs px-2 py-1 rounded border text-red-600 border-red-300">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
