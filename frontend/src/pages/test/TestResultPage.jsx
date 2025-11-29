import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from './TestResultPage.module.css'

function TestResultPage() {
  const navigate = useNavigate()
  const { testResult, points } = useUserStore()

  const resultData = {
    developer: {
      title: 'Разработчик',
      emoji: '💻',
      description: 'Вы логически мыслите, любите решать сложные задачи и создавать что-то новое с помощью кода. Разработка — это ваше призвание!',
      color: '#3B82F6',
    },
    designer: {
      title: 'Дизайнер',
      emoji: '🎨',
      description: 'У вас развито чувство прекрасного, вы обращаете внимание на детали и умеете создавать удобные и красивые интерфейсы. UX/UI дизайн ждёт вас!',
      color: '#EC4899',
    },
  }

  const result = resultData[testResult] || resultData.developer

  const handleContinue = () => {
    if (testResult === 'developer') {
      navigate('/game/bug-catcher')
    } else {
      navigate('/game/color-match')
    }
  }

  return (
    <div className={styles.page}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={styles.container}
      >
        <Card variant="elevated" padding="large" className={styles.card}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={styles.emojiContainer}
            style={{ backgroundColor: `${result.color}20` }}
          >
            <span className={styles.emoji}>{result.emoji}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className={styles.title}>Ваш результат</h1>
            <h2 className={styles.resultTitle} style={{ color: result.color }}>
              {result.title}
            </h2>
            <p className={styles.description}>{result.description}</p>

            <div className={styles.pointsEarned}>
              <span className={styles.pointsIcon}>⭐</span>
              <span className={styles.pointsText}>+15 баллов за прохождение теста!</span>
            </div>

            <div className={styles.totalPoints}>
              Всего баллов: <strong>{points}</strong>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" size="large" onClick={handleContinue}>
                Перейти к мини-игре
              </Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                На главную
              </Button>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}

export default TestResultPage

