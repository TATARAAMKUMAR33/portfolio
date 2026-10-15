import { format, parseISO } from 'date-fns'

export function formatDate(dateStr) {
  try { return format(parseISO(dateStr), 'dd MMM yyyy') }
  catch { return dateStr || '' }
}

export function truncate(str, n = 120) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function accessBadgeClass(level) {
  const map = { public: 'badge-public', premium: 'badge-premium', recruiter: 'badge-recruiter' }
  return 'badge ' + (map[level] || 'badge-public')
}

export function accessLabel(level) {
  const map = { public: 'Free', premium: 'Premium', recruiter: 'Recruiter' }
  return map[level] || 'Free'
}
