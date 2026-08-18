// Shram Setu Admin — Job Oversight Page
import { useState } from 'react';
import { Briefcase, AlertCircle, Ban } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatWage, formatDate } from '../../utils/formatters';

const SAMPLE_JOBS = [
  {
    id: 'job-1',
    title: 'Residential Wiring Installation',
    employer_name: 'Himalayan Builders Pvt. Ltd.',
    trade: 'Electrician',
    district: 'Kathmandu',
    duration_days: 14,
    budget_min: 25000,
    budget_max: 40000,
    status: 'open',
    created_at: '2026-08-16T10:00:00Z',
  },
  {
    id: 'job-2',
    title: 'Bathroom Plumbing Repair',
    employer_name: 'Anil Shakya (Homeowner)',
    trade: 'Plumber',
    district: 'Lalitpur',
    duration_days: 3,
    budget_min: 5000,
    budget_max: 12000,
    status: 'open',
    created_at: '2026-08-17T08:00:00Z',
  },
  {
    id: 'job-3',
    title: 'Spam / Misleading Job Posting Test',
    employer_name: 'Anonymous Spammer',
    trade: 'General Laborer',
    district: 'Kathmandu',
    duration_days: 1,
    budget_min: 500,
    budget_max: 1000,
    status: 'open',
    created_at: '2026-08-18T06:30:00Z',
  },
];

export function JobOversight() {
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelJob = () => {
    if (!selectedJob) return;
    setJobs(jobs.map((j) => (j.id === selectedJob.id ? { ...j, status: 'cancelled' } : j)));
    setShowCancelModal(false);
    setSelectedJob(null);
  };

  const columns = [
    {
      header: 'Job Title & Employer',
      accessor: 'title',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>{row.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Posted by {row.employer_name}</div>
        </div>
      ),
    },
    {
      header: 'Trade',
      accessor: 'trade',
    },
    {
      header: 'Location',
      accessor: 'district',
    },
    {
      header: 'Budget Range',
      render: (row) => formatWage(row.budget_min, row.budget_max),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge
          color={row.status === 'open' ? '#0D9488' : row.status === 'completed' ? '#328CBD' : '#EF4444'}
          bgColor={row.status === 'open' ? '#CCFBF1' : row.status === 'completed' ? '#E0F2FE' : '#FEE2E2'}
        >
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        row.status !== 'cancelled' ? (
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedJob(row);
              setShowCancelModal(true);
            }}
            style={{ padding: '4px 12px', fontSize: '12px' }}
          >
            <Ban size={12} />
            Cancel Job
          </Button>
        ) : (
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Cancelled</span>
        )
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
          Job Oversight
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Monitor active marketplace jobs and cancel fraudulent or duplicate postings.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={jobs}
        searchPlaceholder="Search jobs by title, trade, location..."
      />

      {/* Cancel Job Modal */}
      {selectedJob && (
        <Modal
          isOpen={showCancelModal}
          onClose={() => { setShowCancelModal(false); setSelectedJob(null); }}
          title="Cancel Job Posting"
          description={`Are you sure you want to administratively cancel "${selectedJob.title}"?`}
        >
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Cancelling will remove this job from public search and notify any active applicants. This action cannot be undone.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => { setShowCancelModal(false); setSelectedJob(null); }}>
              Back
            </Button>
            <Button variant="danger" onClick={handleCancelJob}>
              Confirm Job Cancellation
            </Button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
