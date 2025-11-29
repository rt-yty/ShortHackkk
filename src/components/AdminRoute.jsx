import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '../stores/userStore'

function AdminRoute() {
  const { isAuthenticated, isAdmin } = useUserStore()

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute

