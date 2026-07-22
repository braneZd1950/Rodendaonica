import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="main main--auth">
      <Outlet />
    </main>
  )
}

export default AuthLayout
