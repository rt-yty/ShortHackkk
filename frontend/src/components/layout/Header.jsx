import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '../../stores/userStore'
import styles from './Header.module.css'

function Header() {
  const navigate = useNavigate()
  const { user, points, logout } = useUserStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoX5}>X5</span>
          <span className={styles.logoText}>For Students</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.navLink}>
            Главная
          </Link>
          <Link to="/rewards" className={styles.navLink}>
            Призы
          </Link>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.points}>
            <span className={styles.pointsIcon}>⭐</span>
            <span className={styles.pointsValue}>{points}</span>
          </div>
          
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{user?.email}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

