// Shram Setu Admin — Badge Component

export function Badge({ children, color, bgColor, size = 'sm', className = '' }) {
  const sizes = {
    sm: { padding: '3px 10px', fontSize: '11.5px' },
    md: { padding: '4px 14px', fontSize: '12.5px' },
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: 'var(--radius-full)',
        fontWeight: '600',
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
