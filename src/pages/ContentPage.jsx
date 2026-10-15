import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from '../context/AuthContext'
import { formatDate, truncate } from '../utils/helpers'
import { SITE } from '../data/siteConfig'
import { Link } from 'react-router-dom'

// ── Substack RSS fetch ────────────────────────────────────────
async function fetchSubstack() {
  try {
    const res  = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SITE.substackRSS)}`
    )
    const json = await res.json()
    return (json.items || []).map(item => ({
      id:           item.guid,
      type:         'substack',
      title:        item.title,
      url:          item.link,
      thumbnail_url: item.thumbnail || item.enclosure?.link || '',
      excerpt:      item.description?.replace(/<[^>]+>/g,'').slice(0,140) || '',
      published_at: item.pubDate,
      access_level: 'public',
    }))
  } catch {
    return [] // silent fallback — cached entries shown
  }
}

export default function ContentPage() {
  const { isSubscriber } = useAuth()
  const [tab, setTab]           = useState('all')
  const [linkedin, setLinkedin] = useState([])
  const [substack, setSubstack] = useState([])
  const [loading, setLoading]   = useState(true)
  const [cachedSub, setCachedSub] = useState([])
  const [rssError, setRssError] = useState(false)

  useEffect(() => {
    async function load() {
      // LinkedIn from Supabase
      const { data: li } = await supabase
        .from('content_feed')
        .select('*')
        .eq('type', 'linkedin')
        .order('published_at', { ascending: false })
      setLinkedin(li || [])

      // Substack from RSS
      const sub = await fetchSubstack()
      if (sub.length) {
        setSubstack(sub)
        setRssError(false)
      } else {
        // Fallback to Supabase cached
        const { data: cached } = await supabase
          .from('content_feed')
          .select('*')
          .eq('type', 'substack')
          .order('published_at', { ascending: false })
        setCachedSub(cached || [])
        setRssError(true)
      }
      setLoading(false)
    }
    load()
  }, [])

  const allItems = [
    ...linkedin.map(l => ({ ...l, source: 'LinkedIn' })),
    ...( substack.length ? substack : cachedSub ).map(s => ({ ...s, source: 'Substack' })),
  ].sort((a,b) => new Date(b.published_at) - new Date(a.published_at))

  const shown = tab === 'all' ? allItems
              : tab === 'linkedin' ? linkedin.map(l => ({...l,source:'LinkedIn'}))
              : (substack.length ? substack : cachedSub).map(s => ({...s,source:'Substack'}))

  function ContentCard({ item }) {
    const isPremiumLocked = item.access_level === 'premium' && !isSubscriber
    return (
      <div className="card overflow-hidden">
        {item.thumbnail_url && (
          <div className="h-40 overflow-hidden bg-gray-100">
            <img src={item.thumbnail_url} alt={item.title}
                 className="w-full h-full object-cover"/>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ background: item.source === 'LinkedIn' ? '#0A66C2' : '#FF6719',
                       color: 'white' }}>
              {item.source}
            </span>
            <span className="text-xs text-gray-400">{formatDate(item.published_at)}</span>
          </div>
          <h3 className="font-semibold text-sm mb-2 leading-snug"
              style={{ color: 'var(--color-text-main)' }}>
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-sub)' }}>
              {truncate(item.excerpt, 100)}
            </p>
          )}
          {isPremiumLocked ? (
            <div>
              <p className="text-xs text-gray-400 mb-2">🔒 Premium content</p>
              <Link to="/subscribe" className="btn-primary text-xs w-full text-center block">
                Subscribe to Read
              </Link>
            </div>
          ) : (
            <a href={item.url} target="_blank" rel="noreferrer"
               className="text-xs font-semibold hover:underline"
               style={{ color: 'var(--color-accent)' }}>
              Read on {item.source} →
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Content Feed</h1>
        <p style={{ color: 'var(--color-text-sub)' }}>
          Latest dispatches from LinkedIn and Substack — updated automatically.
        </p>
        {rssError && (
          <p className="text-xs text-orange-500 mt-2">
            ⚠ Live Substack feed unavailable. Showing last cached articles.
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { id: 'all',       label: `All (${allItems.length})` },
          { id: 'linkedin',  label: `LinkedIn (${linkedin.length})` },
          { id: 'substack',  label: `Substack` },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: tab === t.id ? 'var(--color-accent)' : 'var(--color-card-bg)',
              color:      tab === t.id ? 'var(--color-primary)' : 'var(--color-text-sub)',
              border:     '1px solid var(--color-border)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card p-5 animate-pulse h-48">
              <div className="h-4 bg-gray-200 rounded mb-3"/>
              <div className="h-3 bg-gray-100 rounded mb-2"/>
            </div>
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📡</p>
          <p style={{ color: 'var(--color-text-sub)' }}>No content yet. Check back soon.</p>
          <div className="flex gap-3 justify-center mt-4 flex-wrap">
            <a href={SITE.substack} target="_blank" rel="noreferrer" className="btn-outline text-sm">
              Follow on Substack
            </a>
            <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="btn-primary text-sm">
              Follow on LinkedIn
            </a>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((item, i) => <ContentCard key={item.id || i} item={item}/>)}
        </div>
      )}
    </div>
  )
}
