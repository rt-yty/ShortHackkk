import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from './BugCatcherGame.module.css'

const GAME_DURATION = 30
const X5_CHANCE = 0.12 // 12% шанс X5 логотипа
const BUG_SPEED_MIN = 2.5 // минимальная скорость пересечения экрана (сек)
const BUG_SPEED_MAX = 4.5 // максимальная скорость

// Отдельный компонент жука с CSS анимацией
function Bug({ bug, onCatch }) {
  const [position, setPosition] = useState({ x: bug.startX, y: bug.startY })
  const [caught, setCaught] = useState(false)
  
  useEffect(() => {
    // Запускаем анимацию сразу после монтирования
    const timer = requestAnimationFrame(() => {
      setPosition({ x: bug.endX, y: bug.endY })
    })
    return () => cancelAnimationFrame(timer)
  }, [bug.endX, bug.endY])
  
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!caught) {
      setCaught(true)
      onCatch(bug.id, bug.isX5)
    }
  }
  
  if (caught) return null
  
  return (
    <button
      className={`${styles.bug} ${bug.isX5 ? styles.bugX5 : styles.bugLadybug}`}
      style={{
        left: position.x,
        top: position.y,
        transform: `rotate(${bug.rotation}deg)`,
        transition: `left ${bug.duration}s linear, top ${bug.duration}s linear`,
      }}
      onClick={handleClick}
      onPointerDown={handleClick}
    >
      {bug.isX5 ? (
        <span className={styles.x5Logo}>X5</span>
      ) : (
        '🐞'
      )}
    </button>
  )
}

