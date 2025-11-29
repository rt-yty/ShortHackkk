import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { useAdminStore } from '../../stores/adminStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import styles from './DashboardPage.module.css'

function DashboardPage() {
  const navigate = useNavigate()
  const { points, completedTest, completedGame, appliedForInternship, testResult } = useUserStore()
  const { welcomeText, eventName, prizes } = useAdminStore()

  const sortedPrizes = [...prizes].sort((a, b) => a.points - b.points)
  const nextPrize = sortedPrizes.find(prize => prize.points > points)

  const tasks = [
    {
      id: 'test',
      title: 'Профориентационный тест',
      description: 'Узнайте, какое направление вам подходит',
      icon: '📝',
      points: 15,
      completed: completedTest,
      action: () => navigate('/test'),
      actionText: 'Пройти тест',
    },
    {
      id: 'game',
      title: 'Мини-игра',
      description: testResult === 'developer' ? 'Bug Catcher - поймайте баги!' : 'Color Match - угадайте цвета!',
      icon: '🎮',
      points: 25,
      completed: completedGame,
      action: () => navigate(testResult === 'developer' ? '/game/bug-catcher' : '/game/color-match'),
      actionText: 'Играть',
      disabled: !completedTest,
    },
    {
      id: 'application',
      title: 'Заявка на стажировку',
      description: 'Подайте заявку в X5 Tech',
      icon: '📄',
      points: 35,
      completed: appliedForInternship,
      action: () => navigate('/application'),
      actionText: 'Подать заявку',
      disabled: !completedGame,
    },
  ]

  const completedCount = tasks.filter(t => t.completed).length
  const progressPercentage = (completedCount / tasks.length) * 100

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          {eventName && <span className={styles.eventBadge}>{eventName}</span>}
          <h1 className={styles.title}>Добро пожаловать!</h1>
          <p className={styles.welcomeText}>{welcomeText}</p>
        </motion.div>

        <div className={styles.grid}>
          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="primary" padding="large" className={styles.progressCard}>
              <div className={styles.progressHeader}>
                <h2 className={styles.progressTitle}>Ваш прогресс</h2>
                <div className={styles.pointsBadge}>
                  <span className={styles.pointsIcon}>⭐</span>
                  <span className={styles.pointsValue}>{points}</span>
                </div>
              </div>
              
              <ProgressBar
                value={completedCount}
                max={tasks.length}
                label={`Выполнено ${completedCount} из ${tasks.length} заданий`}
                variant="warning"
              />

              {nextPrize && (
                <div className={styles.nextPrize}>
                  <span>🎁 Следующий приз:</span>
                  <strong>{nextPrize.name}</strong>
                  <span className={styles.nextPrizePoints}>
                    {nextPrize.points - points} баллов
                  </span>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.tasksSection}
          >
            <h2 className={styles.sectionTitle}>Задания</h2>
            <div className={styles.tasksList}>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Card
                    variant={task.completed ? 'default' : 'outlined'}
                    padding="medium"
                    className={`${styles.taskCard} ${task.completed ? styles.completed : ''} ${task.disabled ? styles.disabled : ''}`}
                  >
                    <div className={styles.taskIcon}>{task.icon}</div>
                    <div className={styles.taskContent}>
                      <h3 className={styles.taskTitle}>{task.title}</h3>
                      <p className={styles.taskDescription}>{task.description}</p>
                      <span className={styles.taskPoints}>+{task.points} баллов</span>
                    </div>
                    <div className={styles.taskAction}>
                      {task.completed ? (
                        <span className={styles.completedBadge}>✓ Выполнено</span>
                      ) : (
                        <Button
                          variant="primary"
                          size="small"
                          onClick={task.action}
                          disabled={task.disabled}
                        >
                          {task.actionText}
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={styles.quickActions}
        >
          <Button variant="secondary" onClick={() => navigate('/rewards')}>
            🎁 Посмотреть призы
          </Button>
          {testResult && !completedGame && (
            <Button
              variant="primary"
              onClick={() => navigate(testResult === 'developer' ? '/game/bug-catcher' : '/game/color-match')}
            >
              🎮 Перейти к игре
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage

