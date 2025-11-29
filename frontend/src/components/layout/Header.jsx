import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '../../stores/userStore'
import styles from './Header.module.css'

// X5 logo from Figma
const x5Logo = 'https://www.figma.com/api/mcp/asset/5fdb9a52-c1d9-4b78-8be6-233cb3364e25'
const raccoonIcon = 'https://www.figma.com/api/mcp/asset/f7a133a4-fa94-4d0a-8969-4205924e62de'

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
          <img src={x5Logo} alt="X5" className={styles.logoIcon} />
          <div className={styles.logoSeparator}></div>
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
            <img src={raccoonIcon} alt="" className={styles.pointsIcon} />
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