function BugCatcherGame() {
  const navigate = useNavigate()
  const { completedGame, completeGame, loading } = useUserStore()
  const gameAreaRef = useRef(null)
  
  const [gameState, setGameState] = useState('intro') // intro, playing, finished
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [score, setScore] = useState(0)
  const [bugs, setBugs] = useState([])
  const [spawnRate, setSpawnRate] = useState(1200)
  const [earnedPoints, setEarnedPoints] = useState(0)

  // Redirect if already completed
  if (completedGame && gameState === 'intro') {
    navigate('/application')
    return null
  }

  const spawnBug = useCallback(() => {
    if (!gameAreaRef.current) return
    
    const area = gameAreaRef.current.getBoundingClientRect()
    const bugSize = 50
    
    // Определяем тип: божья коровка или X5
    const isX5 = Math.random() < X5_CHANCE
    
    // Выбираем случайную сторону для появления (0=left, 1=right, 2=top, 3=bottom)
    const side = Math.floor(Math.random() * 4)
    
    let startX, startY, endX, endY, rotation
    
    // Вычисляем начальную и конечную позицию в зависимости от стороны
    switch (side) {
      case 0: // Слева направо
        startX = -bugSize
        startY = Math.random() * (area.height - bugSize)
        endX = area.width + bugSize
        endY = startY + (Math.random() - 0.5) * area.height * 0.8
        break
      case 1: // Справа налево
        startX = area.width + bugSize
        startY = Math.random() * (area.height - bugSize)
        endX = -bugSize
        endY = startY + (Math.random() - 0.5) * area.height * 0.8
        break
      case 2: // Сверху вниз
        startX = Math.random() * (area.width - bugSize)
        startY = -bugSize
        endX = startX + (Math.random() - 0.5) * area.width * 0.8
        endY = area.height + bugSize
        break
      case 3: // Снизу вверх
        startX = Math.random() * (area.width - bugSize)
        startY = area.height + bugSize
        endX = startX + (Math.random() - 0.5) * area.width * 0.8
        endY = -bugSize
        break
      default:
        startX = -bugSize
        startY = area.height / 2
        endX = area.width + bugSize
        endY = area.height / 2
    }
    
    // Вычисляем угол поворота по направлению движения (в градусах)
    // atan2 возвращает угол в радианах, конвертируем в градусы
    // Добавляем 90° потому что эмодзи божьей коровки смотрит вверх по умолчанию
    const deltaX = endX - startX
    const deltaY = endY - startY
    rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90
    
    // Случайная скорость пересечения
    const duration = BUG_SPEED_MIN + Math.random() * (BUG_SPEED_MAX - BUG_SPEED_MIN)
    
    const newBug = {
      id: Date.now() + Math.random(),
      startX,
      startY,
      endX,
      endY,
      rotation,
      duration,
      isX5,
      createdAt: Date.now(),
    }
    
    setBugs(prev => [...prev, newBug])
    
    // Удаляем жука после завершения анимации
    setTimeout(() => {
      setBugs(prev => prev.filter(bug => bug.id !== newBug.id))
    }, duration * 1000 + 100)
  }, [])

  const catchBug = (bugId, isX5) => {
    setBugs(prev => prev.filter(bug => bug.id !== bugId))
    // X5 даёт 5 очков, обычная божья коровка - 1
    setScore(prev => prev + (isX5 ? 5 : 1))
  }

  const startGame = () => {
    setGameState('playing')
    setTimeLeft(GAME_DURATION)
    setScore(0)
    setBugs([])
    setSpawnRate(2000)
  }

  const endGame = useCallback(async () => {
    setGameState('finished')
    setBugs([])
    const result = await completeGame('bug_catcher', score)
    if (result) {
      setEarnedPoints(result.points_earned)
    } else {
      // Fallback: расчёт баллов локально
      setEarnedPoints(25 + Math.min(Math.floor(score / 2), 25))
    }
  }, [score, completeGame])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [gameState, endGame])

  // Spawn bugs
  useEffect(() => {
    if (gameState !== 'playing') return
    
    const spawner = setInterval(spawnBug, spawnRate)
    
    return () => clearInterval(spawner)
  }, [gameState, spawnRate, spawnBug])

  // Increase difficulty over time
  useEffect(() => {
    if (gameState !== 'playing') return
    
    // Speed up spawning as time passes
    if (timeLeft <= 20 && timeLeft > 10) {
      setSpawnRate(1500)
    } else if (timeLeft <= 10 && timeLeft > 5) {
      setSpawnRate(1000)
    } else if (timeLeft <= 5) {
      setSpawnRate(500)
    }
  }, [timeLeft, gameState])

  if (gameState === 'intro') {
    return (
      <div className={styles.page}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.introContainer}
        >
          <Card variant="elevated" padding="large" className={styles.introCard}>
            <div className={styles.introIcon}>🐞</div>
            <h1 className={styles.introTitle}>Bug Catcher</h1>
            <p className={styles.introDescription}>
              Ловите божьих коровок! У вас 30 секунд, чтобы поймать как можно больше. 
              Они быстро пробегают через экран — ловите их на лету!
            </p>
            
            <div className={styles.introRules}>
              <h3>Правила:</h3>
              <ul>
                <li>🕐 Время игры: 30 секунд</li>
                <li>🐞 Кликайте по божьим коровкам — +1 очко</li>
                <li>⭐ Ловите редкие логотипы <span className={styles.x5Badge}>X5</span> — бонус ×5!</li>
                <li>⚡ Со временем насекомые появляются быстрее</li>
              </ul>
            </div>

            <Button variant="primary" size="large" onClick={startGame}>
              Начать игру!
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (gameState === 'finished') {
    return (
      <div className={styles.page}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.introContainer}
        >
          <Card variant="elevated" padding="large" className={styles.introCard}>
            <div className={styles.introIcon}>🎉</div>
            <h1 className={styles.introTitle}>Отлично!</h1>
            <p className={styles.resultText}>
              Вы набрали <span className={styles.scoreHighlight}>{score}</span> очков!
            </p>
            
            <div className={styles.pointsEarned}>
              <span className={styles.pointsIcon}>⭐</span>
              <span>+{earnedPoints || (25 + Math.min(Math.floor(score / 2), 25))} баллов</span>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" size="large" onClick={() => navigate('/application')}>
                Продолжить
              </Button>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                На главную
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.gameContainer}>
        <div className={styles.gameHeader}>
          <div className={styles.timer}>
            <span className={styles.timerIcon}>⏱️</span>
            <span className={timeLeft <= 5 ? styles.timerDanger : ''}>{timeLeft}с</span>
          </div>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreIcon}>🐞</span>
            <span>{score}</span>
          </div>
        </div>

        <div 
          ref={gameAreaRef} 
          className={styles.gameArea}
        >
          {bugs.map(bug => (
            <Bug 
              key={bug.id} 
              bug={bug} 
              onCatch={catchBug}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BugCatcherGame

