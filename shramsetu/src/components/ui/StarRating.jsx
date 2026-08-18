// Shram Setu — Star Rating Component
import { Star } from 'lucide-react';

export function StarRating({ rating = 0, maxStars = 5, size = 16, showValue = false, count = 0 }) {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2;

  for (let i = 1; i <= maxStars; i++) {
    const filled = i <= Math.floor(roundedRating);
    const halfFilled = !filled && i === Math.ceil(roundedRating) && roundedRating % 1 !== 0;

    stars.push(
      <Star
        key={i}
        size={size}
        fill={filled || halfFilled ? 'var(--color-accent)' : 'none'}
        color={filled || halfFilled ? 'var(--color-accent)' : 'var(--color-border)'}
        strokeWidth={1.5}
      />
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {stars}
      {showValue && rating > 0 && (
        <span
          style={{
            marginLeft: '6px',
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--color-text-primary)',
          }}
        >
          {Number(rating).toFixed(1)}
        </span>
      )}
      {showValue && count > 0 && (
        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
            marginLeft: '2px',
          }}
        >
          ({count})
        </span>
      )}
    </div>
  );
}
