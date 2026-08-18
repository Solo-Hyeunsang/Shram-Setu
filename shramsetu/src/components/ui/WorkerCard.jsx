// Shram Setu — Worker Card Component
import { MapPin, Briefcase } from 'lucide-react';
import { StarRating } from './StarRating';
import { VerificationBadge } from './VerificationBadge';
import { AvailabilityDot } from './AvailabilityDot';
import { formatWage } from '../../utils/formatters';
import { getInitials } from '../../utils/formatters';

export function WorkerCard({ worker, onClick }) {
  const profile = worker?.profiles || worker;
  const wp = worker?.worker_profiles || worker;

  const name = profile?.full_name || 'Worker';
  const trade = wp?.primary_trade || '';
  const district = profile?.district || '';
  const avatarUrl = profile?.avatar_url;
  const rating = wp?.average_rating || 0;
  const reviewCount = wp?.total_reviews || 0;
  const verification = wp?.verification_status || 'unverified';
  const availability = wp?.availability || 'available';
  const wageMin = wp?.daily_wage_min;
  const wageMax = wp?.daily_wage_max;

  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        padding: '20px',
        cursor: onClick ? 'pointer' : 'default',
        minWidth: '280px',
        maxWidth: '340px',
      }}
    >
      {/* Header: Avatar + Info */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          flexShrink: 0,
          background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--color-primary-600)',
              fontFamily: 'var(--font-display)',
            }}>
              {getInitials(name)}
            </span>
          )}
        </div>

        {/* Name and Trade */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h4 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: '1.3',
            }}>
              {name}
            </h4>
            <AvailabilityDot status={availability} />
          </div>
          {trade && (
            <p style={{
              fontSize: '13px',
              color: 'var(--color-primary-500)',
              fontWeight: '500',
              margin: '2px 0 0 0',
              textTransform: 'capitalize',
            }}>
              {trade.replace(/_/g, ' ')}
            </p>
          )}
          {district && (
            <p style={{
              fontSize: '12px',
              color: 'var(--color-text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              margin: '4px 0 0 0',
            }}>
              <MapPin size={12} />
              {district}
            </p>
          )}
        </div>
      </div>

      {/* Rating + Verification */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '14px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <StarRating rating={rating} size={14} showValue count={reviewCount} />
        <VerificationBadge status={verification} size="sm" />
      </div>

      {/* Wage */}
      {(wageMin || wageMax) && (
        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--color-border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Briefcase size={13} color="var(--color-text-tertiary)" />
          <span style={{
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--color-text-secondary)',
          }}>
            {formatWage(wageMin, wageMax)}
          </span>
        </div>
      )}
    </div>
  );
}
