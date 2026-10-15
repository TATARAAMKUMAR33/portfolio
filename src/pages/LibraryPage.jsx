import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from '../context/AuthContext'
import { formatDate, accessBadgeClass, accessLabel, truncate } from '../utils/helpers'
import { Link } from 'react-router-dom'

export default function LibraryPage() {
  const { isSubscriber } = useAuth()
  const [briefs, setBriefs]         = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeAccess, setActiveAccess]     = useState('all')
  const [search, setSearch]         = useState('')
  const [sort, setSort]             = useState('newest')
  const [loading, setLoading]       = useState(true)
  const [preview, setPreview]       = useState(null)  // brief being previewed

  useEffect(() => {
    fetchCategories()
    fetchBriefs()
  }, [activeCategory, activeAccess, sort])

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('display_order')
    setCategories(data || [])
  }

  async function fetchBriefs() {
    setLoading(true)
    let q = supabase.from('briefs').select('*')
    if (activeCategory !== 'all') q = q.eq('category_id', activeCategory)
    if (activeAccess   !== 'all') q = q.eq('access_level', activeAccess)
    if (sort === 'newest')   q = q.order('published_at', { ascending: false })
    if (sort === 'downloads') q = q.order('download_count', { ascending: false })
    const { data } = await q
    setBriefs(data || [])
    setLoading(false)
  }

  const filtered = briefs.filter(b =>
    !search ||
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.summary?.toLowerCase().includes(search.toLowerCase()) ||
    b.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  function canAccess(level) {
    if (level === 'public') return true
    if (level === 'premium') return isSubscriber
    return false
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Research Intelligence Library</h1>
        <p style={{ color: 'var(--color-text-sub)' }}>
          Browse, preview, and download research briefs. Free briefs available to all.
          Premium briefs require a subscription.
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search briefs, tags, summaries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border text-sm"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
        />
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}>
          <option value="newest">Newest First</option>
          <option value="downloads">Most Downloaded</option>
        </select>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
            activeCategory === 'all' ? 'text-white' : 'text-gray-500'
          }`}
          style={{
            background:  activeCategory === 'all' ? 'var(--color-accent)' : 'transparent',
            borderColor: 'var(--color-accent)',
            color:       activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-accent)',
          }}>
          All Topics
        </button>
        {categories.map(c => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)}
            className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
            style={{
              background:  activeCategory === c.id ? 'var(--color-accent)' : 'transparent',
              borderColor: 'var(--color-accent)',
              color:       activeCategory === c.id ? 'var(--color-primary)' : 'var(--color-accent)',
            }}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Access Filters */}
      <div className="flex gap-2 mb-8">
        {['all','public','premium'].map(a => (
          <button key={a} onClick={() => setActiveAccess(a)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
              activeAccess === a
                ? 'bg-navy text-white border-navy'
                : 'text-gray-500 border-gray-300'
            }`}>
            {a === 'all' ? 'All Access' : a === 'public' ? 'Free' : 'Premium'}
          </button>
        ))}
      </div>

      {/* Brief Cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"/>
              <div className="h-3 bg-gray-100 rounded mb-2"/>
              <div className="h-3 bg-gray-100 rounded w-2/3"/>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📂</p>
          <p style={{ color: 'var(--color-text-sub)' }}>No briefs found. Try changing filters.</p>
          <Link to="/contact" className="btn-primary mt-4 inline-block text-sm">
            Request a Brief
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(brief => {
            const accessible = canAccess(brief.access_level)
            return (
              <div key={brief.id} className="card p-5 flex flex-col">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <span className={accessBadgeClass(brief.access_level)}>
                    {accessLabel(brief.access_level)}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(brief.published_at)}</span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-base mb-2 leading-snug"
                    style={{ color: 'var(--color-text-main)' }}>
                  {brief.title}
                </h3>

                {/* Summary */}
                <p className="text-sm mb-3 flex-1" style={{ color: 'var(--color-text-sub)' }}>
                  {truncate(brief.summary, 100)}
                </p>

                {/* Tags */}
                {brief.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {brief.tags.slice(0,3).map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded"
                        style={{ background: 'var(--color-surface)', color: 'var(--color-muted)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {accessible ? (
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => setPreview(brief)}
                      className="btn-outline text-xs flex-1">
                      Preview
                    </button>
                    <a href={brief.pdf_url} target="_blank" rel="noreferrer"
                       className="btn-primary text-xs flex-1 text-center">
                      Download
                    </a>
                  </div>
                ) : (
                  <div className="mt-auto">
                    <div className="text-xs text-gray-400 mb-2">
                      🔒 Premium subscribers only
                    </div>
                    <Link to="/subscribe" className="btn-primary text-xs w-full text-center block">
                      Subscribe to Access
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setPreview(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
            <span className={accessBadgeClass(preview.access_level)}>
              {accessLabel(preview.access_level)}
            </span>
            <h2 className="font-bold text-xl mt-3 mb-2 text-navy-DEFAULT">{preview.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{formatDate(preview.published_at)}</p>
            <p className="text-gray-700 mb-6">{preview.summary}</p>
            {preview.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {preview.tags.map(t => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <a href={preview.pdf_url} target="_blank" rel="noreferrer"
                 className="btn-primary flex-1 text-center text-sm">
                Download Full PDF
              </a>
              <button onClick={() => setPreview(null)}
                className="btn-outline flex-1 text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
