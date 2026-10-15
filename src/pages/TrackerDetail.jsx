import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useAuth } from '../context/AuthContext'
import { formatDate } from '../utils/helpers'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TrackerDetail() {
  const { slug } = useParams()
  const { isSubscriber } = useAuth()
  const [tracker, setTracker]   = useState(null)
  const [updates, setUpdates]   = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const { data: t } = await supabase
        .from('trackers').select('*').eq('slug', slug).single()
      setTracker(t)
      if (t) {
        const { data: u } = await supabase
          .from('tracker_updates')
          .select('*')
          .eq('tracker_id', t.id)
          .order('created_at', { ascending: true })
        setUpdates(u || [])
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"/>
      <div className="h-4 bg-gray-100 rounded mb-2"/>
      <div className="h-4 bg-gray-100 rounded w-1/2"/>
    </div>
  )

  if (!tracker) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-4xl mb-3">🔍</p>
      <h2 className="text-xl font-bold mb-2">Tracker not found</h2>
      <Link to="/trackers" className="btn-primary mt-4 inline-block text-sm">
        Back to All Trackers
      </Link>
    </div>
  )

  const isPremiumLocked = tracker.access_level === 'premium' && !isSubscriber
  const latest = updates[updates.length - 1]
  const chartData = updates.map(u => ({ month: u.month, score: u.progress_score }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link to="/trackers" className="text-sm mb-4 inline-block"
          style={{ color: 'var(--color-accent)' }}>
          ← All Trackers
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="section-title mb-2">{tracker.name}</h1>
            <p style={{ color: 'var(--color-text-sub)' }}>{tracker.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`badge ${tracker.access_level === 'premium' ? 'badge-premium' : 'badge-public'}`}>
              {tracker.access_level === 'premium' ? 'Premium' : 'Public'}
            </span>
            <span className="text-xs text-gray-400">
              Last updated: {formatDate(tracker.last_updated) || 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="font-semibold mb-4">Implementation Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee"/>
              <XAxis dataKey="month" tick={{ fontSize: 11 }}/>
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }}/>
              <Tooltip/>
              <Line type="monotone" dataKey="score" stroke="var(--color-accent)"
                strokeWidth={2} dot={{ fill: 'var(--color-accent)' }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Latest Update */}
      {isPremiumLocked ? (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-bold text-xl mb-2">Full Data — Premium Access</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-sub)' }}>
            District-level data, gap analysis, and decision recommendations
            are available to premium subscribers.
          </p>
          <Link to="/subscribe" className="btn-primary">
            Subscribe from Rs. 499/month →
          </Link>
        </div>
      ) : latest ? (
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-1">{latest.month} Update</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {latest.progress_score}%
              </div>
              <div className="text-sm text-gray-400">overall implementation score</div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-1 text-green-600">✓ What Improved</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-sub)' }}>{latest.what_improved}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 text-orange-500">⚠ What Remains</h4>
                <p className="text-sm" style={{ color: 'var(--color-text-sub)' }}>{latest.what_remaining}</p>
              </div>
            </div>
          </div>
          {latest.gap_analysis && (
            <div className="card p-6">
              <h4 className="font-semibold mb-2">Gap Analysis</h4>
              <p className="text-sm" style={{ color: 'var(--color-text-sub)' }}>{latest.gap_analysis}</p>
            </div>
          )}
          {latest.recommendation && (
            <div className="card p-6" style={{ borderLeft: '4px solid var(--color-accent)' }}>
              <h4 className="font-semibold mb-2">Decision Recommendation</h4>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>
                {latest.recommendation}
              </p>
            </div>
          )}
          {latest.supporting_pdf_url && (
            <a href={latest.supporting_pdf_url} target="_blank" rel="noreferrer"
               className="btn-outline inline-block text-sm">
              Download Supporting Report
            </a>
          )}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-gray-400">First monthly update coming soon.</p>
        </div>
      )}
    </div>
  )
}
