// Shram Setu Admin — Button Component (Curved / Pill Aesthetic)

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: '600',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--transition-base)',
    width: fullWidth ? '100%' : 'auto',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    lineHeight: '1',
  };

  const sizes = {
    sm: { padding: '7px 16px', fontSize: '12.5px', minHeight: '34px' },
    md: { padding: '9px 20px', fontSize: '13.5px', minHeight: '40px' },
    lg: { padding: '12px 28px', fontSize: '15px', minHeight: '48px' },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
      color: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(13, 43, 82, 0.25)',
    },
    secondary: {
      background: 'linear-gradient(135deg, var(--color-secondary-600), var(--color-secondary-700))',
      color: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(200, 30, 39, 0.25)',
    },
    outline: {
      background: '#FFFFFF',
      color: 'var(--color-primary-700)',
      border: '1.5px solid var(--color-border)',
      boxShadow: 'var(--shadow-xs)',
    },
    danger: {
      background: 'var(--color-danger)',
      color: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(200, 30, 39, 0.25)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
      boxShadow: 'none',
    },
  };

  const computedStyle = {
    ...baseStyles,
    ...sizes[size],
    ...variants[variant],
    ...style,
  };

  return (
    <button
      type={type}
      style={computedStyle}
      disabled={disabled || loading}
      onClick={onClick}
      className={className}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'outline') {
            e.currentTarget.style.borderColor = 'var(--color-primary-300)';
            e.currentTarget.style.color = 'var(--color-primary-600)';
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = style.borderColor || 'var(--color-border)';
          e.currentTarget.style.color = style.color || 'var(--color-text-primary)';
        }
      }}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {children}
    </button>
  );
}
