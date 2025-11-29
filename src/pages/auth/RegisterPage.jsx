import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import styles from './AuthPage.module.css'

function RegisterPage() {
  const navigate = useNavigate()
  const register = useUserStore((state) => state.register)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Введите email'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      register(formData.email, formData.password)
      navigate('/test')
    }
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
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
          <h2 className={styles.title}>Регистрация</h2>
          <p className={styles.subtitle}>
            Создайте аккаунт для участия
          </p>

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
              placeholder="Минимум 6 символов"
              fullWidth
            />
            
            <Input
              label="Подтвердите пароль"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="Повторите пароль"
              fullWidth
            />

            <Button type="submit" variant="primary" size="large" fullWidth>
              Зарегистрироваться
            </Button>
          </form>

          <p className={styles.linkText}>
            Уже есть аккаунт?{' '}
            <Link to="/login" className={styles.link}>
              Войти
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

export default RegisterPage

