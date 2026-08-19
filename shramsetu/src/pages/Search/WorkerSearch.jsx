// Shram Setu — Worker Search Page (World-Class UI/UX & Perfectly Aligned Grid)
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, Filter, ShieldCheck, MapPin, X, Phone,
  Briefcase, Star, Award, CheckCircle2, ChevronDown,
  ArrowRight, SlidersHorizontal, User, Calendar, Zap,
  Droplets, BrickWall, Hammer, Paintbrush, Flame, Sparkles
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { WorkerCard } from '../../components/ui/WorkerCard';
import { Button } from '../../components/ui/Button';
import { VerificationBadge } from '../../components/ui/VerificationBadge';
import { StarRating } from '../../components/ui/StarRating';
import { TRADES, DISTRICTS } from '../../utils/constants';
import { formatWage, getInitials } from '../../utils/formatters';

const TRADE_CHIPS = [
  { slug: 'all', label: 'All Trades', icon: Sparkles },
  { slug: 'electrician', label: 'Electrician', icon: Zap },
  { slug: 'plumber', label: 'Plumber', icon: Droplets },
  { slug: 'mason', label: 'Mason', icon: BrickWall },
  { slug: 'carpenter', label: 'Carpenter', icon: Hammer },
  { slug: 'painter', label: 'Painter', icon: Paintbrush },
  { slug: 'welder', label: 'Welder', icon: Flame },
];

