// Shram Setu Admin — Stat Card Component

export function StatCard({ title, value, change, isPositive, icon: Icon, color = 'var(--color-primary-500)' }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '22px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all var(--transition-base)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--color-primary-200)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={20} color={color} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: '800',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>
        {change && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: isPositive ? 'var(--color-secondary)' : 'var(--color-danger)',
            }}
          >
            {isPositive ? '+' : ''}{change}
          </span>
        )}
      </div>
    </div>
  );
}
