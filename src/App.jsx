import { Routes, Route } from 'react-router-dom'
import { PersonaProvider } from './context/PersonaContext'
import { AuthProvider }    from './context/AuthContext'
import Layout              from './components/layout/Layout'
import AdminGuard          from './components/admin/AdminGuard'

// Pages
import HomePage      from './pages/HomePage'
import LibraryPage   from './pages/LibraryPage'
import TrackersPage  from './pages/TrackersPage'
import TrackerDetail from './pages/TrackerDetail'
import ToolsPage     from './pages/ToolsPage'
import ContentPage   from './pages/ContentPage'
import AboutPage     from './pages/AboutPage'
import ResumePage    from './pages/ResumePage'
import SubscribePage from './pages/SubscribePage'
import ContactPage   from './pages/ContactPage'
import AdminPage     from './pages/AdminPage'
import NotFoundPage  from './pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      <PersonaProvider>
        <Routes>
          {/* Public routes wrapped in Layout */}
          <Route path="/" element={<Layout />}>
            <Route index                    element={<HomePage />} />
            <Route path="library"           element={<LibraryPage />} />
            <Route path="trackers"          element={<TrackersPage />} />
            <Route path="trackers/:slug"    element={<TrackerDetail />} />
            <Route path="tools"             element={<ToolsPage />} />
            <Route path="content"           element={<ContentPage />} />
            <Route path="about"             element={<AboutPage />} />
            <Route path="resume"            element={<ResumePage />} />
            <Route path="subscribe"         element={<SubscribePage />} />
            <Route path="contact"           element={<ContactPage />} />
            <Route path="*"                 element={<NotFoundPage />} />
          </Route>
          {/* Admin — protected, no public layout */}
          <Route path="/admin/*" element={
            <AdminGuard>
              <AdminPage />
            </AdminGuard>
          } />
        </Routes>
      </PersonaProvider>
    </AuthProvider>
  )
}
