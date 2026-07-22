import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header/Header'
import Footer from '../components/landing/Footer'

function BusinessLayout() {
  return (
    <>
      <Header variant="business" />
      <main className="main main--landing">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default BusinessLayout
