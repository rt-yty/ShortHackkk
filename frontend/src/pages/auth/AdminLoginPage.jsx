import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import styles from './AuthPage.module.css'

function AdminLoginPage() {
  const navigate = useNavigate()
  const { adminLogin, loading, error, clearError } = useUserStore()
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!formData.username) {
      newErrors.username = 'Введите логин'
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    if (validate()) {
      const success = await adminLogin(formData.username, formData.password)
      if (success) {
        navigate('/admin')
      }
    }
  }

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
    clearError()
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
            <span className={styles.logoText}>Admin</span>
          </h1>
        </div>

        <Card variant="elevated" padding="large" className={styles.card}>
          <h2 className={styles.title}>Вход для администратора</h2>
          <p className={styles.subtitle}>
            Введите данные администратора
          </p>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Логин"
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              error={errors.username}
              placeholder="admin"
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

            <Button type="submit" variant="primary" size="large" fullWidth disabled={loading}>
              {loading ? 'Вход...' : 'Войти как администратор'}
            </Button>
          </form>
        </Card>

        <Link to="/" className={styles.backLink}>
          ← Назад
        </Link>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage

