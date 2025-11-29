import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'

function ProtectedRoute() {
  const { isAuthenticated, isAdmin } = useUserStore()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

