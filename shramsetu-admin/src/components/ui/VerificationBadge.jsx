// Shram Setu Admin — Verification Badge
import { ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion, Shield } from 'lucide-react';
import { VERIFICATION_STATUS } from '../../utils/constants';

const ICONS = {
  'shield-check': ShieldCheck,
  'shield-alert': ShieldAlert,
  'shield-x': ShieldX,
  'shield-ban': ShieldX,
  'shield-question': ShieldQuestion,
};

export function VerificationBadge({ status = 'unverified' }) {
  const config = VERIFICATION_STATUS[status] || VERIFICATION_STATUS.unverified;
  const IconComponent = config.icon ? (ICONS[config.icon] || Shield) : Shield;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '11.5px',
        fontWeight: '600',
        color: config.color,
        backgroundColor: config.bgColor,
        lineHeight: '1.4',
        whiteSpace: 'nowrap',
      }}
    >
      <IconComponent size={13} strokeWidth={2} />
      {config.label}
    </span>
  );
}
