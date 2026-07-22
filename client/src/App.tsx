import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ScrollToTop from './components/common/ScrollToTop'
import ConsentBanner from './components/common/ConsentBanner'
import DevModeBanner from './components/common/DevModeBanner'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AUTH_UNAUTHORIZED_EVENT } from './constants/events'
import { ROUTES } from './constants/routes'
import { CONSENT_UPDATED_EVENT, readConsent, type ConsentState } from './lib/consent'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import ParentLayout from './layouts/ParentLayout'
import BusinessLayout from './layouts/BusinessLayout'
import ParentRouteGuard from './components/auth/ParentRouteGuard'
import BusinessRouteGuard from './components/auth/BusinessRouteGuard'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import Logout from './pages/Auth/Logout'
import Home from './pages/Home/Home'
import Venues from './pages/Venues/Venues'
import VenueDetails from './pages/Venues/VenueDetails'
import HowItWorks from './pages/HowItWorks/HowItWorks'
import Pricing from './pages/Pricing/Pricing'
import ForParents from './pages/ForParents/ForParents'
import ForBusiness from './pages/ForBusiness/ForBusiness'
import Book from './pages/Book/Book'
import Terms from './pages/Legal/Terms'
import Privacy from './pages/Legal/Privacy'
import Cookies from './pages/Legal/Cookies'
import NotFound from './pages/NotFound/NotFound'
import ParentProfile from './pages/Parent/ParentProfile'
import ParentReservations from './pages/Parent/ParentReservations'
import ParentMessages from './pages/Parent/ParentMessages'
import BusinessDashboard from './pages/Business/BusinessDashboard'
import BusinessCalendar from './pages/Business/BusinessCalendar'
import BusinessMessages from './pages/Business/BusinessMessages'
import BusinessReviews from './pages/Business/BusinessReviews'
import BusinessReservations from './pages/Business/BusinessReservations'
import BusinessSettings from './pages/Business/BusinessSettings'
import BusinessVenueCatalog from './pages/Business/BusinessVenueCatalog'

function AuthUnauthorizedListener() {
  const navigate = useNavigate()

  useEffect(() => {
    const onUnauthorized = () => navigate(ROUTES.login, { replace: true })
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
  }, [navigate])

  return null
}

function App() {
  useEffect(() => {
    const applyConsent = (consent: ConsentState | null) => {
      window.dispatchEvent(
        new CustomEvent('rodendaonica:analytics-enabled', {
          detail: { enabled: Boolean(consent?.cookies.analytics) },
        }),
      )
      window.dispatchEvent(
        new CustomEvent('rodendaonica:marketing-enabled', {
          detail: { enabled: Boolean(consent?.cookies.marketing) },
        }),
      )
    }

    applyConsent(readConsent())

    const onConsentUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentState>
      applyConsent(customEvent.detail ?? readConsent())
    }

    window.addEventListener(CONSENT_UPDATED_EVENT, onConsentUpdated)
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, onConsentUpdated)
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthUnauthorizedListener />
        <DevModeBanner />
        <ScrollToTop />
        <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/igraonice" element={<Venues />} />
          <Route path="/igraonice/:slug" element={<VenueDetails />} />
          <Route path="/kako-funkcionira" element={<HowItWorks />} />
          <Route path="/cijene" element={<Pricing />} />
          <Route path="/za-roditelje" element={<ForParents />} />
          <Route path="/za-igraonice" element={<ForBusiness />} />
          <Route path="/rezerviraj" element={<Book />} />
          <Route path="/uvjeti" element={<Terms />} />
          <Route path="/privatnost" element={<Privacy />} />
          <Route path="/kolacici" element={<Cookies />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/prijava" element={<Login />} />
          <Route path="/registracija" element={<Register />} />
          <Route path="/zaboravljena-lozinka" element={<ForgotPassword />} />
          <Route path="/reset-lozinke" element={<ResetPassword />} />
          <Route path="/odjava" element={<Logout />} />
        </Route>

        <Route element={<ParentRouteGuard />}>
          <Route element={<ParentLayout />}>
            <Route path="/profil" element={<ParentProfile />} />
            <Route path="/rezervacije" element={<ParentReservations />} />
            <Route path="/poruke" element={<ParentMessages />} />
          </Route>
        </Route>

        <Route element={<BusinessRouteGuard />}>
          <Route element={<BusinessLayout />}>
            <Route path="/dashboard" element={<BusinessDashboard />} />
            <Route
              path="/kalendar"
              element={<BusinessCalendar />}
            />
            <Route path="/poslovne-rezervacije" element={<BusinessReservations />} />
            <Route path="/postavke-igraonice" element={<BusinessSettings />} />
            <Route path="/postavke-igraonice/katalog" element={<BusinessVenueCatalog />} />
            <Route path="/poslovne-poruke" element={<BusinessMessages />} />
            <Route path="/recenzije" element={<BusinessReviews />} />
          </Route>
        </Route>
      </Routes>
        <ConsentBanner />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
