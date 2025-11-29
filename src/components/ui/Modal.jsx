import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Modal.module.css'

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium',
  showCloseButton = true,
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.backdrop}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`${styles.modal} ${styles[size]}`}
            onClick={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <div className={styles.header}>
                {title && <h2 className={styles.title}>{title}</h2>}
                {showCloseButton && (
                  <button 
                    className={styles.closeButton} 
                    onClick={onClose}
                    aria-label="Закрыть"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
            <div className={styles.content}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal

