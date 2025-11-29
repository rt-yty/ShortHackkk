import { create } from 'zustand'
import { adminApi, prizesApi, testApi } from '../api/api'

// Дефолтные вопросы теста для fallback
const defaultTestQuestions = [
  {
    id: 1,
    question: 'Что вас больше привлекает в работе?',
    options: [
      { text: 'Решение сложных логических задач', type: 'developer' },
      { text: 'Создание красивых и удобных интерфейсов', type: 'designer' },
    ],
    order: 1,
  },
  {
    id: 2,
    question: 'Какой инструмент вы бы выбрали для изучения?',
    options: [
      { text: 'VS Code или другую IDE', type: 'developer' },
      { text: 'Figma или Sketch', type: 'designer' },
    ],
    order: 2,
  },
  {
    id: 3,
    question: 'Что для вас важнее в проекте?',
    options: [
      { text: 'Чистый и оптимизированный код', type: 'developer' },
      { text: 'Гармоничная цветовая палитра', type: 'designer' },
    ],
    order: 3,
  },
  {
    id: 4,
    question: 'Как вы предпочитаете учиться?',
    options: [
      { text: 'Читать документацию и разбирать примеры кода', type: 'developer' },
      { text: 'Изучать дизайн-системы и тренды', type: 'designer' },
    ],
    order: 4,
  },
  {
    id: 5,
    question: 'Какая задача кажется вам интереснее?',
    options: [
      { text: 'Оптимизировать алгоритм для ускорения работы приложения', type: 'developer' },
      { text: 'Провести UX-исследование для улучшения пользовательского опыта', type: 'designer' },
    ],
    order: 5,
  },
  {
    id: 6,
    question: 'Что вас больше вдохновляет?',
    options: [
      { text: 'Автоматизация рутинных процессов', type: 'developer' },
      { text: 'Создание уникального визуального стиля', type: 'designer' },
    ],
    order: 6,
  },
]

const initialState = {
  // Настройки мероприятия
  eventName: 'X5 Tech Career Day 2024',
  welcomeText: 'Добро пожаловать в X5 For Students! Пройдите задания и получите шанс на стажировку в X5 Tech.',
  
  // Данные
  prizes: [],
  testQuestions: [],
  applications: [],
  users: [],
  analytics: null,
  
  // Состояние загрузки
  loading: false,
  error: null,
}

