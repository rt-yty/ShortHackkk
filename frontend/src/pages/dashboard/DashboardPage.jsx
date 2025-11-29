import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { useAdminStore } from '../../stores/adminStore'
import styles from './DashboardPage.module.css'

// Decorative images from Figma
const decorImages = {
  kiwi: 'https://www.figma.com/api/mcp/asset/4b0e3af0-cc19-418e-9c68-bf8b3fff4069',
  meat: 'https://www.figma.com/api/mcp/asset/4c0df568-edd4-4de6-b122-0bef2cbfef13',
  chicken: 'https://www.figma.com/api/mcp/asset/62468797-7987-4c4c-94ac-bdf7b1d1aeff',
  x5Logo: 'https://www.figma.com/api/mcp/asset/5fdb9a52-c1d9-4b78-8be6-233cb3364e25',
  raccoon: 'https://www.figma.com/api/mcp/asset/f7a133a4-fa94-4d0a-8969-4205924e62de',
}

// Task icons from Figma
const taskIcons = {
  test: 'https://www.figma.com/api/mcp/asset/86ec1648-7b08-41bb-8419-a0fa3da9108d',
  game: 'https://www.figma.com/api/mcp/asset/306ee58e-71ac-490e-a766-415cd5919427',
  application: 'https://www.figma.com/api/mcp/asset/6c422017-a0a2-4ab3-b59b-d428be37de45',
  gift: 'https://www.figma.com/api/mcp/asset/749fb503-21ca-47d9-b211-18f97bc14d89',
  check: 'https://www.figma.com/api/mcp/asset/efff3613-9b60-4bb7-b0cd-021a63fae5b7',
}

function DashboardPage() {
  const navigate = useNavigate()
  const { points, completedTest, completedGame, appliedForInternship, testResult } = useUserStore()
  const { eventName, prizes } = useAdminStore()

  const sortedPrizes = [...prizes].sort((a, b) => a.points - b.points)
  const nextPrize = sortedPrizes.find(prize => prize.points > points)

  // Определяем путь к игре: если направление не выбрано, идём на страницу выбора
  const getGamePath = () => {
    if (!testResult) {
      return '/direction-select'
    }
    return testResult === 'developer' ? '/game/bug-catcher' : '/game/color-match'
  }

  // Описание игры в зависимости от выбранного направления
  const getGameDescription = () => {
    if (!testResult) {
      return 'Выберите направление и сыграйте в мини-игру'
    }
    return testResult === 'developer' ? 'Bug-catcher - поймайте баги!' : 'Color Match - угадайте цвета!'
  }

  const tasks = [
    {
      id: 'test',
      title: 'Профориентационный тест',
      description: 'Узнайте, какое направление вам подходит',
      icon: taskIcons.test,
      emoji: '📝',
      points: 15,
      completed: completedTest,
      action: () => navigate('/test'),
      actionText: 'Пройти',
    },
    {
      id: 'game',
      title: 'Мини-игра',
      description: getGameDescription(),
      icon: taskIcons.game,
      emoji: '🎲',
      points: 25,
      completed: completedGame,
      action: () => navigate(getGamePath()),
      actionText: 'Играть',
    },
    {
      id: 'application',
      title: 'Заявка на стажировку',
      description: 'Подайте заявку в X5 Tech',
      icon: taskIcons.application,
      emoji: '📄',
      points: 35,
      completed: appliedForInternship,
      action: () => navigate('/application'),
      actionText: 'Подать',
    },
  ]

  const completedCount = tasks.filter(t => t.completed).length
  const progressPercentage = (completedCount / tasks.length) * 100

  return (
    <div className={styles.page}>
      {/* Background decorations */}
      <div className={styles.background}>
        <img 
          src={decorImages.kiwi} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage1}`}
        />
        <img 
          src={decorImages.meat} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage2}`}
        />
        <img 
          src={decorImages.chicken} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage3}`}
        />
      </div>

      <div className={styles.container}>
        {/* Event name */}
        {eventName && (
          <motion.p 
            className={styles.eventName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {eventName}
          </motion.p>
        )}

        {/* Main Card */}
        <motion.div 
          className={styles.mainCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className={styles.title}>Добро пожаловать!</h1>

          {/* Progress Card */}
          <div className={styles.progressCard}>
            <div className={styles.progressHeader}>
              <h2 className={styles.progressTitle}>Ваш прогресс</h2>
              <div className={styles.pointsBadge}>
                <img src={decorImages.raccoon} alt="" className={styles.pointsIcon} />
                <span className={styles.pointsValue}>{points}</span>
              </div>
            </div>

            <p className={styles.progressInfo}>
              Выполнено {completedCount} из {tasks.length} заданий
            </p>

            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBar} 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {nextPrize && (
              <div className={styles.nextPrize}>
                <div className={styles.nextPrizeLabel}>
                  <img src={taskIcons.gift} alt="" className={styles.nextPrizeIcon} />
                  <span>Следующий приз</span>
                </div>
                <span className={styles.nextPrizeName}>{nextPrize.name}</span>
                <span className={styles.nextPrizePoints}>{nextPrize.points} баллов</span>
              </div>
            )}
          </div>

          {/* View prizes link */}
          <div className={styles.viewPrizes}>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigate('/rewards'); }}
              className={styles.viewPrizesLink}
            >
              Посмотреть призы
            </a>
          </div>

          {/* Tasks Section */}
          <div className={styles.tasksSection}>
            <h2 className={styles.sectionTitle}>Задания</h2>
            
            <div className={styles.tasksList}>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={`${styles.taskCard} ${task.completed ? styles.completed : ''}`}
                  onClick={() => !task.completed && task.action()}
                  style={{ cursor: task.completed ? 'default' : 'pointer' }}
                >
                  <img 
                    src={task.icon} 
                    alt="" 
                    className={styles.taskIcon}
                    style={{ width: '38px', height: '38px' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                  <span className={styles.taskIcon} style={{ display: 'none' }}>{task.emoji}</span>
                  
                  <div className={styles.taskContent}>
                    <h3 className={styles.taskTitle}>{task.title}</h3>
                    <p className={styles.taskDescription}>{task.description}</p>
                  </div>

                  {task.completed ? (
                    <div className={styles.completedBadge}>
                      <img 
                        src={taskIcons.check} 
                        alt="✓" 
                        className={styles.completedIcon}
                        onError={(e) => { e.target.outerHTML = '✓'; }}
                      />
                    </div>
                  ) : (
                    <span className={styles.taskPointsBadge}>+ {task.points} баллов</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage
