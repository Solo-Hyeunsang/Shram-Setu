// Shram Setu Admin — Verification Audit Trail Page
import { useState } from 'react';
import { History, ShieldCheck, XCircle, HelpCircle } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';

const SAMPLE_AUDIT_LOGS = [
  {
    id: 'aud-1',
    worker_name: 'Anita Gurung',
    trade: 'Painter',
    decision: 'approved',
    reviewer_name: 'CTEVT Officer B (Reviewer)',
    reviewer_notes: 'Verified against CTEVT Decorative Painting Registry 2024.',
    reviewed_at: '2026-08-16T14:30:00Z',
  },
  {
    id: 'aud-2',
    worker_name: 'Suspicious Applicant',
    trade: 'Electrician',
    decision: 'rejected',
    reviewer_name: 'CTEVT Officer A (Reviewer)',
    reviewer_notes: 'Unrecognized training institution and tampered roll number.',
    reviewed_at: '2026-08-15T11:00:00Z',
  },
  {
    id: 'aud-3',
    worker_name: 'Dipendra Chaudhary',
    trade: 'Carpenter',
    decision: 'more_info_needed',
    reviewer_name: 'CTEVT Officer A (Reviewer)',
    reviewer_notes: 'Requested page 2 with stamp.',
    reviewed_at: '2026-08-14T16:20:00Z',
  },
];

export function AuditTrail() {
  const [logs] = useState(SAMPLE_AUDIT_LOGS);

  const columns = [
    {
      header: 'Worker & Trade',
      accessor: 'worker_name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>{row.worker_name}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-primary-600)', fontWeight: '600' }}>{row.trade}</div>
        </div>
      ),
    },
    {
      header: 'Decision Outcome',
      accessor: 'decision',
      render: (row) => {
        if (row.decision === 'approved') return <Badge color="#0D9488" bgColor="#CCFBF1">APPROVED</Badge>;
        if (row.decision === 'rejected') return <Badge color="#EF4444" bgColor="#FEE2E2">REJECTED</Badge>;
        return <Badge color="#F59E0B" bgColor="#FEF3C7">MORE INFO NEEDED</Badge>;
      },
    },
    {
      header: 'CTEVT Reviewer',
      accessor: 'reviewer_name',
    },
    {
      header: 'Reviewer Audit Notes',
      accessor: 'reviewer_notes',
      render: (row) => (
        <span style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
          {row.reviewer_notes}
        </span>
      ),
    },
    {
      header: 'Timestamp',
      accessor: 'reviewed_at',
      render: (row) => formatDate(row.reviewed_at),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
          Verification Audit Trail
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Immutable log of all vocational accreditation decisions and reviewer notes
        </p>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchPlaceholder="Search audit history..."
      />
    </AdminLayout>
  );
}
