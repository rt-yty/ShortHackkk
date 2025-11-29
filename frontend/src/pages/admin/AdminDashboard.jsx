import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import { useUserStore } from '../../stores/userStore'
import { useAdminStore } from '../../stores/adminStore'
import { useAnalyticsStore } from '../../stores/analyticsStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import styles from './AdminDashboard.module.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useUserStore()
  const { 
    eventName, setEventName,
    prizes, updatePrize, addPrize, removePrize,
    welcomeText, setWelcomeText,
    resetToDefaults,
    fetchPrizes,
    fetchEventSettings,
    loading,
  } = useAdminStore()
  const { getAnalytics, getExportData } = useAnalyticsStore()

  const [activeTab, setActiveTab] = useState('analytics')
  const [editingPrize, setEditingPrize] = useState(null)
  const [isAddPrizeModalOpen, setIsAddPrizeModalOpen] = useState(false)
  const [newPrize, setNewPrize] = useState({ name: '', points: '', quantity: '', description: '' })
  const [isInitialized, setIsInitialized] = useState(false)

  // Загружаем данные при монтировании
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPrizes(),
        fetchEventSettings(),
      ])
      setIsInitialized(true)
    }
    loadData()
  }, [fetchPrizes, fetchEventSettings])

  const analytics = getAnalytics()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleExportExcel = () => {
    const data = getExportData()
    
    const wb = XLSX.utils.book_new()
    
    // Summary sheet
    const summaryWs = XLSX.utils.json_to_sheet(data.summary)
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Сводка')
    
    // Users sheet
    if (data.users.length > 0) {
      const usersWs = XLSX.utils.json_to_sheet(data.users)
      XLSX.utils.book_append_sheet(wb, usersWs, 'Пользователи')
    }
    
    XLSX.writeFile(wb, `x5_analytics_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleSavePrize = () => {
    if (editingPrize) {
      updatePrize(editingPrize.id, editingPrize)
      setEditingPrize(null)
    }
  }

  const handleAddPrize = () => {
    if (newPrize.name && newPrize.points) {
      addPrize({
        name: newPrize.name,
        points: parseInt(newPrize.points),
        quantity: parseInt(newPrize.quantity) || 0,
        description: newPrize.description,
      })
      setNewPrize({ name: '', points: '', quantity: '', description: '' })
      setIsAddPrizeModalOpen(false)
    }
  }

  const analyticsCards = [
    { label: 'Регистрации', value: analytics.registrations, icon: '👤', color: '#3B82F6' },
    { label: 'Тесты пройдены', value: analytics.testsCompleted, icon: '📝', color: '#10B981' },
    { label: 'Игры пройдены', value: analytics.gamesCompleted, icon: '🎮', color: '#F59E0B' },
    { label: 'Заявки', value: analytics.applications, icon: '📄', color: '#EC4899' },
  ]

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoX5}>X5</span>
            <span className={styles.logoText}>Admin Panel</span>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </header>

      <div className={styles.container}>
        <nav className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Аналитика
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Настройки
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'prizes' ? styles.active : ''}`}
            onClick={() => setActiveTab('prizes')}
          >
            🎁 Призы
          </button>
        </nav>

        <div className={styles.content}>
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.analyticsHeader}>
                <h2 className={styles.sectionTitle}>Статистика</h2>
                <Button variant="primary" onClick={handleExportExcel}>
                  📥 Экспорт в Excel
                </Button>
              </div>

              <div className={styles.analyticsGrid}>
                {analyticsCards.map((card, index) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="elevated" padding="large" className={styles.analyticsCard}>
                      <div className={styles.analyticsIcon} style={{ backgroundColor: `${card.color}20` }}>
                        <span>{card.icon}</span>
                      </div>
                      <div className={styles.analyticsValue}>{card.value}</div>
                      <div className={styles.analyticsLabel}>{card.label}</div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {analytics.users.length > 0 && (
                <Card variant="default" padding="large" className={styles.usersCard}>
                  <h3 className={styles.usersTitle}>Зарегистрированные пользователи</h3>
                  <div className={styles.usersTable}>
                    <table>
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Дата регистрации</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.users.slice(0, 10).map((user, index) => (
                          <tr key={index}>
                            <td>{user.email}</td>
                            <td>{new Date(user.registeredAt).toLocaleString('ru-RU')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {analytics.users.length > 10 && (
                      <p className={styles.moreUsers}>
                        И ещё {analytics.users.length - 10} пользователей...
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className={styles.sectionTitle}>Настройки мероприятия</h2>
              
              <Card variant="default" padding="large" className={styles.settingsCard}>
                <div className={styles.settingGroup}>
                  <Input
                    label="Название мероприятия"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Введите название"
                    fullWidth
                  />
                </div>

                <div className={styles.settingGroup}>
                  <label className={styles.label}>Приветственный текст</label>
                  <textarea
                    value={welcomeText}
                    onChange={(e) => setWelcomeText(e.target.value)}
                    className={styles.textarea}
                    rows={3}
                    placeholder="Текст на главной странице"
                  />
                </div>

                <div className={styles.settingActions}>
                  <Button variant="danger" onClick={resetToDefaults}>
                    Сбросить настройки
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'prizes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.prizesHeader}>
                <h2 className={styles.sectionTitle}>Управление призами</h2>
                <Button variant="primary" onClick={() => setIsAddPrizeModalOpen(true)}>
                  + Добавить приз
                </Button>
              </div>

              {!isInitialized ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Загрузка призов...
                </div>
              ) : prizes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Призов пока нет. Добавьте первый приз!
                </div>
              ) : (
              <div className={styles.prizesList}>
                {prizes.map((prize) => (
                  <Card key={prize.id} variant="default" padding="medium" className={styles.prizeItem}>
                    {editingPrize?.id === prize.id ? (
                      <div className={styles.prizeEdit}>
                        <Input
                          label="Название"
                          value={editingPrize.name}
                          onChange={(e) => setEditingPrize({ ...editingPrize, name: e.target.value })}
                          fullWidth
                        />
                        <div className={styles.prizeEditRow}>
                          <Input
                            label="Баллы"
                            type="number"
                            value={editingPrize.points}
                            onChange={(e) => setEditingPrize({ ...editingPrize, points: parseInt(e.target.value) || 0 })}
                            fullWidth
                          />
                          <Input
                            label="Количество"
                            type="number"
                            value={editingPrize.quantity}
                            onChange={(e) => setEditingPrize({ ...editingPrize, quantity: parseInt(e.target.value) || 0 })}
                            fullWidth
                          />
                        </div>
                        <Input
                          label="Описание"
                          value={editingPrize.description}
                          onChange={(e) => setEditingPrize({ ...editingPrize, description: e.target.value })}
                          fullWidth
                        />
                        <div className={styles.prizeEditActions}>
                          <Button variant="primary" onClick={handleSavePrize}>
                            Сохранить
                          </Button>
                          <Button variant="ghost" onClick={() => setEditingPrize(null)}>
                            Отмена
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.prizeView}>
                        <div className={styles.prizeInfo}>
                          <div className={styles.prizePoints}>{prize.points} ⭐</div>
                          <div>
                            <h4 className={styles.prizeName}>{prize.name}</h4>
                            <p className={styles.prizeDescription}>{prize.description}</p>
                          </div>
                          <div className={styles.prizeQuantity}>
                            <span className={styles.quantityLabel}>В наличии:</span>
                            <span className={`${styles.quantityValue} ${prize.quantity === 0 ? styles.outOfStock : ''}`}>
                              {prize.quantity} шт.
                            </span>
                          </div>
                        </div>
                        <div className={styles.prizeActions}>
                          <Button variant="ghost" size="small" onClick={() => setEditingPrize(prize)}>
                            ✏️ Редактировать
                          </Button>
                          <Button variant="danger" size="small" onClick={() => removePrize(prize.id)}>
                            🗑️ Удалить
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isAddPrizeModalOpen}
        onClose={() => setIsAddPrizeModalOpen(false)}
        title="Добавить приз"
      >
        <div className={styles.addPrizeForm}>
          <Input
            label="Название"
            value={newPrize.name}
            onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
            placeholder="Название приза"
            fullWidth
          />
          <div className={styles.addPrizeRow}>
            <Input
              label="Баллы"
              type="number"
              value={newPrize.points}
              onChange={(e) => setNewPrize({ ...newPrize, points: e.target.value })}
              placeholder="Кол-во баллов"
              fullWidth
            />
            <Input
              label="Количество"
              type="number"
              value={newPrize.quantity}
              onChange={(e) => setNewPrize({ ...newPrize, quantity: e.target.value })}
              placeholder="Штук в наличии"
              fullWidth
            />
          </div>
          <Input
            label="Описание"
            value={newPrize.description}
            onChange={(e) => setNewPrize({ ...newPrize, description: e.target.value })}
            placeholder="Описание приза"
            fullWidth
          />
          <Button variant="primary" fullWidth onClick={handleAddPrize}>
            Добавить
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default AdminDashboard

