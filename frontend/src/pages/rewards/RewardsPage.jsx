import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { prizesApi } from '../../api/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import Modal from '../../components/ui/Modal'
import styles from './RewardsPage.module.css'

// Raccoon icon from Figma
const raccoonIcon = 'https://www.figma.com/api/mcp/asset/f7a133a4-fa94-4d0a-8969-4205924e62de'

function RewardsPage() {
  const { points, claimedPrizes, claimPrize: userClaimPrize, loading } = useUserStore()
  const [prizes, setPrizes] = useState([])
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, prize: null })
  const [successMessage, setSuccessMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем призы через публичный API при монтировании
  const loadPrizes = async () => {
    try {
      const data = await prizesApi.getAll()
      setPrizes(data)
    } catch (error) {
      console.error('Ошибка загрузки призов:', error)
    }
  }

  useEffect(() => {
    const init = async () => {
      await loadPrizes()
      setIsLoading(false)
    }
    init()
  }, [])

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Загрузка призов...
          </div>
        </div>
      </div>
    )
  }

  const sortedPrizes = [...prizes].sort((a, b) => a.points - b.points)
  
  // Доступные призы - те на которые хватает баллов и которые есть в наличии
  const availablePrizes = sortedPrizes.filter(
    prize => prize.points <= points && prize.quantity > 0 && !claimedPrizes.includes(prize.id)
  )
  
  const nextAffordablePrize = sortedPrizes.find(
    prize => prize.points > points && prize.quantity > 0 && !claimedPrizes.includes(prize.id)
  )

  const getProgressToNext = () => {
    if (!nextAffordablePrize) return 100
    const prevPrize = sortedPrizes.filter(p => p.points <= points).pop()
    const prevPoints = prevPrize ? prevPrize.points : 0
    return ((points - prevPoints) / (nextAffordablePrize.points - prevPoints)) * 100
  }

  const handleClaimPrize = (prize) => {
    setConfirmModal({ isOpen: true, prize })
  }

  const confirmClaimPrize = async () => {
    const prize = confirmModal.prize
    if (prize) {
      // Получаем приз через API
      const success = await userClaimPrize(prize.id, prize.name, prize.points)
      
      if (success) {
        setSuccessMessage(`Вы получили "${prize.name}"! Подойдите на стойку регистрации для получения.`)
        // Обновляем список призов через публичный API
        await loadPrizes()
        setTimeout(() => setSuccessMessage(null), 5000)
      }
    }
    setConfirmModal({ isOpen: false, prize: null })
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
              <img src={raccoonIcon} alt="" className={styles.pointsIcon} />
              <div className={styles.pointsInfo}>
                <span className={styles.pointsLabel}>Ваши баллы</span>
                <span className={styles.pointsValue}>{points}</span>
              </div>
            </div>
            
            {nextAffordablePrize && (
              <div className={styles.nextPrizeInfo}>
                <span>До следующего приза: {nextAffordablePrize.points - points} баллов</span>
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

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.successMessage}
            >
              <span className={styles.successIcon}>🎉</span>
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.prizesGrid}>
          {sortedPrizes.map((prize, index) => {
            const canAfford = points >= prize.points
            const isClaimed = claimedPrizes.includes(prize.id)
            const isOutOfStock = prize.quantity === 0
            const canClaim = canAfford && !isClaimed && !isOutOfStock
            const isNext = nextAffordablePrize?.id === prize.id
            
            return (
              <motion.div
                key={prize.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Card
                  variant={isClaimed ? 'default' : 'outlined'}
                  padding="medium"
                  className={`${styles.prizeCard} ${isClaimed ? styles.claimed : ''} ${canClaim ? styles.available : ''} ${isNext ? styles.next : ''} ${isOutOfStock ? styles.outOfStock : ''}`}
                >
                  <div className={styles.prizeHeader}>
                    <div className={styles.prizePoints}>
                      <span className={styles.prizePointsValue}>{prize.points}</span>
                      <span className={styles.prizePointsLabel}>баллов</span>
                    </div>
                    <div className={styles.prizeBadges}>
                      {isClaimed && (
                        <span className={styles.claimedBadge}>✓ Получено</span>
                      )}
                      {isOutOfStock && !isClaimed && (
                        <span className={styles.outOfStockBadge}>Нет в наличии</span>
                      )}
                      {isNext && !isClaimed && !isOutOfStock && (
                        <span className={styles.nextBadge}>Следующий</span>
                      )}
                      {canClaim && (
                        <span className={styles.availableBadge}>Доступно!</span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className={styles.prizeName}>{prize.name}</h3>
                  <p className={styles.prizeDescription}>{prize.description}</p>
                  
                  <div className={styles.prizeStock}>
                    <span className={styles.stockLabel}>В наличии:</span>
                    <span className={`${styles.stockValue} ${isOutOfStock ? styles.stockEmpty : ''}`}>
                      {prize.quantity} шт.
                    </span>
                  </div>
                  
                  {!isClaimed && !canAfford && !isOutOfStock && (
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
                  
                  {canClaim && (
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => handleClaimPrize(prize)}
                      className={styles.claimButton}
                    >
                      🎁 Получить приз
                    </Button>
                  )}
                  
                  {isClaimed && (
                    <div className={styles.claimedInfo}>
                      Подойдите на стойку регистрации для получения
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

      {/* Confirm Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, prize: null })}
        title="Подтверждение"
      >
        {confirmModal.prize && (
          <div className={styles.confirmModal}>
            <div className={styles.confirmPrizeInfo}>
              <span className={styles.confirmPrizeIcon}>🎁</span>
              <h4 className={styles.confirmPrizeName}>{confirmModal.prize.name}</h4>
              <p className={styles.confirmPrizeDescription}>{confirmModal.prize.description}</p>
            </div>
            <div className={styles.confirmCost}>
              <span>Стоимость:</span>
              <strong>{confirmModal.prize.points} баллов</strong>
            </div>
            <div className={styles.confirmBalance}>
              <span>Ваш баланс после получения:</span>
              <strong>{points - confirmModal.prize.points} баллов</strong>
            </div>
            <div className={styles.confirmActions}>
              <Button
                variant="primary"
                fullWidth
                onClick={confirmClaimPrize}
              >
                Подтвердить получение
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => setConfirmModal({ isOpen: false, prize: null })}
              >
                Отмена
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default RewardsPage

