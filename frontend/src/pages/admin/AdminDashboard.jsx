import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as XLSX from 'xlsx'
import { useUserStore } from '../../stores/userStore'
import { useAdminStore } from '../../stores/adminStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import styles from './AdminDashboard.module.css'

// Raccoon icon from Figma
const raccoonIcon = 'https://www.figma.com/api/mcp/asset/f7a133a4-fa94-4d0a-8969-4205924e62de'

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
    fetchApplications,
    fetchTestQuestions,
    fetchAnalytics,
    fetchUsers,
    analytics,
    users,
    testQuestions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    applications,
    loading,
  } = useAdminStore()

  const [activeTab, setActiveTab] = useState('analytics')
  const [editingPrize, setEditingPrize] = useState(null)
  const [isAddPrizeModalOpen, setIsAddPrizeModalOpen] = useState(false)
  const [newPrize, setNewPrize] = useState({ name: '', points: '', quantity: '', description: '' })
  const [isInitialized, setIsInitialized] = useState(false)
  const [expandedMotivation, setExpandedMotivation] = useState(null)
  
  // Состояния для управления тестами
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: [
      { text: '', type: 'developer' },
      { text: '', type: 'designer' }
    ],
    order: 0
  })

  // Загружаем данные при монтировании
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPrizes(),
        fetchEventSettings(),
        fetchApplications(),
        fetchTestQuestions(),
        fetchAnalytics(),
        fetchUsers(),
      ])
      setIsInitialized(true)
    }
    loadData()
  }, [fetchPrizes, fetchEventSettings, fetchApplications, fetchTestQuestions, fetchAnalytics, fetchUsers])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new()
    
    // Summary sheet
    const summaryData = [
      { metric: 'Всего регистраций', value: analytics?.registrations || 0 },
      { metric: 'Тестов пройдено', value: analytics?.tests_completed || 0 },
      { metric: 'Мини-игр пройдено', value: analytics?.games_completed || 0 },
      { metric: 'Заявок на стажировку', value: analytics?.applications || 0 },
    ]
    const summaryWs = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Сводка')
    
    // Users sheet
    if (users && users.length > 0) {
      const usersData = users.map((user, index) => ({
        '№': index + 1,
        'Email': user.email,
        'Дата регистрации': new Date(user.registered_at).toLocaleString('ru-RU'),
      }))
      const usersWs = XLSX.utils.json_to_sheet(usersData)
      XLSX.utils.book_append_sheet(wb, usersWs, 'Пользователи')
    }
    
    XLSX.writeFile(wb, `x5_analytics_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleExportApplications = () => {
    if (applications.length === 0) return

    const wb = XLSX.utils.book_new()
    
    const applicationsData = applications.map((app, index) => ({
      '№': index + 1,
      'ФИО': app.full_name,
      'Email': app.email,
      'Телефон': app.phone,
      'Направление': app.direction === 'developer' ? 'Разработчик' : 'Дизайнер',
      'Мотивация': app.motivation || '',
      'Резюме': app.resume_path ? 'Есть' : 'Нет',
      'Дата подачи': new Date(app.created_at).toLocaleString('ru-RU'),
    }))
    
    const ws = XLSX.utils.json_to_sheet(applicationsData)
    XLSX.utils.book_append_sheet(wb, ws, 'Заявки')
    
    XLSX.writeFile(wb, `x5_applications_${new Date().toISOString().split('T')[0]}.xlsx`)
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

  // Функции для работы с тестами
  const handleSaveQuestion = async () => {
    if (editingQuestion) {
      await updateQuestion(editingQuestion.id, {
        question: editingQuestion.question,
        options: editingQuestion.options,
        order: editingQuestion.order
      })
      setEditingQuestion(null)
    }
  }

  const handleAddQuestion = async () => {
    if (newQuestion.question && newQuestion.options[0].text && newQuestion.options[1].text) {
      await addQuestion({
        question: newQuestion.question,
        options: newQuestion.options,
        order: newQuestion.order || (testQuestions.length + 1)
      })
      setNewQuestion({
        question: '',
        options: [
          { text: '', type: 'developer' },
          { text: '', type: 'designer' }
        ],
        order: 0
      })
      setIsAddQuestionModalOpen(false)
    }
  }

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Удалить этот вопрос?')) {
      await removeQuestion(id)
    }
  }

  const analyticsCards = [
    { label: 'Регистрации', value: analytics?.registrations || 0, icon: '👤', color: '#3B82F6' },
    { label: 'Тесты пройдены', value: analytics?.tests_completed || 0, icon: '📝', color: '#10B981' },
    { label: 'Игры пройдены', value: analytics?.games_completed || 0, icon: '🎮', color: '#F59E0B' },
    { label: 'Заявки', value: analytics?.applications || 0, icon: '📄', color: '#EC4899' },
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
            className={`${styles.tab} ${activeTab === 'applications' ? styles.active : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            📄 Заявки
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
          <button
            className={`${styles.tab} ${activeTab === 'tests' ? styles.active : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            📝 Тесты
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

              {users && users.length > 0 && (
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
                        {users.slice(0, 10).map((user, index) => (
                          <tr key={index}>
                            <td>{user.email}</td>
                            <td>{new Date(user.registered_at).toLocaleString('ru-RU')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length > 10 && (
                      <p className={styles.moreUsers}>
                        И ещё {users.length - 10} пользователей...
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'applications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.applicationsHeader}>
                <h2 className={styles.sectionTitle}>Заявки на стажировку</h2>
                <div className={styles.applicationsActions}>
                  <span className={styles.applicationsCount}>
                    Всего: {applications.length}
                  </span>
                  {applications.length > 0 && (
                    <Button variant="primary" onClick={handleExportApplications}>
                      📥 Экспорт в Excel
                    </Button>
                  )}
                </div>
              </div>

              {!isInitialized ? (
                <div className={styles.loadingMessage}>
                  Загрузка заявок...
                </div>
              ) : applications.length === 0 ? (
                <Card variant="default" padding="large" className={styles.emptyCard}>
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📭</span>
                    <p>Заявок пока нет</p>
                  </div>
                </Card>
              ) : (
                <div className={styles.applicationsList}>
                  {applications.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card variant="default" padding="medium" className={styles.applicationCard}>
                        <div className={styles.applicationHeader}>
                          <div className={styles.applicationName}>
                            <h4>{app.full_name}</h4>
                            <span className={`${styles.directionBadge} ${styles[app.direction]}`}>
                              {app.direction === 'developer' ? '💻 Разработчик' : '🎨 Дизайнер'}
                            </span>
                          </div>
                          <div className={styles.applicationDate}>
                            {new Date(app.created_at).toLocaleString('ru-RU', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        
                        <div className={styles.applicationContacts}>
                          <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📧</span>
                            <a href={`mailto:${app.email}`}>{app.email}</a>
                          </div>
                          <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>📱</span>
                            <a href={`tel:${app.phone}`}>{app.phone}</a>
                          </div>
                        </div>

                        {app.motivation && (
                          <div className={styles.applicationMotivation}>
                            <span className={styles.motivationLabel}>Мотивация:</span>
                            <p className={styles.motivationText}>
                              {app.motivation.length > 200 && expandedMotivation !== app.id
                                ? `${app.motivation.substring(0, 200)}...` 
                                : app.motivation}
                            </p>
                            {app.motivation.length > 200 && (
                              <button 
                                className={styles.readMoreBtn}
                                onClick={() => setExpandedMotivation(
                                  expandedMotivation === app.id ? null : app.id
                                )}
                              >
                                {expandedMotivation === app.id ? 'Свернуть' : 'Читать полностью'}
                              </button>
                            )}
                          </div>
                        )}

                        {app.resume_path && (
                          <div className={styles.applicationFooter}>
                            <a 
                              href={`/api/v1/admin/applications/${app.id}/resume`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.resumeLink}
                            >
                              📎 Скачать резюме
                            </a>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
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
                    dark
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
                          dark
                        />
                        <div className={styles.prizeEditRow}>
                          <Input
                            label="Баллы"
                            type="number"
                            value={editingPrize.points}
                            onChange={(e) => setEditingPrize({ ...editingPrize, points: parseInt(e.target.value) || 0 })}
                            fullWidth
                            dark
                          />
                          <Input
                            label="Количество"
                            type="number"
                            value={editingPrize.quantity}
                            onChange={(e) => setEditingPrize({ ...editingPrize, quantity: parseInt(e.target.value) || 0 })}
                            fullWidth
                            dark
                          />
                        </div>
                        <Input
                          label="Описание"
                          value={editingPrize.description}
                          onChange={(e) => setEditingPrize({ ...editingPrize, description: e.target.value })}
                          fullWidth
                          dark
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
                          <div className={styles.prizePoints}>{prize.points} <img src={raccoonIcon} alt="" className={styles.raccoonIcon} /></div>
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
                          <Button variant="secondary" size="small" onClick={() => setEditingPrize(prize)}>
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

          {activeTab === 'tests' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.prizesHeader}>
                <h2 className={styles.sectionTitle}>Управление тестовыми вопросами</h2>
                <Button variant="primary" onClick={() => setIsAddQuestionModalOpen(true)}>
                  + Добавить вопрос
                </Button>
              </div>

              {!isInitialized ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Загрузка вопросов...
                </div>
              ) : testQuestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Вопросов пока нет. Добавьте первый вопрос!
                </div>
              ) : (
                <div className={styles.questionsList}>
                  {testQuestions.sort((a, b) => a.order - b.order).map((question, index) => (
                    <Card key={question.id} variant="default" padding="medium" className={styles.questionItem}>
                      {editingQuestion?.id === question.id ? (
                        <div className={styles.questionEdit}>
                          <Input
                            label="Вопрос"
                            value={editingQuestion.question}
                            onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                            fullWidth
                            dark
                          />
                          <div className={styles.optionsEdit}>
                            <div className={styles.optionRow}>
                              <span className={styles.optionLabel}>💻 Разработчик:</span>
                              <Input
                                value={editingQuestion.options.find(o => o.type === 'developer')?.text || ''}
                                onChange={(e) => setEditingQuestion({
                                  ...editingQuestion,
                                  options: editingQuestion.options.map(o =>
                                    o.type === 'developer' ? { ...o, text: e.target.value } : o
                                  )
                                })}
                                fullWidth
                                dark
                              />
                            </div>
                            <div className={styles.optionRow}>
                              <span className={styles.optionLabel}>🎨 Дизайнер:</span>
                              <Input
                                value={editingQuestion.options.find(o => o.type === 'designer')?.text || ''}
                                onChange={(e) => setEditingQuestion({
                                  ...editingQuestion,
                                  options: editingQuestion.options.map(o =>
                                    o.type === 'designer' ? { ...o, text: e.target.value } : o
                                  )
                                })}
                                fullWidth
                                dark
                              />
                            </div>
                          </div>
                          <Input
                            label="Порядок"
                            type="number"
                            value={editingQuestion.order}
                            onChange={(e) => setEditingQuestion({ ...editingQuestion, order: parseInt(e.target.value) || 0 })}
                            fullWidth
                            dark
                          />
                          <div className={styles.prizeEditActions}>
                            <Button variant="primary" onClick={handleSaveQuestion}>
                              Сохранить
                            </Button>
                            <Button variant="ghost" onClick={() => setEditingQuestion(null)}>
                              Отмена
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.questionView}>
                          <div className={styles.questionHeader}>
                            <span className={styles.questionNumber}>#{question.order || index + 1}</span>
                            <h4 className={styles.questionText}>{question.question}</h4>
                          </div>
                          <div className={styles.questionOptions}>
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className={`${styles.optionItem} ${styles[option.type]}`}>
                                <span className={styles.optionType}>
                                  {option.type === 'developer' ? '💻' : '🎨'}
                                </span>
                                <span>{option.text}</span>
                              </div>
                            ))}
                          </div>
                          <div className={styles.prizeActions}>
                            <Button variant="secondary" size="small" onClick={() => setEditingQuestion(question)}>
                              ✏️ Редактировать
                            </Button>
                            <Button variant="danger" size="small" onClick={() => handleDeleteQuestion(question.id)}>
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
            dark
          />
          <div className={styles.addPrizeRow}>
            <Input
              label="Баллы"
              type="number"
              value={newPrize.points}
              onChange={(e) => setNewPrize({ ...newPrize, points: e.target.value })}
              placeholder="Кол-во баллов"
              fullWidth
              dark
            />
            <Input
              label="Количество"
              type="number"
              value={newPrize.quantity}
              onChange={(e) => setNewPrize({ ...newPrize, quantity: e.target.value })}
              placeholder="Штук в наличии"
              fullWidth
              dark
            />
          </div>
          <Input
            label="Описание"
            value={newPrize.description}
            onChange={(e) => setNewPrize({ ...newPrize, description: e.target.value })}
            placeholder="Описание приза"
            fullWidth
            dark
          />
          <Button variant="primary" fullWidth onClick={handleAddPrize}>
            Добавить
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        title="Добавить вопрос теста"
      >
        <div className={styles.addQuestionForm}>
          <Input
            label="Текст вопроса"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            placeholder="Введите вопрос"
            fullWidth
            dark
          />
          <div className={styles.optionsForm}>
            <div className={styles.optionFormRow}>
              <span className={styles.optionFormLabel}>💻 Ответ для разработчика:</span>
              <Input
                value={newQuestion.options[0].text}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  options: [
                    { text: e.target.value, type: 'developer' },
                    newQuestion.options[1]
                  ]
                })}
                placeholder="Вариант ответа"
                fullWidth
                dark
              />
            </div>
            <div className={styles.optionFormRow}>
              <span className={styles.optionFormLabel}>🎨 Ответ для дизайнера:</span>
              <Input
                value={newQuestion.options[1].text}
                onChange={(e) => setNewQuestion({
                  ...newQuestion,
                  options: [
                    newQuestion.options[0],
                    { text: e.target.value, type: 'designer' }
                  ]
                })}
                placeholder="Вариант ответа"
                fullWidth
                dark
              />
            </div>
          </div>
          <Input
            label="Порядковый номер"
            type="number"
            value={newQuestion.order}
            onChange={(e) => setNewQuestion({ ...newQuestion, order: parseInt(e.target.value) || 0 })}
            placeholder="Порядок отображения"
            fullWidth
            dark
          />
          <Button variant="primary" fullWidth onClick={handleAddQuestion}>
            Добавить вопрос
          </Button>
        </div>
      </Modal>

    </div>
  )
}

export default AdminDashboard

