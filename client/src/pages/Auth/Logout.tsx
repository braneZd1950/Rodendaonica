import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth/authService'

function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    authService.logout()
    navigate('/prijava', { replace: true })
  }, [navigate])

  return null
}

export default Logout
