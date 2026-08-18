// Shram Setu — Card Component (glassmorphism)

export function Card({ children, hover = true, className = '', style = {}, onClick }) {
  return (
    <div
      className={`glass-card ${hover ? '' : ''} ${className}`}
      onClick={onClick}
      style={{
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
