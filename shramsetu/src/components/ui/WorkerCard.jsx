// Shram Setu — Worker Card Component (Perfect Grid Alignment & Logo-Inspired Theme)
import { MapPin, Briefcase, Award, ArrowUpRight, Zap, Droplets, BrickWall, Hammer, Paintbrush, Flame, Wrench } from 'lucide-react';
import { StarRating } from './StarRating';
import { VerificationBadge } from './VerificationBadge';
import { formatWage, getInitials } from '../../utils/formatters';

const TRADE_ICONS = {
  electrician: Zap,
  plumber: Droplets,
  mason: BrickWall,
  carpenter: Hammer,
  painter: Paintbrush,
  welder: Flame,
  default: Wrench,
};

const DEFAULT_SKILLS = {
  electrician: ['House Wiring', '3-Phase Power', 'Inverter'],
  plumber: ['Pipe Fitting', 'Sanitary Fixtures', 'Drainage'],
  mason: ['Brick Masonry', 'Concrete Work', 'Plastering'],
  carpenter: ['Wood Framing', 'Modular Cabinets', 'Furniture'],
  painter: ['Interior Wall', 'Texture Painting', 'Putty'],
  welder: ['ARC / MIG Welding', 'Truss Fabrication', 'Metal Railing'],
};

export function WorkerCard({ worker, onClick }) {
  const profile = worker?.profiles || worker;
  const wp = worker?.worker_profiles || worker;

  const name = profile?.full_name || 'Worker';
  const trade = wp?.primary_trade || 'technician';
  const district = profile?.district || 'Nepal';
  const avatarUrl = profile?.avatar_url;
  const rating = wp?.average_rating || 4.5;
  const reviewCount = wp?.total_reviews || 0;
  const verification = wp?.verification_status || 'unverified';
  const availability = wp?.availability || 'available';
  const wageMin = wp?.daily_wage_min;
  const wageMax = wp?.daily_wage_max;
  const experienceYears = wp?.years_experience || 3;
  const completedJobs = wp?.completed_jobs || (reviewCount ? reviewCount * 2 : 12);
  const skills = wp?.skills || DEFAULT_SKILLS[trade] || ['General Skilled Labor'];

  const TradeIconComponent = TRADE_ICONS[trade] || TRADE_ICONS.default;

  return (
    <div
      onClick={onClick}
      style={{
        background: '#FFFFFF',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        boxShadow: 'var(--shadow-xs)',
        transition: 'all var(--transition-base)',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.borderColor = 'var(--color-primary-300)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      {/* Top Row: Avatar + Verification Status */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
          {/* Avatar Container with Trade Icon Overlay */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 8px rgba(13, 43, 82, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'var(--color-primary-700)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {getInitials(name)}
                </span>
              )}
            </div>

            {/* Trade Icon Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-3px',
                right: '-3px',
                width: '24px',
                height: '24px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary-700)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }}
            >
              <TradeIconComponent size={12} strokeWidth={2.5} />
            </div>
          </div>

          {/* Verification Badge & Availability Dot */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <VerificationBadge status={verification} size="sm" />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', fontWeight: '500' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: availability === 'available' ? 'var(--color-success)' : 'var(--color-warning)',
                  boxShadow: availability === 'available' ? '0 0 0 2px rgba(22, 163, 74, 0.2)' : 'none',
                }}
              />
              <span style={{ color: availability === 'available' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                {availability === 'available' ? 'Available Now' : 'Busy'}
              </span>
            </div>
          </div>
        </div>

        {/* Worker Name & Trade Info */}
        <div style={{ marginBottom: '14px' }}>
          <h3
            style={{
              fontSize: '17px',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              margin: '0 0 4px 0',
              lineHeight: '1.25',
              fontFamily: 'var(--font-display)',
            }}
          >
            {name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '13.5px',
                fontWeight: '600',
                color: 'var(--color-primary-700)',
                textTransform: 'capitalize',
              }}
            >
              {trade.replace(/_/g, ' ')}
            </span>
            <span style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>•</span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--color-text-secondary)',
                background: 'var(--color-primary-50)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {experienceYears} yrs exp
            </span>
          </div>

          <div
            style={{
              fontSize: '12.5px',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <MapPin size={13} color="var(--color-text-tertiary)" />
            {district}
          </div>
        </div>

        {/* Rating & Stats Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            background: 'var(--color-background-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-light)',
            marginBottom: '14px',
          }}
        >
          <StarRating rating={rating} size={14} showValue count={reviewCount} />
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', fontWeight: '500' }}>
            {completedJobs} jobs done
          </span>
        </div>

        {/* Skills Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              style={{
                fontSize: '11.5px',
                color: 'var(--color-text-secondary)',
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                padding: '3px 9px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '500',
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer (Always Locked to the Baseline) */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '14px',
          borderTop: '1px solid var(--color-border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.04em', display: 'block' }}>
            Daily Rate
          </span>
          <span style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>
            {wageMin || wageMax ? formatWage(wageMin, wageMax) : 'NPR 800 - 1,200/day'}
          </span>
        </div>

        <button
          type="button"
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            color: 'var(--color-primary-700)',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all var(--transition-fast)',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-primary-700)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = 'var(--color-primary-700)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-primary-50)';
            e.currentTarget.style.color = 'var(--color-primary-700)';
            e.currentTarget.style.borderColor = 'var(--color-primary-200)';
          }}
        >
          View Profile
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
