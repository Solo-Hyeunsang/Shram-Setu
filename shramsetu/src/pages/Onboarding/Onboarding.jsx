// Shram Setu — Onboarding & Role Selection Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Building2, ArrowRight, CheckCircle2, MapPin, Briefcase } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TRADES, DISTRICTS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../api/supabaseClient';

export function Onboarding() {
  const { user, refreshProfile, saveProfile } = useAuth();
  const [role, setRole] = useState('worker'); // 'worker' | 'employer'
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('Kathmandu');
  const [primaryTrade, setPrimaryTrade] = useState('electrician');
  const [employerType, setEmployerType] = useState('individual');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    setError(null);

    const userId = user?.id || `user_${Date.now()}`;
    const profileData = {
      id: userId,
      role,
      full_name: fullName.trim(),
      district,
      phone: user?.phone || null,
      email: user?.email || null,
      is_suspended: false,
    };

    try {
      // 1. Insert/Upsert into profiles
      try {
        await supabase.from('profiles').upsert(profileData);

        if (role === 'worker') {
          await supabase.from('worker_profiles').upsert({
            id: userId,
            primary_trade: primaryTrade,
            availability: 'available',
            verification_status: 'unverified',
          });
        } else {
          await supabase.from('employer_profiles').upsert({
            id: userId,
            employer_type: employerType,
            company_name: companyName || null,
          });
        }
      } catch (dbErr) {
        console.warn('Database save warning (using local sync):', dbErr);
      }

      if (saveProfile) {
        await saveProfile(profileData);
      }
      if (refreshProfile) {
        await refreshProfile();
      }

      navigate(role === 'worker' ? '/worker/dashboard' : '/employer/dashboard', { replace: true });
    } catch (err) {
      console.error('Onboarding Error:', err);
      if (saveProfile) {
        await saveProfile(profileData);
      }
      navigate(role === 'worker' ? '/worker/dashboard' : '/employer/dashboard', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 24px',
        background: 'var(--color-background)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-2xl)',
          padding: '40px 36px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/logo.png"
            alt="Shram Setu Logo"
            style={{
              width: '46px',
              height: '46px',
              objectFit: 'contain',
              margin: '0 auto 16px',
              display: 'block',
            }}
          />
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '8px',
            }}
          >
            Complete Your Profile
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Choose how you want to use Shram Setu to get started
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FEE2E2',
              color: 'var(--color-danger)',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role selector cards */}
          <div style={{ marginBottom: '28px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: '12px',
              }}
            >
              I am joining as a:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Worker card */}
              <div
                onClick={() => setRole('worker')}
                style={{
                  padding: '20px 16px',
                  borderRadius: 'var(--radius-xl)',
                  border: role === 'worker' ? '2px solid var(--color-primary-500)' : '1.5px solid var(--color-border)',
                  background: role === 'worker' ? 'var(--color-primary-50)' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-base)',
                  boxShadow: role === 'worker' ? '0 4px 12px rgba(50, 140, 189, 0.15)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-lg)',
                    background: role === 'worker' ? 'var(--color-primary-500)' : 'var(--color-background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: role === 'worker' ? '#FFFFFF' : 'var(--color-primary-500)',
                  }}
                >
                  <Wrench size={24} />
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                  Skilled Worker
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Offer services, verify skills & find jobs
                </p>
              </div>

              {/* Employer card */}
              <div
                onClick={() => setRole('employer')}
                style={{
                  padding: '20px 16px',
                  borderRadius: 'var(--radius-xl)',
                  border: role === 'employer' ? '2px solid var(--color-primary-500)' : '1.5px solid var(--color-border)',
                  background: role === 'employer' ? 'var(--color-primary-50)' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all var(--transition-base)',
                  boxShadow: role === 'employer' ? '0 4px 12px rgba(50, 140, 189, 0.15)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-lg)',
                    background: role === 'employer' ? 'var(--color-primary-500)' : 'var(--color-background)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: role === 'employer' ? '#FFFFFF' : 'var(--color-primary-500)',
                  }}
                >
                  <Building2 size={24} />
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                  Employer
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Hire verified workers & post job openings
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="full-name"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
              }}
            >
              Full Name *
            </label>
            <input
              id="full-name"
              type="text"
              placeholder="e.g. Ram Kumar Shrestha"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '15px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--color-border)',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* District */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="district-select"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
              }}
            >
              Location / District
            </label>
            <select
              id="district-select"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '15px',
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--color-border)',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-primary)',
                background: '#FFFFFF',
              }}
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Role specific fields */}
          {role === 'worker' ? (
            <div style={{ marginBottom: '28px' }}>
              <label
                htmlFor="trade-select"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px',
                }}
              >
                Primary Trade / Specialization
              </label>
              <select
                id="trade-select"
                value={primaryTrade}
                onChange={(e) => setPrimaryTrade(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  fontSize: '15px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--color-border)',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-primary)',
                  background: '#FFFFFF',
                }}
              >
                {TRADES.map((t) => (
                  <option key={t.slug} value={t.slug}>{t.nameEn} ({t.nameNe})</option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  htmlFor="employer-type-select"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  Employer Type
                </label>
                <select
                  id="employer-type-select"
                  value={employerType}
                  onChange={(e) => setEmployerType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '15px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-primary)',
                    background: '#FFFFFF',
                  }}
                >
                  <option value="individual">Individual Homeowner</option>
                  <option value="business">Contractor / Business</option>
                  <option value="government">Government Agency</option>
                  <option value="ngo">NGO / Development</option>
                </select>
              </div>

              {employerType !== 'individual' && (
                <div>
                  <label
                    htmlFor="company-name"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--color-text-primary)',
                      marginBottom: '8px',
                    }}
                  >
                    Company / Organization Name
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    placeholder="e.g. Himalayan Builders Pvt. Ltd."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '15px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1.5px solid var(--color-border)',
                      outline: 'none',
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Create Profile & Get Started
            <ArrowRight size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
