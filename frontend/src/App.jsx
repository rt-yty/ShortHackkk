import { Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from './stores/userStore'

// Pages
import AuthPage from './pages/auth/AuthPage'
import RegisterPage from './pages/auth/RegisterPage'
import LoginPage from './pages/auth/LoginPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import TestPage from './pages/test/TestPage'
import TestResultPage from './pages/test/TestResultPage'
import DirectionSelectPage from './pages/test/DirectionSelectPage'
import BugCatcherGame from './pages/games/BugCatcherGame'
import ColorMatchGame from './pages/games/ColorMatchGame'
import ApplicationPage from './pages/application/ApplicationPage'
import RewardsPage from './pages/rewards/RewardsPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import AdminDashboard from './pages/admin/AdminDashboard'

// Components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  const { isAuthenticated, isAdmin } = useUserStore()

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/admin-login" element={!isAdmin ? <AdminLoginPage /> : <Navigate to="/admin" />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/result" element={<TestResultPage />} />
          <Route path="/direction-select" element={<DirectionSelectPage />} />
          <Route path="/game/bug-catcher" element={<BugCatcherGame />} />
          <Route path="/game/color-match" element={<ColorMatchGame />} />
          <Route path="/application" element={<ApplicationPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App

