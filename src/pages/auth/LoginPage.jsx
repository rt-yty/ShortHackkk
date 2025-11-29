import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import styles from './AuthPage.module.css'

function LoginPage() {
  const navigate = useNavigate()
  const login = useUserStore((state) => state.login)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loginError, setLoginError] = useState('')

  const validate = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Введите email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoginError('')
    
    if (validate()) {
      const success = login(formData.email, formData.password)
      if (success) {
        navigate('/dashboard')
      } else {
        setLoginError('Пользователь не найден. Пройдите регистрацию.')
      }
    }
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
    setLoginError('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.background}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.container}
      >
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>
            <span className={styles.logoX5}>X5</span>
            <span className={styles.logoText}>For Students</span>
          </h1>
        </div>

        <Card variant="elevated" padding="large" className={styles.card}>
          <h2 className={styles.title}>Вход</h2>
          <p className={styles.subtitle}>
            Войдите в свой аккаунт
          </p>

          {loginError && (
            <div className={styles.errorMessage}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
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
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              placeholder="Введите пароль"
              fullWidth
            />

            <Button type="submit" variant="primary" size="large" fullWidth>
              Войти
            </Button>
          </form>

          <p className={styles.linkText}>
            Нет аккаунта?{' '}
            <Link to="/register" className={styles.link}>
              Зарегистрироваться
            </Link>
          </p>
        </Card>

        <Link to="/" className={styles.backLink}>
          ← Назад
        </Link>
      </motion.div>
    </div>
  )
}

export default LoginPage

