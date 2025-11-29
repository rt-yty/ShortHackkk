import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultPrizes = [
  { id: 1, name: 'Стикерпак X5', points: 25, description: 'Набор эксклюзивных стикеров X5 Tech' },
  { id: 2, name: 'Мерч X5 (футболка)', points: 50, description: 'Фирменная футболка X5 Tech' },
  { id: 3, name: 'Powerbank', points: 75, description: 'Портативное зарядное устройство 10000 mAh' },
  { id: 4, name: 'Приоритетное рассмотрение', points: 100, description: 'Ваше резюме будет рассмотрено в приоритетном порядке' },
]

const defaultTestQuestions = [
  {
    id: 1,
    question: 'Что вас больше привлекает в работе?',
    options: [
      { text: 'Решение сложных логических задач', type: 'developer' },
      { text: 'Создание красивых и удобных интерфейсов', type: 'designer' },
    ],
  },
  {
    id: 2,
    question: 'Какой инструмент вы бы выбрали для изучения?',
    options: [
      { text: 'VS Code или другую IDE', type: 'developer' },
      { text: 'Figma или Sketch', type: 'designer' },
    ],
  },
  {
    id: 3,
    question: 'Что для вас важнее в проекте?',
    options: [
      { text: 'Чистый и оптимизированный код', type: 'developer' },
      { text: 'Гармоничная цветовая палитра', type: 'designer' },
    ],
  },
  {
    id: 4,
    question: 'Как вы предпочитаете учиться?',
    options: [
      { text: 'Читать документацию и разбирать примеры кода', type: 'developer' },
      { text: 'Изучать дизайн-системы и тренды', type: 'designer' },
    ],
  },
  {
    id: 5,
    question: 'Какая задача кажется вам интереснее?',
    options: [
      { text: 'Оптимизировать алгоритм для ускорения работы приложения', type: 'developer' },
      { text: 'Провести UX-исследование для улучшения пользовательского опыта', type: 'designer' },
    ],
  },
  {
    id: 6,
    question: 'Что вас больше вдохновляет?',
    options: [
      { text: 'Автоматизация рутинных процессов', type: 'developer' },
      { text: 'Создание уникального визуального стиля', type: 'designer' },
    ],
  },
]

export const useAdminStore = create(
  persist(
    (set, get) => ({
      eventName: 'X5 Tech Career Day 2024',
      prizes: defaultPrizes,
      testQuestions: defaultTestQuestions,
      welcomeText: 'Добро пожаловать в X5 For Students! Пройдите задания и получите шанс на стажировку в X5 Tech.',
      
      // Event management
      setEventName: (name) => set({ eventName: name }),
      
      // Prize management
      updatePrize: (id, updates) => {
        set((state) => ({
          prizes: state.prizes.map((prize) =>
            prize.id === id ? { ...prize, ...updates } : prize
          ),
        }))
      },
      
      addPrize: (prize) => {
        set((state) => ({
          prizes: [...state.prizes, { ...prize, id: Date.now() }],
        }))
      },
      
      removePrize: (id) => {
        set((state) => ({
          prizes: state.prizes.filter((prize) => prize.id !== id),
        }))
      },
      
      // Test management
      updateQuestion: (id, updates) => {
        set((state) => ({
          testQuestions: state.testQuestions.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        }))
      },
      
      // Welcome text
      setWelcomeText: (text) => set({ welcomeText: text }),
      
      // Reset to defaults
      resetToDefaults: () => {
        set({
          prizes: defaultPrizes,
          testQuestions: defaultTestQuestions,
          welcomeText: 'Добро пожаловать в X5 For Students!',
        })
      },
    }),
    {
      name: 'x5-admin-storage',
    }
  )
)

