import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import styles from './ApplicationPage.module.css'

function ApplicationPage() {
  const navigate = useNavigate()
  const { appliedForInternship, submitApplication, testResult, loading, error, clearError } = useUserStore()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    direction: testResult || 'developer',
    motivation: '',
  })
  const [resumeFile, setResumeFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  if (appliedForInternship && !submitted) {
    return (
      <div className={styles.page}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.container}
        >
          <Card variant="elevated" padding="large" className={styles.card}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.title}>Заявка уже отправлена</h1>
            <p className={styles.description}>
              Вы уже подали заявку на стажировку в X5 Tech. Мы свяжемся с вами в ближайшее время!
            </p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              На главную
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Введите ФИО'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    if (validate()) {
      // Создаём FormData для отправки
      const submitData = new FormData()
      submitData.append('full_name', formData.fullName)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('direction', formData.direction)
      if (formData.motivation) {
        submitData.append('motivation', formData.motivation)
      }
      if (resumeFile) {
        submitData.append('resume', resumeFile)
      }
      
      const success = await submitApplication(submitData)
      if (success) {
        setSubmitted(true)
      }
    }
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'Файл слишком большой (макс. 5 МБ)' }))
        return
      }
      setResumeFile(file)
      setErrors(prev => ({ ...prev, resume: null }))
    }
  }

  if (submitted) {
    return (
      <div className={styles.page}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.container}
        >
          <Card variant="elevated" padding="large" className={styles.card}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className={styles.successIcon}
            >
              🎉
            </motion.div>
            <h1 className={styles.title}>Заявка отправлена!</h1>
            <p className={styles.description}>
              Спасибо за интерес к стажировке в X5 Tech! Мы рассмотрим вашу заявку и свяжемся с вами в ближайшее время.
            </p>
            
            <div className={styles.pointsEarned}>
              <span className={styles.pointsIcon}>⭐</span>
              <span>+35 баллов за отправку заявки!</span>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" size="large" onClick={() => navigate('/rewards')}>
                Посмотреть призы
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
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.header}
        >
          <h1 className={styles.pageTitle}>Заявка на стажировку</h1>
          <p className={styles.pageSubtitle}>
            Заполните форму, чтобы подать заявку на стажировку в X5 Tech
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="elevated" padding="large">
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="ФИО"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                error={errors.fullName}
                placeholder="Иванов Иван Иванович"
                fullWidth
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                error={errors.email}
                placeholder="example@mail.ru"
                fullWidth
              />

              <Input
                label="Телефон"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                error={errors.phone}
                placeholder="+7 (999) 999-99-99"
                fullWidth
              />

              <div className={styles.selectGroup}>
                <label className={styles.label}>Направление</label>
                <select
                  value={formData.direction}
                  onChange={handleChange('direction')}
                  className={styles.select}
                >
                  <option value="developer">Разработка</option>
                  <option value="designer">Дизайн</option>
                </select>
              </div>

              <div className={styles.textareaGroup}>
                <label className={styles.label}>Почему вы хотите стажироваться в X5 Tech?</label>
                <textarea
                  value={formData.motivation}
                  onChange={handleChange('motivation')}
                  placeholder="Расскажите о своей мотивации..."
                  className={styles.textarea}
                  rows={4}
                />
              </div>

              <div className={styles.fileGroup}>
                <label className={styles.label}>Резюме (необязательно)</label>
                <div className={styles.fileInput}>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    id="resume"
                    className={styles.fileInputHidden}
                  />
                  <label htmlFor="resume" className={styles.fileLabel}>
                    <span className={styles.fileIcon}>📎</span>
                    <span>{resumeFile ? resumeFile.name : 'Выберите файл (PDF, DOC)'}</span>
                  </label>
                </div>
                {errors.resume && <span className={styles.error}>{errors.resume}</span>}
              </div>

              {error && (
                <div className={styles.error} style={{ marginBottom: '1rem', color: '#ef4444' }}>
                  {error}
                </div>
              )}

              <div className={styles.submitSection}>
                <div className={styles.bonusInfo}>
                  <span className={styles.bonusIcon}>⭐</span>
                  <span>+35 баллов за отправку заявки</span>
                </div>
                <Button type="submit" variant="primary" size="large" fullWidth disabled={loading}>
                  {loading ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ApplicationPage

