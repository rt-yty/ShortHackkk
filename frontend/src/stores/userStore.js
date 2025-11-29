import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  points: 0,
  completedTest: false,
  testResult: null, // 'developer' | 'designer'
  completedGame: false,
  appliedForInternship: false,
  resumeFileName: null,
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Auth actions
      register: (email, password) => {
        const user = { email, password, createdAt: new Date().toISOString() }
        set({ user, isAuthenticated: true, isAdmin: false })
        
        // Track registration in analytics
        const analytics = JSON.parse(localStorage.getItem('x5-analytics') || '{}')
        analytics.registrations = (analytics.registrations || 0) + 1
        analytics.users = analytics.users || []
        analytics.users.push({ email, registeredAt: user.createdAt })
        localStorage.setItem('x5-analytics', JSON.stringify(analytics))
        
        return true
      },

      login: (email, password) => {
        const analytics = JSON.parse(localStorage.getItem('x5-analytics') || '{}')
        const existingUser = analytics.users?.find(u => u.email === email)
        
        if (existingUser) {
          set({ 
            user: { email }, 
            isAuthenticated: true, 
            isAdmin: false 
          })
          return true
        }
        return false
      },

      adminLogin: (username, password) => {
        if (username === 'admin' && password === 'admin') {
          set({ 
            user: { email: 'admin@x5.ru' }, 
            isAuthenticated: true, 
            isAdmin: true 
          })
          return true
        }
        return false
      },

      logout: () => {
        set({ ...initialState })
      },

      // Points actions
      addPoints: (amount) => {
        set((state) => ({ points: state.points + amount }))
      },

      // Test actions
      completeTest: (result) => {
        set({ completedTest: true, testResult: result })
        get().addPoints(15)
        
        // Track in analytics
        const analytics = JSON.parse(localStorage.getItem('x5-analytics') || '{}')
        analytics.testsCompleted = (analytics.testsCompleted || 0) + 1
        localStorage.setItem('x5-analytics', JSON.stringify(analytics))
      },

      skipTest: () => {
        set({ completedTest: true })
      },

      setDirection: (direction) => {
        set({ testResult: direction })
      },

      // Game actions
      completeGame: (score) => {
        set({ completedGame: true })
        const bonusPoints = Math.min(Math.floor(score / 2), 25)
        get().addPoints(25 + bonusPoints)
        
        // Track in analytics
        const analytics = JSON.parse(localStorage.getItem('x5-analytics') || '{}')
        analytics.gamesCompleted = (analytics.gamesCompleted || 0) + 1
        localStorage.setItem('x5-analytics', JSON.stringify(analytics))
      },

      // Application actions
      submitApplication: (resumeFileName) => {
        set({ appliedForInternship: true, resumeFileName })
        get().addPoints(35)
        
        // Track in analytics
        const analytics = JSON.parse(localStorage.getItem('x5-analytics') || '{}')
        analytics.applications = (analytics.applications || 0) + 1
        localStorage.setItem('x5-analytics', JSON.stringify(analytics))
      },

      // Reset progress (for testing)
      resetProgress: () => {
        set({
          points: 0,
          completedTest: false,
          testResult: null,
          completedGame: false,
          appliedForInternship: false,
          resumeFileName: null,
        })
      },
    }),
    {
      name: 'x5-user-storage',
    }
  )
)

