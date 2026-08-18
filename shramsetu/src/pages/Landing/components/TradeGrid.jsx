// Shram Setu — Trade Grid Section (Clean White)
import { useNavigate } from 'react-router-dom';
import { TradeIcon } from '../../../components/ui/TradeIcon';
import { TRADES } from '../../../utils/constants';

export function TradeGrid() {
  const navigate = useNavigate();

  return (
    <section className="section" style={{ background: 'var(--color-background-subtle)' }}>
      <div className="container">
        <div className="section-header">
          <h2>Browse by Trade</h2>
          <p>Find vetted specialists across key skilled professions in Nepal</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '16px',
            maxWidth: '960px',
            margin: '0 auto',
          }}
        >
          {TRADES.map((trade) => (
            <div
              key={trade.slug}
              onClick={() => navigate(`/search/workers?trade=${trade.slug}`)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '24px 16px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                background: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-xs)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary-300)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.querySelector('.trade-icon-box').style.background = 'var(--color-primary-500)';
                e.currentTarget.querySelector('.trade-icon-box svg').style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.querySelector('.trade-icon-box').style.background = 'var(--color-primary-50)';
                e.currentTarget.querySelector('.trade-icon-box svg').style.color = 'var(--color-primary-500)';
              }}
            >
              <div
                className="trade-icon-box"
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-primary-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--transition-base)',
                }}
              >
                <TradeIcon icon={trade.icon} size={24} color="var(--color-primary-500)" />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                    display: 'block',
                    lineHeight: '1.3',
                  }}
                >
                  {trade.nameEn}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-tertiary)',
                    display: 'block',
                    marginTop: '2px',
                  }}
                >
                  {trade.nameNe}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
