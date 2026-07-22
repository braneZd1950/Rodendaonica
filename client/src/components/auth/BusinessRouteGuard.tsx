import { Navigate, Outlet } from 'react-router-dom'
import { authService } from '../../services/auth/authService'

function BusinessRouteGuard() {
  const session = authService.getSession()

  if (!session || session.role !== 'business') {
    return <Navigate to="/prijava" replace />
  }

  return <Outlet />
}

export default BusinessRouteGuard
