// Shram Setu — Button Component (Curved / Pill Aesthetic)
// Variants: primary, secondary, outline, danger, ghost

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
    sm: { padding: '8px 18px', fontSize: '13px', minHeight: '38px' },
    md: { padding: '11px 24px', fontSize: '14.5px', minHeight: '46px' },
    lg: { padding: '14px 32px', fontSize: '16px', minHeight: '52px' },
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
      color: '#FFFFFF',
      boxShadow: '0 3px 12px rgba(13, 43, 82, 0.28)',
    },
    secondary: {
      background: 'linear-gradient(135deg, var(--color-secondary-600), var(--color-secondary-700))',
      color: '#FFFFFF',
      boxShadow: '0 3px 12px rgba(200, 30, 39, 0.28)',
    },
    outline: {
      background: '#FFFFFF',
      color: 'var(--color-primary-700)',
      border: '1.5px solid var(--color-primary-200)',
      boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
    },
    danger: {
      background: 'var(--color-danger)',
      color: '#FFFFFF',
      boxShadow: '0 3px 12px rgba(200, 30, 39, 0.25)',
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
          e.currentTarget.style.transform = 'translateY(-1.5px)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(50, 140, 189, 0.4)';
          } else if (variant === 'outline') {
            e.currentTarget.style.borderColor = 'var(--color-primary-500)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(50, 140, 189, 0.15)';
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variants[variant]?.boxShadow || style.boxShadow || 'none';
        if (variant === 'outline') {
          e.currentTarget.style.borderColor = style.borderColor || 'var(--color-primary-300)';
        }
      }}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: '16px',
            height: '16px',
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
