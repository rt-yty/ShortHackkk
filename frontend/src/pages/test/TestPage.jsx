import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { useAdminStore } from '../../stores/adminStore'
import { testApi } from '../../api/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import styles from './TestPage.module.css'

function TestPage() {
  const navigate = useNavigate()
  const { completedTest, completeTest, skipTest, loading } = useUserStore()
  const { testQuestions, fetchTestQuestions } = useAdminStore()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Загружаем вопросы при монтировании
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Пробуем загрузить через API для авторизованного пользователя
        const questions = await testApi.getQuestions()
        if (questions.length === 0) {
          await fetchTestQuestions()
        } else {
          // Обновляем store
          await fetchTestQuestions()
        }
      } catch (error) {
        // Fallback на данные из adminStore
        await fetchTestQuestions()
      }
      setIsLoading(false)
    }
    loadQuestions()
  }, [fetchTestQuestions])

  // Redirect if already completed
  if (completedTest) {
    navigate('/direction-select')
    return null
  }

  // Показываем загрузку
  if (isLoading || testQuestions.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Загрузка вопросов...
          </div>
        </div>
      </div>
    )
  }

  const handleAnswer = (option) => {
    setSelectedOption(option)
  }

  const handleNext = async () => {
    if (selectedOption === null) return
    
    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)
    
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
    } else {
      // Calculate result
      const developerScore = newAnswers.filter(a => a === 'developer').length
      const designerScore = newAnswers.filter(a => a === 'designer').length
      const result = developerScore >= designerScore ? 'developer' : 'designer'
      
      await completeTest(result)
      navigate('/test/result')
    }
  }

  const handleSkip = async () => {
    await skipTest()
    navigate('/direction-select')
  }

  const question = testQuestions[currentQuestion]

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.title}>Профориентационный тест</h1>
          <p className={styles.subtitle}>
            Ответьте на вопросы, чтобы узнать, какое направление вам подходит
          </p>
        </motion.div>

        <ProgressBar
          value={currentQuestion + 1}
          max={testQuestions.length}
          label={`Вопрос ${currentQuestion + 1} из ${testQuestions.length}`}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card variant="elevated" padding="large" className={styles.questionCard}>
              <h2 className={styles.questionText}>{question.question}</h2>
              
              <div className={styles.options}>
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className={`${styles.option} ${selectedOption === option.type ? styles.selected : ''}`}
                    onClick={() => handleAnswer(option.type)}
                  >
                    <span className={styles.optionIndicator}>
                      {selectedOption === option.type ? '●' : '○'}
                    </span>
                    <span className={styles.optionText}>{option.text}</span>
                  </button>
                ))}
              </div>

              <div className={styles.actions}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleNext}
                  disabled={selectedOption === null}
                >
                  {currentQuestion < testQuestions.length - 1 ? 'Далее' : 'Завершить'}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className={styles.skipSection}>
          <Button variant="ghost" onClick={handleSkip}>
            Пропустить тест и выбрать направление самостоятельно
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TestPage