export const useAdminStore = create((set, get) => ({
  ...initialState,

  // Сброс ошибки
  clearError: () => set({ error: null }),

  // ============== Загрузка данных ==============
  
  // Загрузить аналитику
  fetchAnalytics: async () => {
    set({ loading: true, error: null })
    try {
      const analytics = await adminApi.getAnalytics()
      set({ analytics, loading: false })
      return analytics
    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error)
      set({ loading: false, error: error.message })
      return null
    }
  },

  // Загрузить пользователей
  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const users = await adminApi.getUsers()
      set({ users, loading: false })
      return users
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error)
      set({ loading: false, error: error.message })
      return []
    }
  },

  // Загрузить заявки
  fetchApplications: async () => {
    set({ loading: true, error: null })
    try {
      const applications = await adminApi.getApplications()
      set({ applications, loading: false })
      return applications
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error)
      set({ loading: false, error: error.message })
      return []
    }
  },

  // Загрузить призы
  fetchPrizes: async () => {
    set({ loading: true, error: null })
    try {
      const prizes = await adminApi.getPrizes()
      set({ prizes, loading: false })
      return prizes
    } catch (error) {
      console.error('Ошибка загрузки призов:', error)
      // При ошибке возвращаем пустой массив - призы добавляет админ
      set({ prizes: [], loading: false, error: error.message })
      return []
    }
  },

  // Загрузить вопросы теста
  fetchTestQuestions: async () => {
    set({ loading: true, error: null })
    try {
      const testQuestions = await adminApi.getTestQuestions()
      set({ testQuestions, loading: false })
      return testQuestions
    } catch (error) {
      console.error('Ошибка загрузки вопросов:', error)
      // Fallback на дефолтные данные
      set({ testQuestions: defaultTestQuestions, loading: false, error: error.message })
      return defaultTestQuestions
    }
  },

  // Загрузить настройки мероприятия
  fetchEventSettings: async () => {
    set({ loading: true, error: null })
    try {
      const settings = await adminApi.getEventSettings()
      set({
        eventName: settings.event_name,
        welcomeText: settings.welcome_text,
        loading: false,
      })
      return settings
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error)
      set({ loading: false, error: error.message })
      return null
    }
  },

  // Загрузить все данные для публичной части
  fetchPublicData: async () => {
    try {
      // Загружаем призы через публичный API
      const prizes = await prizesApi.getAll()
      set({ prizes })
    } catch (error) {
      console.error('Ошибка загрузки публичных данных:', error)
      set({ prizes: [] })
    }
    
    try {
      // Загружаем настройки мероприятия
      const settings = await adminApi.getEventSettings()
      set({
        eventName: settings.event_name,
        welcomeText: settings.welcome_text,
      })
    } catch (error) {
      // Используем дефолтные значения
    }
  },

  // ============== Управление настройками ==============
  
  setEventName: async (name) => {
    try {
      await adminApi.updateEventSettings({ event_name: name })
      set({ eventName: name })
      return true
    } catch (error) {
      console.error('Ошибка обновления названия:', error)
      set({ error: error.message })
      return false
    }
  },

  setWelcomeText: async (text) => {
    try {
      await adminApi.updateEventSettings({ welcome_text: text })
      set({ welcomeText: text })
      return true
    } catch (error) {
      console.error('Ошибка обновления текста:', error)
      set({ error: error.message })
      return false
    }
  },

  // ============== Управление призами ==============
  
  addPrize: async (prize) => {
    set({ loading: true, error: null })
    try {
      const newPrize = await adminApi.createPrize(prize)
      set(state => ({
        prizes: [...state.prizes, newPrize],
        loading: false,
      }))
      return newPrize
    } catch (error) {
      set({ loading: false, error: error.message })
      return null
    }
  },

  updatePrize: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedPrize = await adminApi.updatePrize(id, updates)
      set(state => ({
        prizes: state.prizes.map(p => p.id === id ? updatedPrize : p),
        loading: false,
      }))
      return updatedPrize
    } catch (error) {
      set({ loading: false, error: error.message })
      return null
    }
  },

  removePrize: async (id) => {
    set({ loading: true, error: null })
    try {
      await adminApi.deletePrize(id)
      set(state => ({
        prizes: state.prizes.filter(p => p.id !== id),
        loading: false,
      }))
      return true
    } catch (error) {
      set({ loading: false, error: error.message })
      return false
    }
  },

  // Claim prize - уменьшить количество (локально, реальное изменение через API призов)
  claimPrize: (prizeId) => {
    const state = get()
    const prize = state.prizes.find(p => p.id === prizeId)
    if (prize && prize.quantity > 0) {
      set(state => ({
        prizes: state.prizes.map(p =>
          p.id === prizeId ? { ...p, quantity: p.quantity - 1 } : p
        ),
      }))
      return true
    }
    return false
  },

  // ============== Управление вопросами теста ==============
  
  addQuestion: async (question) => {
    set({ loading: true, error: null })
    try {
      const newQuestion = await adminApi.createTestQuestion(question)
      set(state => ({
        testQuestions: [...state.testQuestions, newQuestion],
        loading: false,
      }))
      return newQuestion
    } catch (error) {
      set({ loading: false, error: error.message })
      return null
    }
  },

  updateQuestion: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const updatedQuestion = await adminApi.updateTestQuestion(id, updates)
      set(state => ({
        testQuestions: state.testQuestions.map(q => q.id === id ? updatedQuestion : q),
        loading: false,
      }))
      return updatedQuestion
    } catch (error) {
      set({ loading: false, error: error.message })
      return null
    }
  },

  removeQuestion: async (id) => {
    set({ loading: true, error: null })
    try {
      await adminApi.deleteTestQuestion(id)
      set(state => ({
        testQuestions: state.testQuestions.filter(q => q.id !== id),
        loading: false,
      }))
      return true
    } catch (error) {
      set({ loading: false, error: error.message })
      return false
    }
  },

  // ============== Сброс к дефолтным значениям ==============
  
  resetToDefaults: () => {
    set({
      testQuestions: defaultTestQuestions,
      welcomeText: 'Добро пожаловать в X5 For Students!',
    })
  },

  // Инициализация админ панели
  initializeAdmin: async () => {
    await Promise.all([
      get().fetchAnalytics(),
      get().fetchPrizes(),
      get().fetchTestQuestions(),
      get().fetchEventSettings(),
    ])
  },
}))
