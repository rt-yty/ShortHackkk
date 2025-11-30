import styles from './Input.module.css'

function Input({
  label,
  type = 'text',
  error,
  helperText,
  fullWidth = false,
  dark = false,
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
    dark ? styles.inputDark : '',
    error ? styles.error : '',
  ].filter(Boolean).join(' ')

  const labelClasses = [
    styles.label,
    dark ? styles.labelDark : '',
  ].filter(Boolean).join(' ')

  const helperClasses = [
    error ? styles.errorText : styles.helperText,
    dark && !error ? styles.helperTextDark : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
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
        <span className={helperClasses}>
          {error || helperText}
        </span>
      )}
    </div>
  )
}

export default Input

