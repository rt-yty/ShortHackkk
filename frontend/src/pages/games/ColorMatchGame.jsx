import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from './ColorMatchGame.module.css'

const raccoonIcon = 'https://www.figma.com/api/mcp/asset/f7a133a4-fa94-4d0a-8969-4205924e62de'

// Цвета с необычными названиями для дизайнеров
const COLOR_ROUNDS = [
  // Раунд 1 - Зелёные оттенки и яркие
  {
    level: 1,
    title: 'Раунд 1: Зелёная палитра',
    colors: [
      { name: 'Цвет ёлки', hex: '#2A5C03', description: 'Тёмно-зелёный' },
      { name: 'Вердепомовый', hex: '#34C924', description: 'Ярко-зелёный' },
      { name: 'Гелиотроп', hex: '#DF73FF', description: 'Светло-фиолетовый' },
      { name: 'Электрик', hex: '#7DF9FF', description: 'Голубой электрик' },
      { name: 'Травяной', hex: '#5DA130', description: 'Средне-зелёный' },
    ],
  },
  // Раунд 2 - Розовые и синие оттенки
  {
    level: 2,
    title: 'Раунд 2: Розово-синяя гамма',
    colors: [
      { name: 'Звёзды в шоке', hex: '#FF47CA', description: 'Ярко-розовый' },
      { name: 'Азур', hex: '#007FFF', description: 'Яркий синий' },
      { name: 'Синий-синий иней', hex: '#AFDAFC', description: 'Светло-голубой' },
      { name: 'Фанданго', hex: '#B55489', description: 'Пурпурно-розовый' },
      { name: 'Пюсовый', hex: '#CC8899', description: 'Грязно-розовый' },
    ],
  },
  // Раунд 3 - Красные и серые
  {
    level: 3,
    title: 'Раунд 3: Финальный аккорд',
    colors: [
      { name: 'Сангина', hex: '#92000A', description: 'Тёмно-красный' },
      { name: 'Телемагента', hex: '#CF3476', description: 'Розово-красный' },
      { name: 'Гридеперлевый', hex: '#C7D0CC', description: 'Серо-жемчужный' },
      { name: 'Ализариновый красный', hex: '#E52322', description: 'Ярко-красный' },
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
  const { completedGame, completeGame, loading } = useUserStore()
  
  const [gameState, setGameState] = useState('intro') // intro, playing, roundComplete, finished, alreadyCompleted
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
  const [earnedPoints, setEarnedPoints] = useState(0)

  // Check if already completed on mount
  useEffect(() => {
    if (completedGame && gameState === 'intro') {
      setGameState('alreadyCompleted')
    }
  }, [completedGame, gameState])

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

  const checkMatch = async (color, name) => {
    if (color.name === name) {
      // Correct match
      const newMatches = [...matches, { ...color }]
      setMatches(newMatches)
      const newScore = score + 10
      setScore(newScore)
      setSelectedColor(null)
      setSelectedName(null)
      
      // Check if round complete
      const roundColorCount = COLOR_ROUNDS[currentRound].colors.length
      if (newMatches.length === roundColorCount) {
        if (currentRound < COLOR_ROUNDS.length - 1) {
          setGameState('roundComplete')
        } else {
          // Game finished
          setTotalTime(Math.floor((Date.now() - startTime) / 1000))
          setGameState('finished')
          const result = await completeGame('color_match', newScore)
          if (result) {
            setEarnedPoints(result.points_earned)
          } else {
            setEarnedPoints(25 + Math.min(Math.floor(newScore / 2), 25))
          }
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

  if (gameState === 'alreadyCompleted') {
    return (
      <div className={styles.page}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.introContainer}
        >
          <Card variant="elevated" padding="large" className={styles.introCard}>
            <div className={styles.introIcon}>✅</div>
            <h1 className={styles.introTitle}>Игра уже пройдена!</h1>
            <p className={styles.introDescription}>
              Вы уже проходили мини-игру и получили за неё баллы. 
              Повторное прохождение недоступно.
            </p>
            
            <div className={styles.actions}>
              <Button variant="primary" size="large" onClick={() => navigate('/dashboard')}>
                Вернуться в главное меню
              </Button>
              <Button variant="outline" onClick={() => navigate('/application')}>
                Подать заявку на стажировку
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
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
                <li><img src={raccoonIcon} alt="" className={styles.ruleIcon} /> +25 баллов за завершение + бонус</li>
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
              <img src={raccoonIcon} alt="" className={styles.pointsIcon} />
              <span>+{earnedPoints || (25 + Math.min(Math.floor(score / 2), 25))} баллов</span>
            </div>

            <div className={styles.applicationPromo}>
              <p className={styles.promoText}>
                🎯 Подайте заявку на стажировку и получите ещё <strong>+35 баллов</strong>!
              </p>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" size="large" onClick={() => navigate('/application')}>
                Подать заявку на стажировку
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
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
            <img src={raccoonIcon} alt="" className={styles.scoreIcon} />
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
            <span>Найдено: {matches.length} / {round.colors.length}</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ColorMatchGame

