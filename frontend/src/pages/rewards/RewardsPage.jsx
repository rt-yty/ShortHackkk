import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { useAdminStore } from '../../stores/adminStore'
import Card from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import styles from './RewardsPage.module.css'

function RewardsPage() {
  const { points } = useUserStore()
  const { prizes } = useAdminStore()

  const sortedPrizes = [...prizes].sort((a, b) => a.points - b.points)
  const maxPoints = Math.max(...sortedPrizes.map(p => p.points), 100)
  
  const nextPrize = sortedPrizes.find(prize => prize.points > points)
  const earnedPrizes = sortedPrizes.filter(prize => prize.points <= points)

  const getProgressToNext = () => {
    if (!nextPrize) return 100
    const prevPrize = sortedPrizes.filter(p => p.points <= points).pop()
    const prevPoints = prevPrize ? prevPrize.points : 0
    return ((points - prevPoints) / (nextPrize.points - prevPoints)) * 100
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Призы и награды</h1>
          <p className={styles.subtitle}>
            Набирайте баллы и получайте ценные призы от X5 Tech
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="primary" padding="large" className={styles.pointsCard}>
            <div className={styles.pointsDisplay}>
              <span className={styles.pointsIcon}>⭐</span>
              <div className={styles.pointsInfo}>
                <span className={styles.pointsLabel}>Ваши баллы</span>
                <span className={styles.pointsValue}>{points}</span>
              </div>
            </div>
            
            {nextPrize && (
              <div className={styles.nextPrizeInfo}>
                <span>До следующего приза: {nextPrize.points - points} баллов</span>
                <ProgressBar
                  value={getProgressToNext()}
                  max={100}
                  showValue={false}
                  variant="warning"
                />
              </div>
            )}
          </Card>
        </motion.div>

        <div className={styles.prizesGrid}>
          {sortedPrizes.map((prize, index) => {
            const isEarned = points >= prize.points
            const isNext = nextPrize?.id === prize.id
            
            return (
              <motion.div
                key={prize.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Card
                  variant={isEarned ? 'default' : 'outlined'}
                  padding="medium"
                  className={`${styles.prizeCard} ${isEarned ? styles.earned : ''} ${isNext ? styles.next : ''}`}
                >
                  <div className={styles.prizeHeader}>
                    <div className={styles.prizePoints}>
                      <span className={styles.prizePointsValue}>{prize.points}</span>
                      <span className={styles.prizePointsLabel}>баллов</span>
                    </div>
                    {isEarned && (
                      <span className={styles.earnedBadge}>✓ Получено</span>
                    )}
                    {isNext && !isEarned && (
                      <span className={styles.nextBadge}>Следующий</span>
                    )}
                  </div>
                  
                  <h3 className={styles.prizeName}>{prize.name}</h3>
                  <p className={styles.prizeDescription}>{prize.description}</p>
                  
                  {!isEarned && (
                    <div className={styles.prizeProgress}>
                      <ProgressBar
                        value={Math.min(points, prize.points)}
                        max={prize.points}
                        showValue={false}
                        size="small"
                      />
                      <span className={styles.progressText}>
                        {points} / {prize.points}
                      </span>
                    </div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={styles.howToEarn}
        >
          <Card variant="default" padding="large">
            <h3 className={styles.howToEarnTitle}>Как заработать баллы?</h3>
            <div className={styles.earnMethods}>
              <div className={styles.earnMethod}>
                <span className={styles.earnIcon}>📝</span>
                <div>
                  <span className={styles.earnName}>Пройти профориентационный тест</span>
                  <span className={styles.earnPoints}>+15 баллов</span>
                </div>
              </div>
              <div className={styles.earnMethod}>
                <span className={styles.earnIcon}>🎮</span>
                <div>
                  <span className={styles.earnName}>Пройти мини-игру</span>
                  <span className={styles.earnPoints}>+25-50 баллов</span>
                </div>
              </div>
              <div className={styles.earnMethod}>
                <span className={styles.earnIcon}>📄</span>
                <div>
                  <span className={styles.earnName}>Подать заявку на стажировку</span>
                  <span className={styles.earnPoints}>+35 баллов</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default RewardsPage