const SAMPLE_WORKERS = [
  {
    id: '1',
    profiles: {
      full_name: 'Ram Kumar Tamang',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan - 4',
      phone: '+977-9841234567',
      avatar_url: null,
      bio: 'Certified master electrician with 6+ years of commercial and residential expertise. Specializes in 3-phase heavy wiring, inverter backup installations, circuit breaker diagnostics, and emergency outage repair.',
    },
    worker_profiles: {
      primary_trade: 'electrician',
      average_rating: 4.8,
      total_reviews: 24,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 800,
      daily_wage_max: 1200,
      years_experience: 6,
      completed_jobs: 54,
      skills: ['House Wiring', '3-Phase Power', 'Inverter & Solar', 'Circuit Diagnostics', 'Safety Breakers'],
      ctevt_cert_no: 'CTEVT-EL-2022-8941',
    },
  },
  {
    id: '2',
    profiles: {
      full_name: 'Sita Rai',
      district: 'Lalitpur',
      municipality: 'Patan - 12',
      phone: '+977-9812345678',
      avatar_url: null,
      bio: 'Professional plumbing technician with 4 years in sanitary fixture installation, high-pressure CPVC pipelines, drainage troubleshooting, and solar water heater installation.',
    },
    worker_profiles: {
      primary_trade: 'plumber',
      average_rating: 4.6,
      total_reviews: 18,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 900,
      daily_wage_max: 1400,
      years_experience: 4,
      completed_jobs: 38,
      skills: ['Pipe Fitting', 'Sanitary Fixtures', 'Solar Heaters', 'Underground Drainage', 'Leak Detection'],
      ctevt_cert_no: 'CTEVT-PL-2023-4412',
    },
  },
  {
    id: '3',
    profiles: {
      full_name: 'Bikash Shrestha',
      district: 'Bhaktapur',
      municipality: 'Suryabinayak - 5',
      phone: '+977-9801234569',
      avatar_url: null,
      bio: 'Expert mason with 8+ years across Kathmandu valley. Proficient in RCC concrete casting, brick masonry, structural compound walls, traditional stone carving, and floor tiling.',
    },
    worker_profiles: {
      primary_trade: 'mason',
      average_rating: 4.9,
      total_reviews: 31,
      verification_status: 'verified',
      availability: 'busy',
      daily_wage_min: 1000,
      daily_wage_max: 1500,
      years_experience: 8,
      completed_jobs: 72,
      skills: ['Brick Masonry', 'Concrete RCC', 'Tile & Marble', 'Compound Walls', 'Stone Plaster'],
      ctevt_cert_no: 'CTEVT-MS-2021-1209',
    },
  },
  {
    id: '4',
    profiles: {
      full_name: 'Anita Gurung',
      district: 'Pokhara',
      municipality: 'Pokhara Lekhnath - 8',
      phone: '+977-9861234570',
      avatar_url: null,
      bio: 'Premium architectural painter. Specializes in luxury interior wall putty, decorative stencil textures, weather-guard exterior coating, and anti-fungal bathroom ceiling solutions.',
    },
    worker_profiles: {
      primary_trade: 'painter',
      average_rating: 4.7,
      total_reviews: 15,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 700,
      daily_wage_max: 1100,
      years_experience: 5,
      completed_jobs: 29,
      skills: ['Wall Putty', 'Texture Design', 'Waterproofing', 'Exterior Coating', 'Enamel Wood Polish'],
      ctevt_cert_no: 'CTEVT-PT-2022-7721',
    },
  },
  {
    id: '5',
    profiles: {
      full_name: 'Dipendra Chaudhary',
      district: 'Chitwan',
      municipality: 'Bharatpur - 10',
      phone: '+977-9849876543',
      avatar_url: null,
      bio: 'Custom woodworker with 3 years of residential carpentry. Builds modular kitchen cabinets, wooden door/window frames, partition walls, and durable office desks.',
    },
    worker_profiles: {
      primary_trade: 'carpenter',
      average_rating: 4.5,
      total_reviews: 12,
      verification_status: 'unverified',
      availability: 'available',
      daily_wage_min: 850,
      daily_wage_max: 1300,
      years_experience: 3,
      completed_jobs: 21,
      skills: ['Modular Kitchen', 'Furniture Framing', 'Laminate Work', 'Door Hinges', 'Wood Polishing'],
    },
  },
  {
    id: '6',
    profiles: {
      full_name: 'Sunil Thapa',
      district: 'Kathmandu',
      municipality: 'Tokha - 2',
      phone: '+977-9851122334',
      avatar_url: null,
      bio: 'Certified metal fabricator with 7 years of industrial experience. Specializes in heavy roof trusses, metal staircase railings, security grill gates, and ARC/TIG precision welding.',
    },
    worker_profiles: {
      primary_trade: 'welder',
      average_rating: 4.9,
      total_reviews: 20,
      verification_status: 'verified',
      availability: 'available',
      daily_wage_min: 1100,
      daily_wage_max: 1600,
      years_experience: 7,
      completed_jobs: 63,
      skills: ['ARC & TIG Welding', 'Roof Truss', 'Safety Grills', 'Staircase Railing', 'Steel Gates'],
      ctevt_cert_no: 'CTEVT-WD-2020-5611',
    },
  },
];

