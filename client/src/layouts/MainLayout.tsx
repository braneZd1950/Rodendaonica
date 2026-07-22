import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header/Header'
import Footer from '../components/landing/Footer'
import { authService } from '../services/auth/authService'

function MainLayout() {
  const session = authService.getSession()
  const headerVariant =
    session?.role === 'parent' ? 'parent' : session?.role === 'business' ? 'business' : 'public'

  return (
    <>
      <Header variant={headerVariant} />
      <main className="main main--landing">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
