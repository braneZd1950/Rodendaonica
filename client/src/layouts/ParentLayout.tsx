import { Outlet } from 'react-router-dom'
import PendingBookingHandler from '../components/booking/PendingBookingHandler'
import Header from '../components/common/Header/Header'
import Footer from '../components/landing/Footer'

function ParentLayout() {
  return (
    <>
      <Header variant="parent" />
      <PendingBookingHandler />
      <main className="main main--landing">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default ParentLayout
