import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function ToolsPage() {
  const [tools, setTools]       = useState([])
  const [filter, setFilter]     = useState('all')
  const [categories, setCategories] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase.from('tools').select('*').order('display_order')
      .then(({ data }) => {
        setTools(data || [])
        const cats = [...new Set((data||[]).map(t => t.category).filter(Boolean))]
        setCategories(cats)
        setLoading(false)
      })
  }, [])

  const shown = filter === 'all' ? tools : tools.filter(t => t.category === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Fullstack Tools</h1>
        <p style={{ color: 'var(--color-text-sub)' }}>
          Live working tools — click "Try it" to use directly in your browser.
          No sign-in required. Built with React, Python, and Cloudflare.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setFilter('all')}
          className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
          style={{
            background:  filter === 'all' ? 'var(--color-accent)' : 'transparent',
            color:       filter === 'all' ? 'var(--color-primary)' : 'var(--color-accent)',
            borderColor: 'var(--color-accent)',
          }}>
          All Tools
        </button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
            style={{
              background:  filter === c ? 'var(--color-accent)' : 'transparent',
              color:       filter === c ? 'var(--color-primary)' : 'var(--color-accent)',
              borderColor: 'var(--color-accent)',
            }}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-5">
          {[1,2,3].map(i => (
            <div key={i} className="card p-6 animate-pulse h-48">
              <div className="h-5 bg-gray-200 rounded mb-3 w-2/3"/>
              <div className="h-3 bg-gray-100 rounded mb-2"/>
            </div>
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🛠</p>
          <p style={{ color: 'var(--color-text-sub)' }}>Tools launching soon.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {shown.map(tool => (
            <div key={tool.id} className={`card p-6 ${tool.is_featured ? 'ring-2' : ''}`}
                 style={tool.is_featured ? { ringColor: 'var(--color-accent)' } : {}}>
              {tool.is_featured && (
                <span className="badge badge-premium mb-3">Featured Tool</span>
              )}
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-text-main)' }}>
                {tool.name}
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--color-text-sub)' }}>
                {tool.description}
              </p>
              {tool.tech_stack?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {tool.tech_stack.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded font-mono"
                      style={{ background: 'var(--color-surface)', color: 'var(--color-muted)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                {tool.demo_url && (
                  <a href={tool.demo_url} target="_blank" rel="noreferrer"
                     className="btn-primary text-sm">
                    Try it Live →
                  </a>
                )}
                {tool.github_url && (
                  <a href={tool.github_url} target="_blank" rel="noreferrer"
                     className="btn-outline text-sm">
                    View Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
