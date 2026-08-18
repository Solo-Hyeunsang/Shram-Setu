// Shram Setu Admin — Reusable Curved Modal Dialog
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, description, children, maxWidth = '520px' }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          padding: '32px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
              {title}
            </h3>
            {description && (
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: '1px solid var(--color-border)',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
