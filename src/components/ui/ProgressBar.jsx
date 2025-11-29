import styles from './ProgressBar.module.css'

function ProgressBar({ 
  value, 
  max = 100, 
  label,
  showValue = true,
  size = 'medium',
  variant = 'primary',
}) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.labelContainer}>
          <span className={styles.label}>{label}</span>
          {showValue && (
            <span className={styles.value}>{value} / {max}</span>
          )}
        </div>
      )}
      <div className={`${styles.track} ${styles[size]}`}>
        <div 
          className={`${styles.fill} ${styles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

