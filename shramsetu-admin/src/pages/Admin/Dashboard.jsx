// Shram Setu Admin — Operations Dashboard
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const SAMPLE_RECENT_ACTIVITY = [
  {
    id: 'act-1',
    type: 'worker_registration',
    user: 'Bikash Shrestha',
    role: 'worker',
    trade: 'Mason',
    district: 'Bhaktapur',
    status: 'unverified',
    date: '10 mins ago',
  },
  {
    id: 'act-2',
    type: 'job_posted',
    user: 'Himalayan Builders Pvt. Ltd.',
    role: 'employer',
    title: 'Compound Wall Construction',
    district: 'Bhaktapur',
    status: 'open',
    date: '35 mins ago',
  },
  {
    id: 'act-3',
    type: 'verification_request',
    user: 'Ram Kumar Tamang',
    role: 'worker',
    trade: 'Electrician',
    district: 'Kathmandu',
    status: 'pending',
    date: '1 hour ago',
  },
  {
    id: 'act-4',
    type: 'job_completed',
    user: 'Sita Rai & Individual Employer',
    role: 'pair',
    title: 'Bathroom Plumbing Repair',
    district: 'Lalitpur',
    status: 'completed',
    date: '3 hours ago',
  },
];

export function Dashboard() {
  const navigate = useNavigate();

  const columns = [
    {
      header: 'Event / User',
      accessor: 'user',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>{row.user}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{row.title || row.trade}</div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <Badge
          color={row.role === 'worker' ? '#328CBD' : '#0D9488'}
          bgColor={row.role === 'worker' ? '#E0F2FE' : '#CCFBF1'}
        >
          {row.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Location',
      accessor: 'district',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge color="#475569" bgColor="#F1F5F9">
          {row.status.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      header: 'Time',
      accessor: 'date',
    },
  ];

  return (
    <AdminLayout>
      {/* Title */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
          Platform Overview
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Real-time metrics and operational health across Shram Setu
        </p>
      </div>

      {/* Top Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <StatCard
          title="Total Skilled Workers"
          value="542"
          change="12% this week"
          isPositive={true}
          icon={Users}
          color="var(--color-primary-500)"
        />
        <StatCard
          title="Verified by CTEVT"
          value="184"
          change="34% verification rate"
          isPositive={true}
          icon={ShieldCheck}
          color="var(--color-secondary)"
        />
        <StatCard
          title="Active Employers"
          value="128"
          change="8 new today"
          isPositive={true}
          icon={UserCheck}
          color="#8B5CF6"
        />
        <StatCard
          title="Completed Jobs"
          value="246"
          change="98.2% completion rate"
          isPositive={true}
          icon={CheckCircle2}
          color="var(--color-secondary)"
        />
      </div>

      {/* Quick Actions & Overview Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Recent Activity Table */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
              Recent Platform Activity
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/users')}
            >
              View All Users
              <ArrowUpRight size={14} />
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={SAMPLE_RECENT_ACTIVITY}
            searchable={false}
            pageSize={5}
          />
        </div>

        {/* Operational Highlights */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
            Operational Alerts
          </h3>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-lg)' }}>
            <ShieldCheck size={20} color="var(--color-primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary-800)' }}>
                12 Pending Verifications
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-primary-600)', marginTop: '2px' }}>
                CTEVT queue requires reviewer attention
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: '#FEF3CD', borderRadius: 'var(--radius-lg)' }}>
            <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#92400E' }}>
                0 Critical Moderation Flags
              </div>
              <div style={{ fontSize: '12px', color: '#B45309', marginTop: '2px' }}>
                No flagged reviews or abusive postings
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => navigate('/verifier/queue')}
            >
              Open CTEVT Queue
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
