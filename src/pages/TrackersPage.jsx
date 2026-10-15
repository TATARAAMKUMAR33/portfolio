import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { formatDate } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

export default function TrackersPage() {
  const [trackers, setTrackers] = useState([])
  const [loading, setLoading]   = useState(true)
  const { isSubscriber } = useAuth()

  useEffect(() => {
    supabase.from('trackers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setTrackers(data || []); setLoading(false) })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-2">Live Intelligence Trackers</h1>
        <p style={{ color: 'var(--color-text-sub)' }}>
          Monthly-updated policy scorecards, execution gap trackers, and sector intelligence.
          Public summaries free. District and panchayat data for subscribers.
        </p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"/>
              <div className="h-3 bg-gray-100 rounded mb-2"/>
              <div className="h-3 bg-gray-100 rounded w-1/2"/>
            </div>
          ))}
        </div>
      ) : trackers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📊</p>
          <p style={{ color: 'var(--color-text-sub)' }}>Trackers launching soon. Check back next week.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trackers.map(t => (
            <Link key={t.id} to={`/trackers/${t.slug}`} className="card p-6 block group">
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${t.access_level === 'premium' ? 'badge-premium' : 'badge-public'}`}>
                  {t.access_level === 'premium' ? 'Premium' : 'Public'}
                </span>
                <span className="text-xs text-gray-400">
                  {t.update_frequency}
                </span>
              </div>
              <h3 className="font-bold text-base mb-2 group-hover:underline"
                  style={{ color: 'var(--color-text-main)' }}>
                {t.name}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-sub)' }}>
                {t.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Updated: {formatDate(t.last_updated) || 'Pending'}
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isSubscriber && (
        <div className="mt-12 card p-8 text-center">
          <h3 className="font-bold text-xl mb-2">Unlock District + Panchayat Level Data</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-sub)' }}>
            Premium subscribers see the full tracker data — district, municipality,
            and panchayat level — plus gap analysis and decision recommendations.
          </p>
          <Link to="/subscribe" className="btn-primary">Subscribe from Rs. 499/month →</Link>
        </div>
      )}
    </div>
  )
}
