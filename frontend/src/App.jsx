import { useEffect, useState } from 'react'
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
  const { isAuthenticated, isAdmin, initializeAuth } = useUserStore()
  const [isInitializing, setIsInitializing] = useState(true)

  // Инициализация авторизации при загрузке приложения
  useEffect(() => {
    const init = async () => {
      await initializeAuth()
      setIsInitializing(false)
    }
    init()
  }, [initializeAuth])

  // Показываем загрузку пока инициализируемся
  if (isInitializing) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        Загрузка...
      </div>
    )
  }

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

