import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import VisiMisi from './pages/VisiMisi'
import StrukturOrganisasi from './pages/StrukturOrganisasi'
import Kegiatan from './pages/Kegiatan'
import SocialImpactAssessment from './pages/SocialImpactAssessment'
import SocialReturnOnInvestment from './pages/SocialReturnOnInvestment'
import Kontak from './pages/Kontak'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/admin/ProtectedRoute'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentang/visi-misi" element={<VisiMisi />} />
          <Route path="/tentang/struktur-organisasi" element={<StrukturOrganisasi />} />
          <Route path="/kegiatan" element={<Kegiatan />} />
          <Route path="/kegiatan/social-impact-assessment" element={<SocialImpactAssessment />} />
          <Route
            path="/kegiatan/social-return-on-investment"
            element={<SocialReturnOnInvestment />}
          />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  )
}

export default App
