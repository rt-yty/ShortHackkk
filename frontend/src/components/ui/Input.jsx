import styles from './Input.module.css'

function Input({
  label,
  type = 'text',
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  const containerClasses = [
    styles.container,
    fullWidth ? styles.fullWidth : '',
    className,
  ].filter(Boolean).join(' ')

  const inputClasses = [
    styles.input,
    error ? styles.error : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={inputClasses}
        {...props}
      />
      {(error || helperText) && (
        <span className={error ? styles.errorText : styles.helperText}>
          {error || helperText}
        </span>
      )}
    </div>
  )
}

export default Input

