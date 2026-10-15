import { Outlet } from 'react-router-dom'
import Navbar  from './Navbar'
import Footer  from './Footer'
import PersonaBar from './PersonaBar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-surface)' }}>
      <PersonaBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
