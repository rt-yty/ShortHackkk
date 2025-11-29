// API клиент для взаимодействия с бекендом

const API_BASE_URL = '/api/v1'

// Хранилище токенов
let accessToken = localStorage.getItem('accessToken')
let refreshToken = localStorage.getItem('refreshToken')

// Сохранение токенов
export const setTokens = (access, refresh) => {
  accessToken = access
  refreshToken = refresh
  localStorage.setItem('accessToken', access)
  localStorage.setItem('refreshToken', refresh)
}

// Очистка токенов
export const clearTokens = () => {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

// Получение access токена
export const getAccessToken = () => accessToken

// Базовый fetch с авторизацией и обработкой ошибок
const fetchWithAuth = async (url, options = {}) => {
  const headers = {
    ...options.headers,
  }

  // Добавляем Content-Type только если это не FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  // Добавляем токен авторизации
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  // Если 401, пробуем обновить токен
  if (response.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`
      response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      })
    }
  }

  return response
}

// Обновление access токена
const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      setTokens(data.access_token, data.refresh_token)
      return true
    } else {
      clearTokens()
      return false
    }
  } catch (error) {
    clearTokens()
    return false
  }
}

// ==================== AUTH API ====================

export const authApi = {
  // Регистрация
  async register(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка регистрации')
    }
    
    const data = await response.json()
    setTokens(data.access_token, data.refresh_token)
    return data
  },

  // Вход (JSON формат)
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login/json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Неверный email или пароль')
    }
    
    const data = await response.json()
    setTokens(data.access_token, data.refresh_token)
    return data
  },

  // Выход
  logout() {
    clearTokens()
  },
}

// ==================== USER API ====================

export const userApi = {
  // Получить текущего пользователя
  async getMe() {
    const response = await fetchWithAuth('/users/me')
    
    if (!response.ok) {
      throw new Error('Не удалось получить данные пользователя')
    }
    
    return response.json()
  },

  // Получить прогресс пользователя
  async getProgress() {
    const response = await fetchWithAuth('/users/me/progress')
    
    if (!response.ok) {
      throw new Error('Не удалось получить прогресс')
    }
    
    return response.json()
  },

  // Получить полученные призы
  async getClaimedPrizes() {
    const response = await fetchWithAuth('/users/me/claimed-prizes')
    
    if (!response.ok) {
      throw new Error('Не удалось получить список призов')
    }
    
    return response.json()
  },
}

// ==================== TEST API ====================

export const testApi = {
  // Получить вопросы теста
  async getQuestions() {
    const response = await fetchWithAuth('/test/questions')
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить вопросы теста')
    }
    
    return response.json()
  },

  // Завершить тест
  async complete(result) {
    const response = await fetchWithAuth('/test/complete', {
      method: 'POST',
      body: JSON.stringify({ result }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка завершения теста')
    }
    
    return response.json()
  },

  // Пропустить тест
  async skip() {
    const response = await fetchWithAuth('/test/skip', {
      method: 'POST',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка пропуска теста')
    }
    
    return response.json()
  },

  // Установить направление вручную
  async setDirection(direction) {
    const response = await fetchWithAuth('/test/set-direction', {
      method: 'POST',
      body: JSON.stringify({ result: direction }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка установки направления')
    }
    
    return response.json()
  },
}

// ==================== GAME API ====================

export const gameApi = {
  // Завершить игру
  async complete(gameType, score) {
    const response = await fetchWithAuth('/games/complete', {
      method: 'POST',
      body: JSON.stringify({ game_type: gameType, score }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка завершения игры')
    }
    
    return response.json()
  },
}

// ==================== PRIZES API ====================

export const prizesApi = {
  // Получить список призов
  async getAll() {
    const response = await fetchWithAuth('/prizes')
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить призы')
    }
    
    return response.json()
  },

  // Получить приз
  async claim(prizeId) {
    const response = await fetchWithAuth(`/prizes/${prizeId}/claim`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка получения приза')
    }
    
    return response.json()
  },
}

// ==================== APPLICATIONS API ====================

export const applicationsApi = {
  // Отправить заявку
  async submit(formData) {
    const response = await fetchWithAuth('/applications', {
      method: 'POST',
      body: formData, // FormData для multipart/form-data
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка отправки заявки')
    }
    
    return response.json()
  },

  // Получить свою заявку
  async getMy() {
    const response = await fetchWithAuth('/applications/me')
    
    if (!response.ok && response.status !== 404) {
      throw new Error('Не удалось загрузить заявку')
    }
    
    if (response.status === 404) {
      return null
    }
    
    return response.json()
  },
}

// ==================== ADMIN API ====================

export const adminApi = {
  // Получить аналитику
  async getAnalytics() {
    const response = await fetchWithAuth('/admin/analytics')
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить аналитику')
    }
    
    return response.json()
  },

  // Получить все заявки
  async getApplications() {
    const response = await fetchWithAuth('/admin/applications')
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить заявки')
    }
    
    return response.json()
  },

  // Получить всех пользователей
  async getUsers() {
    const response = await fetchWithAuth('/admin/users')
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить пользователей')
    }
    
    return response.json()
  },

  // Управление призами
  async getPrizes() {
    const response = await fetchWithAuth('/admin/prizes')
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить призы')
    }
    
    return response.json()
  },

  async createPrize(prize) {
    const response = await fetchWithAuth('/admin/prizes', {
      method: 'POST',
      body: JSON.stringify(prize),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка создания приза')
    }
    
    return response.json()
  },

  async updatePrize(id, updates) {
    const response = await fetchWithAuth(`/admin/prizes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка обновления приза')
    }
    
    return response.json()
  },

  async deletePrize(id) {
    const response = await fetchWithAuth(`/admin/prizes/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка удаления приза')
    }
    
    return response.json()
  },

  // Управление вопросами теста
  async getTestQuestions() {
    const response = await fetchWithAuth('/admin/questions')
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить вопросы')
    }
    
    return response.json()
  },

  async createTestQuestion(question) {
    const response = await fetchWithAuth('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка создания вопроса')
    }
    
    return response.json()
  },

  async updateTestQuestion(id, updates) {
    const response = await fetchWithAuth(`/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка обновления вопроса')
    }
    
    return response.json()
  },

  async deleteTestQuestion(id) {
    const response = await fetchWithAuth(`/admin/questions/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка удаления вопроса')
    }
    
    return response.json()
  },

  // Настройки мероприятия
  async getEventSettings() {
    const response = await fetchWithAuth('/admin/settings')
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить настройки')
    }
    
    return response.json()
  },

  async updateEventSettings(settings) {
    const response = await fetchWithAuth('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Ошибка обновления настроек')
    }
    
    return response.json()
  },
}

