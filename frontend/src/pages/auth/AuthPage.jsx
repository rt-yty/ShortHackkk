import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'
import styles from './AuthPage.module.css'

// Decorative images from Figma design
const decorImages = {
  greenOnion: 'https://www.figma.com/api/mcp/asset/3f99848e-4336-463d-b440-28ee892aae3c',
  broccoli: 'https://www.figma.com/api/mcp/asset/24403f4f-4825-4c43-b7f0-3861f9f00cc4',
  tomatoes: 'https://www.figma.com/api/mcp/asset/8950087e-a599-4ad7-bfd4-0c612df6e412',
  onions: 'https://www.figma.com/api/mcp/asset/75ce4dcf-5a1a-4996-8f3d-64a5c3f5bc63',
  x5Logo: 'https://www.figma.com/api/mcp/asset/4d9ee984-55d9-41a3-b5f8-b985b7994efb',
}

function AuthPage() {
  const navigate = useNavigate()
  const { login, loading, error, clearError } = useUserStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    if (validate()) {
      const success = await login(formData.email, formData.password)
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
    clearError()
  }

  return (
    <div className={styles.page}>
      {/* Background decorations */}
      <div className={styles.background}>
        <img 
          src={decorImages.greenOnion} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage1}`}
        />
        <img 
          src={decorImages.broccoli} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage2}`}
        />
        <img 
          src={decorImages.tomatoes} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage3}`}
        />
        <img 
          src={decorImages.onions} 
          alt="" 
          className={`${styles.decorImage} ${styles.decorImage4}`}
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
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <p className={styles.title}>Почта</p>
              
              <input
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="example@mail.ru"
                className={errors.email ? styles.inputError : ''}
                style={{
                  width: '264px',
                  height: '35px',
                  backgroundColor: '#fff6ea',
                  border: errors.email ? '2px solid #ff6b6b' : 'none',
                  borderRadius: '5px',
                  padding: '0 12px',
                  fontSize: '15px',
                  color: '#05320a',
                  outline: 'none',
                }}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              
              <p className={styles.title} style={{ marginTop: '16px' }}>Пароль</p>
              <input
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                placeholder="Введите пароль"
                className={errors.password ? styles.inputError : ''}
                style={{
                  width: '264px',
                  height: '35px',
                  backgroundColor: '#fff6ea',
                  border: errors.password ? '2px solid #ff6b6b' : 'none',
                  borderRadius: '5px',
                  padding: '0 12px',
                  fontSize: '15px',
                  outline: 'none',
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
                    color: 'rgba(5, 50, 10, 0.41)',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '16px',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Вход...' : 'Войти'}
                </button>

                <Link to="/register">
                  <button 
                    type="button"
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
                    }}
                  >
                    Зарегистрироваться
                  </button>
                </Link>
              </div>
            </form>

            {/* Crossword decoration */}
            <div className={styles.crossword}>
              <div className={styles.crosswordCell}></div>
              <div className={styles.crosswordCell}>А</div>
              <div className={styles.crosswordCell}></div>
              <div className={styles.crosswordCell}></div>
              <div className={`${styles.crosswordCell} ${styles.accent}`}>3</div>
              <div className={styles.crosswordCell}></div>
              <div className={styles.crosswordCell}>б</div>
              <div className={styles.crosswordCell}></div>
              <div className={styles.crosswordCell}></div>
            </div>
          </div>
        </motion.div>

        <Link to="/admin-login" className={styles.backLink}>
          Войти как администратор
        </Link>

        <p className={styles.footer}>
          © 2024 X5 Tech. Все права защищены.
        </p>
      </motion.div>
    </div>
  )
}

export default AuthPage
