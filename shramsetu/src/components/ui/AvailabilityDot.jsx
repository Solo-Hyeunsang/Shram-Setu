// Shram Setu — Availability Dot
import { AVAILABILITY } from '../../utils/constants';

export function AvailabilityDot({ status = 'available', showLabel = false, size = 8 }) {
  const config = AVAILABILITY[status] || AVAILABILITY.available;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: config.dotColor,
          boxShadow: status === 'available' ? `0 0 6px ${config.dotColor}80` : 'none',
          flexShrink: 0,
        }}
      />
      {showLabel && (
        <span style={{ fontSize: '12px', color: config.color, fontWeight: '500' }}>
          {config.label}
        </span>
      )}
    </span>
  );
}
