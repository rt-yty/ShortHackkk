import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from './ColorMatchGame.module.css'

// Цвета с необычными названиями (оттенки зеленого и другие)
const COLOR_ROUNDS = [
  // Раунд 1 - Простой
  {
    level: 1,
    title: 'Раунд 1: Разминка',
    colors: [
      { name: 'Лазурный', hex: '#007FFF', description: 'Яркий синий' },
      { name: 'Коралловый', hex: '#FF7F50', description: 'Оранжево-розовый' },
      { name: 'Шартрез', hex: '#7FFF00', description: 'Желто-зеленый' },
    ],
  },
  // Раунд 2 - Средний
  {
    level: 2,
    title: 'Раунд 2: Усложнение',
    colors: [
      { name: 'Селадон', hex: '#ACE1AF', description: 'Бледно-зеленый' },
      { name: 'Фалунский красный', hex: '#801818', description: 'Тёмно-красный' },
      { name: 'Глициния', hex: '#C9A0DC', description: 'Светло-фиолетовый' },
    ],
  },
  // Раунд 3 - Сложный
  {
    level: 3,
    title: 'Раунд 3: Эксперт',
    colors: [
      { name: 'Синий Клейна', hex: '#002FA7', description: 'Глубокий синий' },
      { name: 'Циннвальдит', hex: '#EBC2AF', description: 'Бежево-розовый' },
      { name: 'Вердигри', hex: '#43B3AE', description: 'Сине-зеленый' },
    ],
  },
]

