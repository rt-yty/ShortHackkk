import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  authApi, 
  userApi, 
  testApi, 
  gameApi, 
  prizesApi, 
  applicationsApi,
  setTokens,
  clearTokens,
  getAccessToken 
} from '../api/api'

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
  claimedPrizes: [], // список ID полученных призов
  loading: false,
  error: null,
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Сброс ошибки
      clearError: () => set({ error: null }),

      // Загрузка данных пользователя с сервера
      fetchUserData: async () => {
        const token = getAccessToken()
        if (!token) return

        set({ loading: true, error: null })
        try {
          const userData = await userApi.getMe()
          const progress = userData.progress || {}
          const claimedPrizes = await userApi.getClaimedPrizes()
          
          set({
            user: { email: userData.email, id: userData.id },
            isAuthenticated: true,
            isAdmin: userData.is_admin,
            points: progress.points || 0,
            completedTest: progress.completed_test || false,
            testResult: progress.test_result || null,
            completedGame: progress.completed_game || false,
            claimedPrizes: claimedPrizes.map(cp => cp.prize_id),
            loading: false,
          })

          // Проверяем заявку
          const application = await applicationsApi.getMy()
          if (application) {
            set({
              appliedForInternship: true,
              resumeFileName: application.resume_path,
            })
          }
        } catch (error) {
          console.error('Ошибка загрузки данных:', error)
          set({ loading: false, error: error.message })
        }
      },

      // Auth actions
      register: async (email, password) => {
        set({ loading: true, error: null })
        try {
          await authApi.register(email, password)
          
          // Загружаем данные пользователя
          await get().fetchUserData()
          return true
        } catch (error) {
          set({ loading: false, error: error.message })
          return false
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          await authApi.login(email, password)
          
          // Загружаем данные пользователя
          await get().fetchUserData()
          return true
        } catch (error) {
          set({ loading: false, error: error.message })
          return false
        }
      },

      adminLogin: async (username, password) => {
        set({ loading: true, error: null })
        try {
          // Для админа используем специальный email формат
          const adminEmail = username.includes('@') ? username : `${username}@x5.ru`
          await authApi.login(adminEmail, password)
          
          // Загружаем данные пользователя
          await get().fetchUserData()
          
          const state = get()
          if (!state.isAdmin) {
            authApi.logout()
            set({ ...initialState, error: 'Недостаточно прав доступа' })
            return false
          }
          
          return true
        } catch (error) {
          set({ loading: false, error: error.message })
          return false
        }
      },

      logout: () => {
        authApi.logout()
        set({ ...initialState })
      },

      // Points - только для чтения, реальные изменения на сервере
      refreshPoints: async () => {
        try {
          const progress = await userApi.getProgress()
          set({ points: progress.points || 0 })
        } catch (error) {
          console.error('Ошибка обновления баллов:', error)
        }
      },

      // Claim prize через API
      claimPrize: async (prizeId, prizeName, prizePoints) => {
        set({ loading: true, error: null })
        try {
          const result = await prizesApi.claim(prizeId)
          
          set(state => ({
            points: result.remaining_points,
            claimedPrizes: [...state.claimedPrizes, prizeId],
            loading: false,
          }))
          
          return true
        } catch (error) {
          set({ loading: false, error: error.message })
          return false
        }
      },

      hasClaimedPrize: (prizeId) => {
        return get().claimedPrizes.includes(prizeId)
      },

      // Test actions
      completeTest: async (result) => {
        set({ loading: true, error: null })
        try {
          const response = await testApi.complete(result)
          
          set({
            completedTest: true,
            testResult: result,
            points: response.total_points,
            loading: false,
          })
          
          return true
        } catch (error) {
          set({ loading: false, error: error.message })
          return false
        }
      },

      skipTest: async () => {
        set({ loading: true, error: null })
        try {
          await testApi.skip()
          set({ completedTest: true, loading: false })
          return true
        } catch (error) {
          set({ loading: false, error: error.message })
          return false
        }
      },

      setDirection: async (direction) => {
        set({ loading: true, error: null })
        try {
          await testApi.setDirection(direction)
          set({ testResult: direction, loading: false })
          return true
        } catch (error) {
          set({ loading: false, error: error.message })
          return false
        }
      },

      // Game actions
      completeGame: async (gameType, score) => {
        set({ loading: true, error: null })
        try {
          const response = await gameApi.complete(gameType, score)
          
          set({
            completedGame: true,
            points: response.total_points,
            loading: false,
          })
          
          return response
        } catch (error) {
          set({ loading: false, error: error.message })
          return null
        }
      },

      // Application actions
      submitApplication: async (formData) => {
        set({ loading: true, error: null })
        try {
          const response = await applicationsApi.submit(formData)
          
          set({
            appliedForInternship: true,
            points: response.total_points,
            loading: false,
          })
          
          return true
        } catch (error) {
          set({ loading: false, error: error.message })
          return false
        }
      },

      // Reset progress (for testing) - локально
      resetProgress: () => {
        set({
          points: 0,
          completedTest: false,
          testResult: null,
          completedGame: false,
          appliedForInternship: false,
          resumeFileName: null,
          claimedPrizes: [],
        })
      },

      // Инициализация при запуске
      initializeAuth: async () => {
        const token = getAccessToken()
        if (token) {
          await get().fetchUserData()
        }
      },
    }),
    {
      name: 'x5-user-storage',
      // Сохраняем только базовые данные, остальное подгружаем с сервера
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
)
