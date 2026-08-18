// Shram Setu — Verification Badge Component
import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion, ShieldEllipsis, Shield } from 'lucide-react';
import { VERIFICATION_STATUS } from '../../utils/constants';

const ICONS = {
  'shield-check': ShieldCheck,
  'shield-alert': ShieldAlert,
  'shield-x': ShieldX,
  'shield-ban': ShieldX,
  'shield-question': ShieldQuestion,
  'shield-ellipsis': ShieldEllipsis,
};

export function VerificationBadge({ status = 'unverified', size = 'sm' }) {
  const config = VERIFICATION_STATUS[status] || VERIFICATION_STATUS.unverified;
  const IconComponent = ICONS[config.icon] || Shield;

  const sizes = {
    sm: { iconSize: 14, fontSize: '12px', padding: '3px 10px', gap: '4px' },
    md: { iconSize: 16, fontSize: '13px', padding: '4px 14px', gap: '6px' },
    lg: { iconSize: 20, fontSize: '14px', padding: '6px 16px', gap: '6px' },
  };

  const s = sizes[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        padding: s.padding,
        borderRadius: 'var(--radius-full)',
        fontSize: s.fontSize,
        fontWeight: '600',
        color: config.color,
        backgroundColor: config.bgColor,
        lineHeight: '1',
      }}
    >
      <IconComponent size={s.iconSize} strokeWidth={2} />
      {config.label}
    </span>
  );
}
