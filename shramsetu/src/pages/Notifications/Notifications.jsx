// Shram Setu — Notifications Page
import { useState } from 'react';
import { Bell, Check, ShieldCheck, Briefcase, Star, Clock } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Button } from '../../components/ui/Button';
import { formatRelativeTime } from '../../utils/formatters';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'verification_approved',
    title: 'CTEVT Verification Approved',
    message: 'Congratulations! Your electrician credentials have been verified. The government verified badge is now active on your profile.',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    icon: ShieldCheck,
    color: 'var(--color-secondary)',
  },
  {
    id: 'n2',
    type: 'new_application',
    title: 'New Application Received',
    message: 'Ram Kumar Tamang applied for your job "Residential Wiring Installation".',
    is_read: false,
    created_at: new Date(Date.now() - 14400000).toISOString(),
    icon: Briefcase,
    color: 'var(--color-primary-500)',
  },
  {
    id: 'n3',
    type: 'new_review',
    title: 'New 5-Star Review Received',
    message: 'An employer left a review: "Excellent wiring work and very punctual. Highly recommended!"',
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    icon: Star,
    color: 'var(--color-accent)',
  },
];

export function Notifications() {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  const markRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '96px', paddingBottom: '64px' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
                Notifications
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>

            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead}>
                <Check size={14} />
                Mark all as read
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((n) => {
              const Icon = n.icon || Bell;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-xl)',
                    background: n.is_read ? '#FFFFFF' : 'var(--color-primary-50)',
                    border: n.is_read ? '1px solid var(--color-border-light)' : '1.5px solid var(--color-primary-200)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-full)',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <Icon size={20} color={n.color || 'var(--color-primary-500)'} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                        {n.title}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                        {formatRelativeTime(n.created_at)}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.5' }}>
                      {n.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