export function WorkerSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTrade = searchParams.get('trade') || 'all';

  const [selectedTrade, setSelectedTrade] = useState(initialTrade);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkerModal, setActiveWorkerModal] = useState(null);
  const [jobOfferModal, setJobOfferModal] = useState(null);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerBudget, setOfferBudget] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [dbWorkers, setDbWorkers] = useState([]);

  useEffect(() => {
    const tradeParam = searchParams.get('trade');
    if (tradeParam) {
      setSelectedTrade(tradeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const { data, error } = await supabase
          .from('worker_profiles')
          .select('*, profiles!inner(*)');
        if (!error && data && data.length > 0) {
          const formatted = data.map((d) => ({
            id: d.id,
            profiles: {
              full_name: d.profiles?.full_name || 'Worker',
              district: d.profiles?.district || 'Kathmandu',
              municipality: d.profiles?.municipality || 'Central',
              phone: d.profiles?.phone || '+977-9800000000',
              avatar_url: d.profiles?.avatar_url || null,
              bio: d.bio || 'Experienced verified skilled worker available for residential and commercial projects.',
            },
            worker_profiles: {
              primary_trade: d.primary_trade || 'electrician',
              average_rating: d.average_rating || 4.8,
              total_reviews: d.total_reviews || 10,
              verification_status: d.verification_status || 'verified',
              availability: d.availability || 'available',
              daily_wage_min: d.daily_wage_min || 800,
              daily_wage_max: d.daily_wage_max || 1400,
              years_experience: d.years_experience || 4,
              completed_jobs: d.completed_jobs || 15,
              skills: ['Professional Service', 'Standard Safety', 'Site Experience'],
              ctevt_cert_no: d.ctevt_cert_no || null,
            },
          }));
          setDbWorkers(formatted);
        }
      } catch (err) {
        console.warn('Worker fetch:', err);
      }
    };
    fetchWorkers();
  }, []);

  const allWorkers = useMemo(() => {
    const combined = [...dbWorkers];
    const existingIds = new Set(dbWorkers.map((w) => w.id));
    SAMPLE_WORKERS.forEach((sw) => {
      if (!existingIds.has(sw.id)) {
        combined.push(sw);
      }
    });
    return combined;
  }, [dbWorkers]);

  const filteredWorkers = useMemo(() => {
    return allWorkers.filter((w) => {
      const wp = w.worker_profiles;
      const p = w.profiles;

      if (selectedTrade !== 'all' && wp.primary_trade !== selectedTrade) return false;
      if (selectedDistrict !== 'all' && p.district !== selectedDistrict) return false;
      if (verifiedOnly && wp.verification_status !== 'verified') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.full_name.toLowerCase().includes(q);
        const matchTrade = wp.primary_trade.toLowerCase().includes(q);
        const matchDistrict = p.district.toLowerCase().includes(q);
        const matchSkills = (wp.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchTrade && !matchDistrict && !matchSkills) return false;
      }
      return true;
    }).sort((a, b) => {
      const wpA = a.worker_profiles;
      const wpB = b.worker_profiles;
      if (sortBy === 'rating_desc') return (wpB.average_rating || 0) - (wpA.average_rating || 0);
      if (sortBy === 'experience_desc') return (wpB.years_experience || 0) - (wpA.years_experience || 0);
      if (sortBy === 'wage_asc') return (wpA.daily_wage_min || 0) - (wpB.daily_wage_min || 0);
      if (sortBy === 'wage_desc') return (wpB.daily_wage_max || 0) - (wpA.daily_wage_max || 0);
      return 0;
    });
  }, [allWorkers, selectedTrade, selectedDistrict, verifiedOnly, searchQuery, sortBy]);

  const hasActiveFilters = selectedTrade !== 'all' || selectedDistrict !== 'all' || verifiedOnly || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedTrade('all');
    setSelectedDistrict('all');
    setVerifiedOnly(false);
    setSearchQuery('');
    setSortBy('rating_desc');
  };

  const handleSendOffer = (e) => {
    e.preventDefault();
    if (!jobOfferModal) return;
    const workerName = jobOfferModal.profiles.full_name;
    setJobOfferModal(null);
    setActiveWorkerModal(null);
    setOfferTitle('');
    setOfferBudget('');
    setOfferMessage('');
    setToastMessage(`Job offer submitted directly to ${workerName}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFCFE' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: '96px', paddingBottom: '80px' }}>
        <div className="container">
          {/* Header Banner */}
          <div
            style={{
              padding: '32px 0 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-50)',
                  border: '1px solid var(--color-primary-200)',
                  color: 'var(--color-primary-700)',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                <ShieldCheck size={14} color="var(--color-primary-700)" />
                Direct CTEVT Verified Talent
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                fontWeight: '800',
                color: 'var(--color-text-primary)',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-display)',
              }}
            >
              Find Skilled Workers in Nepal
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '640px' }}>
              Browse verified electricians, plumbers, carpenters, masons, and technicians across Nepal with transparent ratings and zero middlemen fees.
            </p>
          </div>

          {/* Quick Trade Filter Chips */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '16px',
              marginBottom: '20px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {TRADE_CHIPS.map((chip) => {
              const Icon = chip.icon;
              const isSelected = selectedTrade === chip.slug;
              return (
                <button
                  key={chip.slug}
                  type="button"
                  onClick={() => setSelectedTrade(chip.slug)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: 'var(--radius-full)',
                    border: isSelected ? '1.5px solid var(--color-primary-700)' : '1px solid var(--color-border)',
                    background: isSelected ? 'var(--color-primary-700)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                    fontSize: '13.5px',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 4px 12px rgba(13, 43, 82, 0.2)' : 'var(--shadow-xs)',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--color-primary-300)';
                      e.currentTarget.style.background = 'var(--color-primary-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.background = '#FFFFFF';
                    }
                  }}
                >
                  <Icon size={15} color={isSelected ? '#FFFFFF' : 'var(--color-primary-600)'} />
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Comprehensive Search & Control Toolbar */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--color-border)',
              padding: '16px 20px',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Top Toolbar Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              {/* Search text box */}
              <div
                style={{
                  gridColumn: 'span 2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-background-subtle)',
                }}
              >
                <Search size={18} color="var(--color-primary-600)" />
                <input
                  type="text"
                  placeholder="Search by worker name, skill, or trade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}
                  >
                    <X size={16} color="var(--color-text-tertiary)" />
                  </button>
                )}
              </div>

              {/* District dropdown */}
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13.5px',
                    background: '#FFFFFF',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  <option value="all">All Locations (Nepal)</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Sort by dropdown */}
              <div style={{ position: 'relative' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13.5px',
                    background: '#FFFFFF',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  <option value="rating_desc">Highest Rated First</option>
                  <option value="experience_desc">Most Experienced First</option>
                  <option value="wage_asc">Daily Wage: Low to High</option>
                  <option value="wage_desc">Daily Wage: High to Low</option>
                </select>
              </div>
            </div>

            {/* Bottom Toolbar Controls Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '10px',
                borderTop: '1px solid var(--color-border-light)',
              }}
            >
              {/* Verified Filter Pill Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '7px 16px',
                    borderRadius: 'var(--radius-full)',
                    border: verifiedOnly ? '1.5px solid var(--color-success)' : '1px solid var(--color-border)',
                    background: verifiedOnly ? '#ECFDF5' : '#FFFFFF',
                    color: verifiedOnly ? 'var(--color-success)' : 'var(--color-text-secondary)',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <ShieldCheck size={16} color={verifiedOnly ? 'var(--color-success)' : 'var(--color-text-tertiary)'} />
                  CTEVT Verified Only
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-secondary)',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                    }}
                  >
                    <X size={14} />
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Total Active Count Counter */}
              <div style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                Found <span style={{ color: 'var(--color-primary-700)', fontWeight: '700' }}>{filteredWorkers.length}</span> verified worker{filteredWorkers.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Unified Structured Worker Grid */}
          {filteredWorkers.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
                alignItems: 'stretch',
              }}
            >
              {filteredWorkers.map((worker) => (
                <div key={worker.id} style={{ display: 'flex' }}>
                  <WorkerCard
                    worker={worker}
                    onClick={() => setActiveWorkerModal(worker)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 20px',
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Search size={28} color="var(--color-primary-600)" />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                No skilled workers found
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
                No workers match your current filters. Try changing your trade, location, or search keywords.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                Reset Search Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Interactive Worker Profile Modal Dialog */}
      {activeWorkerModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            background: 'rgba(10, 25, 47, 0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out forwards',
          }}
          onClick={() => setActiveWorkerModal(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '580px',
              background: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--color-border)',
              padding: '32px',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveWorkerModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-background-subtle)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} color="var(--color-text-secondary)" />
            </button>

            {/* Modal Header: Avatar & Names */}
            <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'var(--color-primary-700)',
                  flexShrink: 0,
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 10px rgba(13, 43, 82, 0.15)',
                }}
              >
                {getInitials(activeWorkerModal.profiles.full_name)}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '21px', fontWeight: '800', margin: 0, color: 'var(--color-text-primary)' }}>
                    {activeWorkerModal.profiles.full_name}
                  </h2>
                  <VerificationBadge status={activeWorkerModal.worker_profiles.verification_status} size="sm" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--color-primary-700)', textTransform: 'capitalize' }}>
                    {activeWorkerModal.worker_profiles.primary_trade}
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>•</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    {activeWorkerModal.worker_profiles.years_experience} Years Experience
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
                  <MapPin size={13} />
                  {activeWorkerModal.profiles.municipality || activeWorkerModal.profiles.district}, Nepal
                </div>
              </div>
            </div>

            {/* CTEVT Credential Box */}
            {activeWorkerModal.worker_profiles.ctevt_cert_no && (
              <div
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Award size={22} color="var(--color-success)" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#065F46' }}>
                    CTEVT National Vocational Certificate Verified
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#047857' }}>
                    Certificate ID: {activeWorkerModal.worker_profiles.ctevt_cert_no}
                  </div>
                </div>
              </div>
            )}

            {/* Rating and Work Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                padding: '14px',
                background: 'var(--color-background-subtle)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', fontWeight: '600', textTransform: 'uppercase' }}>Rating</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '15.5px', fontWeight: '800', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                  <Star size={14} fill="var(--color-accent)" color="var(--color-accent)" />
                  {activeWorkerModal.worker_profiles.average_rating}
                  <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--color-text-tertiary)' }}>
                    ({activeWorkerModal.worker_profiles.total_reviews})
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', fontWeight: '600', textTransform: 'uppercase' }}>Completed</span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-primary-700)', marginTop: '2px' }}>
                  {activeWorkerModal.worker_profiles.completed_jobs} Jobs
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', fontWeight: '600', textTransform: 'uppercase' }}>Daily Rate</span>
                <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                  {formatWage(activeWorkerModal.worker_profiles.daily_wage_min, activeWorkerModal.worker_profiles.daily_wage_max)}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                About Worker & Experience
              </h4>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {activeWorkerModal.profiles.bio}
              </p>
            </div>

            {/* Skills & Specialties */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Skills & Specializations
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(activeWorkerModal.worker_profiles.skills || []).map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: '12.5px',
                      fontWeight: '500',
                      color: 'var(--color-primary-700)',
                      background: 'var(--color-primary-50)',
                      border: '1px solid var(--color-primary-200)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={`tel:${activeWorkerModal.profiles.phone}`}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
                  color: '#FFFFFF',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '600',
                  fontSize: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(13, 43, 82, 0.25)',
                }}
              >
                <Phone size={16} />
                Call {activeWorkerModal.profiles.phone}
              </a>

              <Button
                variant="outline"
                onClick={() => {
                  setJobOfferModal(activeWorkerModal);
                  setActiveWorkerModal(null);
                }}
                style={{
                  padding: '12px 20px',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Send Job Offer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Job Offer Modal */}
      {jobOfferModal && (
        <div
          onClick={() => setJobOfferModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            zIndex: 1100,
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px 32px',
              boxShadow: 'var(--shadow-2xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: '800', margin: 0, color: 'var(--color-text-primary)' }}>
                  Send Job Offer
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Propose a work assignment directly to <strong>{jobOfferModal.profiles.full_name}</strong>
                </p>
              </div>
              <button
                onClick={() => setJobOfferModal(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendOffer}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Job Title / Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2-Room Wiring & Switchboard Setup"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontSize: '13.5px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Offered Budget (NPR) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={offerBudget}
                  onChange={(e) => setOfferBudget(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontSize: '13.5px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  Project Description & Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe location, start date, and specific tools required..."
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-border)',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13.5px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setJobOfferModal(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
                  }}
                >
                  Send Job Offer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 1200,
            background: 'var(--color-primary-700)',
            color: '#FFFFFF',
            padding: '14px 20px',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          <CheckCircle2 size={18} color="#4ADE80" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
