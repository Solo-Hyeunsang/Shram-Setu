// Shram Setu — Badge Component (status pills)

export function Badge({ children, color, bgColor, size = 'sm', className = '' }) {
  const sizes = {
    sm: { padding: '2px 10px', fontSize: '12px' },
    md: { padding: '4px 14px', fontSize: '13px' },
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: 'var(--radius-full)',
        fontWeight: '500',
        fontFamily: 'var(--font-body)',
        color: color || 'var(--color-text-secondary)',
        backgroundColor: bgColor || '#F1F5F9',
        lineHeight: '1.4',
        whiteSpace: 'nowrap',
        ...sizes[size],
      }}
    >
      {children}
    </span>
  );
}
