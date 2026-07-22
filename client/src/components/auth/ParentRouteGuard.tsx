import { Navigate, Outlet } from 'react-router-dom'
import { authService } from '../../services/auth/authService'

function ParentRouteGuard() {
  const session = authService.getSession()

  if (!session || session.role !== 'parent') {
    return <Navigate to="/prijava" replace />
  }

  return <Outlet />
}

export default ParentRouteGuard
