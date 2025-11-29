import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from './BugCatcherGame.module.css'

const GAME_DURATION = 30
const BUG_EMOJIS = ['🐛', '🐜', '🪲', '🦗', '🕷️']

function BugCatcherGame() {
  const navigate = useNavigate()
  const { completedGame, completeGame, loading } = useUserStore()
  const gameAreaRef = useRef(null)
  
  const [gameState, setGameState] = useState('intro') // intro, playing, finished
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [score, setScore] = useState(0)
  const [bugs, setBugs] = useState([])
  const [spawnRate, setSpawnRate] = useState(2000)
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
    
    const newBug = {
      id: Date.now() + Math.random(),
      x: Math.random() * (area.width - bugSize),
      y: Math.random() * (area.height - bugSize),
      emoji: BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)],
      createdAt: Date.now(),
    }
    
    setBugs(prev => [...prev, newBug])
    
    // Remove bug after 3 seconds if not caught
    setTimeout(() => {
      setBugs(prev => prev.filter(bug => bug.id !== newBug.id))
    }, 3000)
  }, [])

  const catchBug = (bugId) => {
    setBugs(prev => prev.filter(bug => bug.id !== bugId))
    setScore(prev => prev + 1)
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
            <div className={styles.introIcon}>🐛</div>
            <h1 className={styles.introTitle}>Bug Catcher</h1>
            <p className={styles.introDescription}>
              Ловите баги! У вас 30 секунд, чтобы поймать как можно больше букашек. 
              Кликайте по ним, пока они не исчезли!
            </p>
            
            <div className={styles.introRules}>
              <h3>Правила:</h3>
              <ul>
                <li>🕐 Время игры: 30 секунд</li>
                <li>👆 Кликайте по букашкам, чтобы поймать их</li>
                <li>⚡ Со временем букашки появляются быстрее</li>
                <li>⭐ +25 баллов за игру + бонус за пойманных</li>
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
              Вы поймали <span className={styles.scoreHighlight}>{score}</span> букашек!
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
            <span className={styles.scoreIcon}>🐛</span>
            <span>{score}</span>
          </div>
        </div>

        <div 
          ref={gameAreaRef} 
          className={styles.gameArea}
        >
          {bugs.map(bug => (
            <motion.button
              key={bug.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className={styles.bug}
              style={{ left: bug.x, top: bug.y }}
              onClick={() => catchBug(bug.id)}
            >
              {bug.emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BugCatcherGame

