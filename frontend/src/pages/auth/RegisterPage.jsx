import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import styles from './AuthPage.module.css'

// Decorative images from Figma design
const decorImages = {
  lettuce: 'https://www.figma.com/api/mcp/asset/340426f7-1dba-4d62-92f4-ea2f174d3b2a',
  bagel: 'https://www.figma.com/api/mcp/asset/9d5feba5-5917-4c50-bc39-92c7dd32ff9c',
  cheese: 'https://www.figma.com/api/mcp/asset/87edd3b9-338a-420c-884c-e53f8de26c1b',
  radish: 'https://www.figma.com/api/mcp/asset/120886b8-7e68-4ca8-a958-f49caaf3b245',
  x5Logo: 'https://www.figma.com/api/mcp/asset/cedcfbe2-7761-4456-a974-594f55d2ca26',
}

function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error, clearError } = useUserStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    if (validate()) {
      const success = await register(formData.email, formData.password)
      if (success) {
        navigate('/dashboard')
      }
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
      {/* Background decorations */}
      <div className={styles.background}>
        <img 
          src={decorImages.lettuce} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage1}`}
        />
        <img 
          src={decorImages.bagel} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage2}`}
          style={{ 
            width: '220px', 
            height: '220px',
            bottom: '15%',
            left: '5%',
          }}
        />
        <img 
          src={decorImages.cheese} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage3}`}
          style={{
            width: '250px',
            height: '250px',
            top: '40%',
            right: '-30px',
          }}
        />
        <img 
          src={decorImages.radish} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage4}`}
          style={{
            width: '280px',
            height: '280px',
            bottom: '-40px',
            left: '10%',
          }}
        />
        
        {/* Geometric shapes */}
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        
        {/* Star decorations */}
        <div className={`${styles.star} ${styles.star1}`}></div>
        <div className={`${styles.star} ${styles.star2}`}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.container}
      >
        {/* Header with logo */}
        <div className={styles.header}>
          <img src={decorImages.x5Logo} alt="X5" className={styles.logoIcon} />
          <div className={styles.logoSeparator}></div>
          <span className={styles.logoText}>For students</span>
        </div>

        {/* Main card */}
        <motion.div 
          className={styles.card}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.cardInner}>
            <p className={styles.title}>Почта</p>
            
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="example@mail.ru"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                style={{
                  width: '264px',
                  height: '35px',
                  backgroundColor: '#fff6ea',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '0 12px',
                  fontSize: '15px',
                  color: '#05320a',
                }}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              
              <p className={styles.title} style={{ marginTop: '16px' }}>Придумай пароль</p>
              <input
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="Минимум 6 символов"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                style={{
                  width: '264px',
                  height: '35px',
                  backgroundColor: '#fff6ea',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '0 12px',
                  fontSize: '15px',
                  color: '#05320a',
                }}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}

              <div className={styles.buttons}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    width: '264px',
                    height: '28px',
                    backgroundColor: '#c3eb91',
                    color: '#05320a',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    cursor: 'pointer',
                    marginTop: '16px',
                  }}
                >
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </div>
            </form>

            <p className={styles.linkText}>
              Уже есть аккаунт?{' '}
              <Link to="/login" className={styles.link}>
                Войти
              </Link>
            </p>
          </div>
        </motion.div>

        <Link to="/" className={styles.backLink}>
          ← Назад
        </Link>
      </motion.div>
    </div>
  )
}

export default RegisterPage
