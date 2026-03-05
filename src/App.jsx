import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import PageTransition from "./components/common/PageTransition";
import LoadingFallback from "./components/common/LoadingFallback";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import "./App.css";

// Lazy load semua halaman -- hanya didownload saat user mengunjungi route tersebut
const Home = lazy(() => import("./pages/Home"));
const VisiMisi = lazy(() => import("./pages/VisiMisi"));
const StrukturOrganisasi = lazy(() => import("./pages/StrukturOrganisasi"));
const Kegiatan = lazy(() => import("./pages/Kegiatan"));
const SocialImpactAssessment = lazy(
  () => import("./pages/SocialImpactAssessment"),
);
const SocialReturnOnInvestment = lazy(
  () => import("./pages/SocialReturnOnInvestment"),
);
const Kontak = lazy(() => import("./pages/Kontak"));
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      <Navbar />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          {/* AnimatePresence enables exit animations saat route berubah */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                }
              />
              <Route
                path="/tentang/visi-misi"
                element={
                  <PageTransition>
                    <VisiMisi />
                  </PageTransition>
                }
              />
              <Route
                path="/tentang/struktur-organisasi"
                element={
                  <PageTransition>
                    <StrukturOrganisasi />
                  </PageTransition>
                }
              />
              <Route
                path="/kegiatan"
                element={
                  <PageTransition>
                    <Kegiatan />
                  </PageTransition>
                }
              />
              <Route
                path="/kegiatan/social-impact-assessment"
                element={
                  <PageTransition>
                    <SocialImpactAssessment />
                  </PageTransition>
                }
              />
              <Route
                path="/kegiatan/social-return-on-investment"
                element={
                  <PageTransition>
                    <SocialReturnOnInvestment />
                  </PageTransition>
                }
              />
              <Route
                path="/kontak"
                element={
                  <PageTransition>
                    <Kontak />
                  </PageTransition>
                }
              />
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <Login />
                  </PageTransition>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
