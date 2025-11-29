import styles from './Card.module.css'

function Card({ 
  children, 
  variant = 'default',
  padding = 'medium',
  className = '',
  onClick,
  ...props 
}) {
  const classes = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    onClick ? styles.clickable : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={classes} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

