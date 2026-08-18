// Shram Setu — Job Card Component
import { MapPin, Clock, Calendar } from 'lucide-react';
import { Badge } from './Badge';
import { TradeIcon } from './TradeIcon';
import { JOB_STATUS } from '../../utils/constants';
import { formatBudget, formatRelativeTime } from '../../utils/formatters';

export function JobCard({ job, onClick }) {
  const status = JOB_STATUS[job?.status] || JOB_STATUS.open;
  const tradeIcon = job?.trades?.icon || 'wrench';
  const tradeNameEn = job?.trades?.name_en || job?.trade_id || '';

  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Header: Trade icon + title + status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <TradeIcon icon={tradeIcon} size={22} color="var(--color-primary-500)" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: '1.3',
          }}>
            {job?.title || 'Untitled Job'}
          </h4>
          {tradeNameEn && (
            <p style={{
              fontSize: '13px',
              color: 'var(--color-primary-500)',
              fontWeight: '500',
              margin: '2px 0 0 0',
            }}>
              {tradeNameEn}
            </p>
          )}
        </div>

        <Badge color={status.color} bgColor={status.bgColor}>
          {status.label}
        </Badge>
      </div>

      {/* Description */}
      {job?.description && (
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          margin: '12px 0 0 0',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {job.description}
        </p>
      )}

      {/* Meta row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginTop: '14px',
        paddingTop: '14px',
        borderTop: '1px solid var(--color-border-light)',
      }}>
        {job?.district && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
          }}>
            <MapPin size={13} />
            {job.district}
          </span>
        )}
        {job?.duration_days && (
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--color-text-tertiary)',
          }}>
            <Clock size={13} />
            {job.duration_days} day{job.duration_days !== 1 ? 's' : ''}
          </span>
        )}
        {(job?.budget_min || job?.budget_max) && (
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--color-primary-600)',
            marginLeft: 'auto',
          }}>
            {formatBudget(job.budget_min, job.budget_max)}
          </span>
        )}
      </div>

      {/* Posted time */}
      {job?.created_at && (
        <div style={{
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <Calendar size={11} color="var(--color-text-tertiary)" />
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
            {formatRelativeTime(job.created_at)}
          </span>
        </div>
      )}
    </div>
  );
}
