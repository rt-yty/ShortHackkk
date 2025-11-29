import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import { useAdminStore } from '../../stores/adminStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import styles from './TestPage.module.css'

function TestPage() {
  const navigate = useNavigate()
  const { completedTest, completeTest, skipTest } = useUserStore()
  const { testQuestions } = useAdminStore()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  // Redirect if already completed
  if (completedTest) {
    navigate('/direction-select')
    return null
  }

  const handleAnswer = (option) => {
    setSelectedOption(option)
  }

  const handleNext = () => {
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
      
      completeTest(result)
      navigate('/test/result')
    }
  }

  const handleSkip = () => {
    skipTest()
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

