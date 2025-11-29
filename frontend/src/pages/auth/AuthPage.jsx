import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import styles from './AuthPage.module.css'

function AuthPage() {
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
          <p className={styles.tagline}>
            Пройди задания. Получи призы. Начни карьеру в X5 Tech.
          </p>
        </div>

        <Card variant="elevated" padding="large" className={styles.card}>
          <h2 className={styles.title}>Добро пожаловать!</h2>
          <p className={styles.subtitle}>
            Выберите способ входа в систему
          </p>

          <div className={styles.buttons}>
            <Link to="/register">
              <Button variant="primary" size="large" fullWidth>
                Регистрация
              </Button>
            </Link>

            <Link to="/login">
              <Button variant="secondary" size="large" fullWidth>
                Вход
              </Button>
            </Link>

            <div className={styles.divider}>
              <span>или</span>
            </div>

            <Link to="/admin-login">
              <Button variant="ghost" size="medium" fullWidth>
                Войти как администратор
              </Button>
            </Link>
          </div>
        </Card>

        <p className={styles.footer}>
          © 2024 X5 Tech. Все права защищены.
        </p>
      </motion.div>
    </div>
  )
}

export default AuthPage

