import { Link } from 'react-router-dom'
export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">📂</div>
      <h1 className="section-title mb-3">This brief does not exist — yet</h1>
      <p className="mb-8" style={{ color: 'var(--color-text-sub)' }}>
        The page you are looking for may not exist or may have moved.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link to="/"         className="btn-primary text-sm">Go Home</Link>
        <Link to="/library"  className="btn-outline text-sm">Research Library</Link>
        <Link to="/trackers" className="btn-outline text-sm">Live Trackers</Link>
      </div>
    </div>
  )
}
