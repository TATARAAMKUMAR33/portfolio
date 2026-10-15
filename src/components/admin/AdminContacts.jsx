import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import { formatDate } from '../../utils/helpers'

const STATUS_COLORS = {
  new:         'bg-blue-100 text-blue-700',
  replied:     'bg-green-100 text-green-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  closed:      'bg-gray-100 text-gray-500',
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { fetchContacts() }, [])

  async function fetchContacts() {
    setLoading(true)
    const { data } = await supabase.from('contact_requests')
      .select('*').order('created_at', { ascending: false })
    setContacts(data || [])
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('contact_requests').update({ status }).eq('id', id)
    fetchContacts()
  }

  const shown = filter === 'all' ? contacts : contacts.filter(c => c.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Contact Enquiries</h2>
          <p className="text-sm text-gray-500 mt-1">
            All submissions from the contact form. Reply via email — update status here to track.
          </p>
        </div>
        <div className="text-sm font-semibold px-3 py-1 rounded"
             style={{ background:'var(--color-surface)', color:'var(--color-accent)' }}>
          {contacts.filter(c => c.status === 'new').length} new
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all','new','replied','in_progress','closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              filter === f ? 'text-white border-transparent' : 'text-gray-500 border-gray-300'
            }`}
            style={filter === f ? { background:'var(--color-primary)' } : {}}>
            {f === 'all' ? `All (${contacts.length})` : f.replace('_',' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card p-4 animate-pulse h-16"/>)}</div>
      ) : shown.length === 0 ? (
        <div className="text-center py-12 card">
          <p className="text-3xl mb-2">📬</p>
          <p className="text-gray-500">No enquiries {filter !== 'all' ? `with status "${filter}"` : 'yet'}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map(c => (
            <div key={c.id} className="card overflow-hidden">
              <div className="p-4 flex items-start justify-between gap-3 flex-wrap cursor-pointer"
                   onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`badge text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[c.status] || STATUS_COLORS.new}`}>
                      {(c.status || 'new').replace('_',' ')}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {c.inquiry_type}
                    </span>
                  </div>
                  <p className="font-semibold text-sm">{c.name}
                    {c.organisation && <span className="text-gray-400 font-normal"> · {c.organisation}</span>}
                  </p>
                  <p className="text-xs text-gray-400">{c.email}</p>
                </div>
                <span className="text-gray-400 text-sm">{expanded === c.id ? '▲' : '▼'}</span>
              </div>

              {expanded === c.id && (
                <div className="px-4 pb-4 border-t" style={{ borderColor:'var(--color-border)' }}>
                  <p className="text-sm mt-3 mb-4 whitespace-pre-wrap"
                     style={{ color:'var(--color-text-sub)' }}>
                    {c.message}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <a href={`mailto:${c.email}?subject=Re: ${c.inquiry_type}`}
                       className="btn-primary text-xs">
                      Reply via Email →
                    </a>
                    {['new','in_progress','replied','closed'].map(s => (
                      <button key={s} onClick={() => updateStatus(c.id, s)}
                        className={`text-xs px-2 py-1 rounded border transition-all ${
                          c.status === s ? 'font-bold border-gray-400 bg-gray-100' : 'border-gray-300 text-gray-500'
                        }`}>
                        Mark: {s.replace('_',' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