function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function ColorMatchGame() {
  const navigate = useNavigate()
  const { completedGame, completeGame } = useUserStore()
  
  const [gameState, setGameState] = useState('intro') // intro, playing, roundComplete, finished
  const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedName, setSelectedName] = useState(null)
  const [matches, setMatches] = useState([])
  const [shuffledColors, setShuffledColors] = useState([])
  const [shuffledNames, setShuffledNames] = useState([])
  const [wrongMatch, setWrongMatch] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [totalTime, setTotalTime] = useState(0)

  // Redirect if already completed
  if (completedGame && gameState === 'intro') {
    navigate('/application')
    return null
  }

  const initRound = (roundIndex) => {
    const round = COLOR_ROUNDS[roundIndex]
    setShuffledColors(shuffleArray(round.colors))
    setShuffledNames(shuffleArray(round.colors.map(c => c.name)))
    setMatches([])
    setSelectedColor(null)
    setSelectedName(null)
    setWrongMatch(false)
  }

  const startGame = () => {
    setGameState('playing')
    setCurrentRound(0)
    setScore(0)
    setStartTime(Date.now())
    initRound(0)
  }

  const handleColorClick = (color) => {
    if (matches.find(m => m.hex === color.hex)) return
    setSelectedColor(color)
    setWrongMatch(false)
    
    if (selectedName) {
      checkMatch(color, selectedName)
    }
  }

  const handleNameClick = (name) => {
    if (matches.find(m => m.name === name)) return
    setSelectedName(name)
    setWrongMatch(false)
    
    if (selectedColor) {
      checkMatch(selectedColor, name)
    }
  }

  const checkMatch = (color, name) => {
    if (color.name === name) {
      // Correct match
      const newMatches = [...matches, { ...color }]
      setMatches(newMatches)
      setScore(prev => prev + 10)
      setSelectedColor(null)
      setSelectedName(null)
      
      // Check if round complete
      if (newMatches.length === 3) {
        if (currentRound < COLOR_ROUNDS.length - 1) {
          setGameState('roundComplete')
        } else {
          // Game finished
          setTotalTime(Math.floor((Date.now() - startTime) / 1000))
          setGameState('finished')
          completeGame(score + 10)
        }
      }
    } else {
      // Wrong match
      setWrongMatch(true)
      setScore(prev => Math.max(0, prev - 2))
      setTimeout(() => {
        setSelectedColor(null)
        setSelectedName(null)
        setWrongMatch(false)
      }, 500)
    }
  }

  const nextRound = () => {
    const nextRoundIndex = currentRound + 1
    setCurrentRound(nextRoundIndex)
    initRound(nextRoundIndex)
    setGameState('playing')
  }

  if (gameState === 'intro') {
    return (
      <div className={styles.page}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.introContainer}
        >
          <Card variant="elevated" padding="large" className={styles.introCard}>
            <div className={styles.introIcon}>🎨</div>
            <h1 className={styles.introTitle}>Color Match</h1>
            <p className={styles.introDescription}>
              Проверьте свои знания о цветах! Сопоставьте необычные названия цветов с их оттенками.
            </p>
            
            <div className={styles.introRules}>
              <h3>Правила:</h3>
              <ul>
                <li>🎯 3 раунда с увеличением сложности</li>
                <li>🖱️ Кликните на цвет, затем на его название</li>
                <li>✅ +10 баллов за правильную пару</li>
                <li>❌ -2 балла за ошибку</li>
                <li>⭐ +25 баллов за завершение + бонус</li>
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

  if (gameState === 'roundComplete') {
    return (
      <div className={styles.page}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.introContainer}
        >
          <Card variant="elevated" padding="large" className={styles.introCard}>
            <div className={styles.introIcon}>✨</div>
            <h1 className={styles.introTitle}>Раунд пройден!</h1>
            <p className={styles.resultText}>
              Текущий счёт: <span className={styles.scoreHighlight}>{score}</span>
            </p>
            
            <Button variant="primary" size="large" onClick={nextRound}>
              Следующий раунд →
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
            <div className={styles.introIcon}>🏆</div>
            <h1 className={styles.introTitle}>Поздравляем!</h1>
            <p className={styles.resultText}>
              Финальный счёт: <span className={styles.scoreHighlight}>{score}</span>
            </p>
            <p className={styles.timeText}>
              Время: {totalTime} секунд
            </p>
            
            <div className={styles.pointsEarned}>
              <span className={styles.pointsIcon}>⭐</span>
              <span>+{25 + Math.min(Math.floor(score / 2), 25)} баллов</span>
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

  const round = COLOR_ROUNDS[currentRound]

  return (
    <div className={styles.page}>
      <div className={styles.gameContainer}>
        <div className={styles.gameHeader}>
          <h2 className={styles.roundTitle}>{round.title}</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreIcon}>⭐</span>
            <span>{score}</span>
          </div>
        </div>

        <Card variant="elevated" padding="large" className={styles.gameCard}>
          <div className={styles.gameGrid}>
            {/* Colors */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Цвета</h3>
              <div className={styles.items}>
                {shuffledColors.map((color, index) => {
                  const isMatched = matches.find(m => m.hex === color.hex)
                  const isSelected = selectedColor?.hex === color.hex
                  
                  return (
                    <motion.button
                      key={color.hex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${styles.colorBox} ${isMatched ? styles.matched : ''} ${isSelected ? styles.selected : ''} ${wrongMatch && isSelected ? styles.wrong : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorClick(color)}
                      disabled={isMatched}
                    >
                      {isMatched && <span className={styles.checkmark}>✓</span>}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Names */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Названия</h3>
              <div className={styles.items}>
                {shuffledNames.map((name, index) => {
                  const isMatched = matches.find(m => m.name === name)
                  const isSelected = selectedName === name
                  
                  return (
                    <motion.button
                      key={name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${styles.nameBox} ${isMatched ? styles.matched : ''} ${isSelected ? styles.selected : ''} ${wrongMatch && isSelected ? styles.wrong : ''}`}
                      onClick={() => handleNameClick(name)}
                      disabled={isMatched}
                    >
                      {name}
                      {isMatched && <span className={styles.checkmark}>✓</span>}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className={styles.progress}>
            <span>Найдено: {matches.length} / 3</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ColorMatchGame

