// Shram Setu Admin — CTEVT Verification Queue
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { VERIFICATION_STATUS, TRADES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const SAMPLE_QUEUE = [
  {
    id: 'req-101',
    worker_id: 'w-1',
    worker_name: 'Ram Kumar Tamang',
    trade: 'Electrician',
    district: 'Kathmandu',
    certificate_name: 'CTEVT Level 2 Electrical Wiring Certificate',
    certificate_no: 'CTEVT-EL-2024-8841',
    submitted_at: '2026-08-17T09:30:00Z',
    status: 'pending',
    reviewer_name: null,
  },
  {
    id: 'req-102',
    worker_id: 'w-2',
    worker_name: 'Sita Rai',
    trade: 'Plumber',
    district: 'Lalitpur',
    certificate_name: 'CTEVT Sanitation & Plumbing Level 1',
    certificate_no: 'CTEVT-PL-2023-4412',
    submitted_at: '2026-08-17T11:15:00Z',
    status: 'in_review',
    reviewer_name: 'CTEVT Reviewer',
  },
  {
    id: 'req-103',
    worker_id: 'w-3',
    worker_name: 'Bikash Shrestha',
    trade: 'Mason',
    district: 'Bhaktapur',
    certificate_name: 'National Skill Testing Board (NSTB) Masonry Level 2',
    certificate_no: 'NSTB-MS-2025-1092',
    submitted_at: '2026-08-18T07:45:00Z',
    status: 'pending',
    reviewer_name: null,
  },
  {
    id: 'req-104',
    worker_id: 'w-4',
    worker_name: 'Anita Gurung',
    trade: 'Painter',
    district: 'Pokhara',
    certificate_name: 'CTEVT Decorative Painting Certification',
    certificate_no: 'CTEVT-PT-2024-3321',
    submitted_at: '2026-08-16T14:00:00Z',
    status: 'approved',
    reviewer_name: 'CTEVT Reviewer',
  },
];

export function VerificationQueue() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'in_review' | 'all'
  const [tradeFilter, setTradeFilter] = useState('all');
  const navigate = useNavigate();

  const filteredQueue = SAMPLE_QUEUE.filter((item) => {
    if (activeTab !== 'all' && item.status !== activeTab) return false;
    if (tradeFilter !== 'all' && item.trade.toLowerCase() !== tradeFilter.toLowerCase()) return false;
    return true;
  });

  const columns = [
    {
      header: 'Worker & Certificate',
      accessor: 'worker_name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>{row.worker_name}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {row.certificate_name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
            Reg: {row.certificate_no}
          </div>
        </div>
      ),
    },
    {
      header: 'Trade',
      accessor: 'trade',
      render: (row) => (
        <span style={{ fontWeight: '600', color: 'var(--color-primary-600)' }}>
          {row.trade}
        </span>
      ),
    },
    {
      header: 'Location',
      accessor: 'district',
    },
    {
      header: 'Submitted',
      accessor: 'submitted_at',
      render: (row) => formatDate(row.submitted_at),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const config = VERIFICATION_STATUS[row.status] || VERIFICATION_STATUS.pending;
        return (
          <Badge color={config.color} bgColor={config.bgColor}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: 'Review',
      render: (row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/verifier/requests/${row.id}`)}
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          Review Application
          <ArrowRight size={12} />
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
          CTEVT Verification Queue
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Review vocational certifications and verify skilled credentials for the national marketplace
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          background: '#FFFFFF',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          width: 'fit-content',
          border: '1px solid var(--color-border)',
        }}
      >
        {[
          { key: 'pending', label: 'Pending Review' },
          { key: 'in_review', label: 'In Review' },
          { key: 'all', label: 'All Applications' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              background: activeTab === tab.key ? 'var(--color-primary-500)' : 'transparent',
              color: activeTab === tab.key ? '#FFFFFF' : 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredQueue}
        searchPlaceholder="Search by worker name, certificate number, trade..."
        filterComponent={
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--color-border)',
              background: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '500',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Trades</option>
            {TRADES.map((t) => (
              <option key={t.slug} value={t.nameEn}>{t.nameEn}</option>
            ))}
          </select>
        }
      />
    </AdminLayout>
  );
}
