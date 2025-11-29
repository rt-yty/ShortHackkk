import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../../stores/userStore'
import styles from './Header.module.css'

// X5 logo from Figma
const x5Logo = 'https://www.figma.com/api/mcp/asset/5fdb9a52-c1d9-4b78-8be6-233cb3364e25'
const raccoonIcon = 'https://www.figma.com/api/mcp/asset/f7a133a4-fa94-4d0a-8969-4205924e62de'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, points, logout } = useUserStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/dashboard" className={styles.logo}>
          <img src={x5Logo} alt="X5" className={styles.logoIcon} />
          <div className={styles.logoSeparator}></div>
          <span className={styles.logoText}>For Students</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.navLink}>
            Главная
          </Link>
          <Link to="/rewards" className={styles.navLink}>
            Призы
          </Link>
        </nav>

        {/* Desktop User Section */}
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

        {/* Mobile Points & Burger */}
        <div className={styles.mobileActions}>
          <div className={styles.mobilePoints}>
            <img src={raccoonIcon} alt="" className={styles.pointsIcon} />
            <span className={styles.pointsValue}>{points}</span>
          </div>
          
          <button 
            className={`${styles.burgerBtn} ${isMenuOpen ? styles.burgerOpen : ''}`}
            onClick={toggleMenu}
            aria-label="Меню"
            aria-expanded={isMenuOpen}
          >
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
            <span className={styles.burgerLine}></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`${styles.mobileOverlay} ${isMenuOpen ? styles.overlayOpen : ''}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <div className={styles.mobileMenuHeader}>
            <span className={styles.mobileUserEmail}>{user?.email}</span>
          </div>
          
          <nav className={styles.mobileNav}>
            <Link to="/dashboard" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              🏠 Главная
            </Link>
            <Link to="/rewards" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
              🎁 Призы
            </Link>
          </nav>
          
          <div className={styles.mobileMenuFooter}>
            <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
