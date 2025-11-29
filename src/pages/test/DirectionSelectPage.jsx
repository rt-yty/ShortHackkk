import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from './DirectionSelectPage.module.css'

function DirectionSelectPage() {
  const navigate = useNavigate()
  const { testResult, setDirection, completedGame } = useUserStore()

  // If test result exists and game not completed, redirect to appropriate game
  if (testResult && !completedGame) {
    const gamePath = testResult === 'developer' ? '/game/bug-catcher' : '/game/color-match'
    navigate(gamePath)
    return null
  }

  const handleSelect = (direction) => {
    setDirection(direction)
    const gamePath = direction === 'developer' ? '/game/bug-catcher' : '/game/color-match'
    navigate(gamePath)
  }

  const directions = [
    {
      id: 'developer',
      title: 'Разработчик',
      emoji: '💻',
      description: 'Создавайте программы, решайте технические задачи и автоматизируйте процессы',
      skills: ['JavaScript', 'Python', 'Алгоритмы', 'Базы данных'],
      color: '#3B82F6',
      game: 'Bug Catcher - ловите баги за 30 секунд!',
    },
    {
      id: 'designer',
      title: 'Дизайнер',
      emoji: '🎨',
      description: 'Проектируйте интерфейсы, работайте с визуалом и улучшайте пользовательский опыт',
      skills: ['Figma', 'UI/UX', 'Типографика', 'Цветоведение'],
      color: '#EC4899',
      game: 'Color Match - угадайте цвета за 3 раунда!',
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Выберите направление</h1>
          <p className={styles.subtitle}>
            Выберите интересующее вас направление и пройдите мини-игру
          </p>
        </motion.div>

        <div className={styles.grid}>
          {directions.map((direction, index) => (
            <motion.div
              key={direction.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Card
                variant="elevated"
                padding="large"
                className={styles.directionCard}
                onClick={() => handleSelect(direction.id)}
              >
                <div
                  className={styles.iconContainer}
                  style={{ backgroundColor: `${direction.color}15` }}
                >
                  <span className={styles.emoji}>{direction.emoji}</span>
                </div>

                <h2 className={styles.directionTitle} style={{ color: direction.color }}>
                  {direction.title}
                </h2>
                
                <p className={styles.description}>{direction.description}</p>

                <div className={styles.skills}>
                  {direction.skills.map((skill) => (
                    <span
                      key={skill}
                      className={styles.skill}
                      style={{ backgroundColor: `${direction.color}15`, color: direction.color }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className={styles.gameInfo}>
                  <span className={styles.gameIcon}>🎮</span>
                  <span className={styles.gameText}>{direction.game}</span>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  style={{ backgroundColor: direction.color }}
                >
                  Выбрать
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DirectionSelectPage

