import { create } from 'zustand'

export const useAnalyticsStore = create((set, get) => ({
  // Get analytics data from localStorage
  getAnalytics: () => {
    const data = JSON.parse(localStorage.getItem('x5-analytics') || '{}')
    return {
      registrations: data.registrations || 0,
      testsCompleted: data.testsCompleted || 0,
      gamesCompleted: data.gamesCompleted || 0,
      applications: data.applications || 0,
      users: data.users || [],
    }
  },

  // Export analytics to Excel format
  getExportData: () => {
    const analytics = get().getAnalytics()
    
    return {
      summary: [
        { metric: 'Всего регистраций', value: analytics.registrations },
        { metric: 'Тестов пройдено', value: analytics.testsCompleted },
        { metric: 'Мини-игр пройдено', value: analytics.gamesCompleted },
        { metric: 'Заявок на стажировку', value: analytics.applications },
      ],
      users: analytics.users.map((user, index) => ({
        '№': index + 1,
        'Email': user.email,
        'Дата регистрации': new Date(user.registeredAt).toLocaleString('ru-RU'),
      })),
    }
  },

  // Reset analytics (for testing)
  resetAnalytics: () => {
    localStorage.setItem('x5-analytics', JSON.stringify({
      registrations: 0,
      testsCompleted: 0,
      gamesCompleted: 0,
      applications: 0,
      users: [],
    }))
  },
}))

