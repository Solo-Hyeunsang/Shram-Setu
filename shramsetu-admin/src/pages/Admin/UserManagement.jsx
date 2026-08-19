// Shram Setu Admin — User Management Page
import { useState } from 'react';
import { ShieldCheck, UserX, UserCheck, Search, Filter } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';

const SAMPLE_USERS = [
  {
    id: 'u-1',
    full_name: 'Ram Kumar Tamang',
    email: 'ram.tamang@gmail.com',
    phone: '+977-9841234567',
    role: 'worker',
    district: 'Kathmandu',
    trade: 'Electrician',
    verification_status: 'verified',
    is_suspended: false,
    created_at: '2026-06-15T10:00:00Z',
  },
  {
    id: 'u-2',
    full_name: 'Sita Rai',
    email: 'sita.rai@gmail.com',
    phone: '+977-9812345678',
    role: 'worker',
    district: 'Lalitpur',
    trade: 'Plumber',
    verification_status: 'verified',
    is_suspended: false,
    created_at: '2026-07-01T12:30:00Z',
  },
  {
    id: 'u-3',
    full_name: 'Himalayan Builders Pvt. Ltd.',
    email: 'contact@himalayanbuilders.com',
    phone: '+977-9801122334',
    role: 'employer',
    district: 'Bhaktapur',
    employer_type: 'business',
    verification_status: 'unverified',
    is_suspended: false,
    created_at: '2026-07-10T09:15:00Z',
  },
  {
    id: 'u-4',
    full_name: 'Dipendra Chaudhary',
    email: 'dipendra.c@yahoo.com',
    phone: '+977-9866778899',
    role: 'worker',
    district: 'Chitwan',
    trade: 'Carpenter',
    verification_status: 'unverified',
    is_suspended: false,
    created_at: '2026-08-01T14:45:00Z',
  },
  {
    id: 'u-5',
    full_name: 'Suspicious Account Testing',
    email: 'spam@botmail.com',
    phone: '+977-9899999999',
    role: 'employer',
    district: 'Kathmandu',
    employer_type: 'individual',
    verification_status: 'unverified',
    is_suspended: true,
    created_at: '2026-08-14T08:20:00Z',
  },
];

export function UserManagement() {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  const handleToggleSuspend = () => {
    if (!selectedUser) return;
    setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, is_suspended: !u.is_suspended } : u)));
    setShowSuspendModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  const columns = [
    {
      header: 'User Name / Details',
      accessor: 'full_name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>{row.full_name}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>{row.email} | {row.phone}</div>
        </div>
      ),
    },
    {
      header: 'Role / Type',
      accessor: 'role',
      render: (row) => (
        <div>
          <Badge
            color={row.role === 'worker' ? 'var(--color-primary-700)' : 'var(--color-secondary-600)'}
            bgColor={row.role === 'worker' ? 'var(--color-primary-50)' : 'var(--color-secondary-50)'}
          >
            {row.role.toUpperCase()}
          </Badge>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {row.trade || row.employer_type}
          </div>
        </div>
      ),
    },
    {
      header: 'District',
      accessor: 'district',
    },
    {
      header: 'Status',
      accessor: 'is_suspended',
      render: (row) => (
        row.is_suspended ? (
          <Badge color="#EF4444" bgColor="#FEE2E2">SUSPENDED</Badge>
        ) : (
          <Badge color="#0D9488" bgColor="#CCFBF1">ACTIVE</Badge>
        )
      ),
    },
    {
      header: 'Joined',
      accessor: 'created_at',
      render: (row) => formatDate(row.created_at),
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button
          variant={row.is_suspended ? 'outline' : 'danger'}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(row);
            setShowSuspendModal(true);
          }}
          style={{ padding: '4px 12px', fontSize: '12px' }}
        >
          {row.is_suspended ? 'Unsuspend' : 'Suspend User'}
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
          User Management
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Manage all workers and employers across Nepal. Suspend accounts for policy violations.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        searchPlaceholder="Search by name, email, phone, trade..."
        filterComponent={
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
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
            <option value="all">All Roles</option>
            <option value="worker">Workers Only</option>
            <option value="employer">Employers Only</option>
          </select>
        }
      />

      {/* Suspend / Unsuspend Confirmation Modal */}
      {selectedUser && (
        <Modal
          isOpen={showSuspendModal}
          onClose={() => { setShowSuspendModal(false); setSelectedUser(null); }}
          title={selectedUser.is_suspended ? 'Unsuspend User Account' : 'Suspend User Account'}
          description={`Are you sure you want to ${selectedUser.is_suspended ? 'restore access for' : 'suspend'} ${selectedUser.full_name}?`}
        >
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              {selectedUser.is_suspended
                ? 'Unsuspending will immediately restore full platform access for this user.'
                : 'Suspended users will be immediately logged out and blocked from posting jobs, applying, or contacting users.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => { setShowSuspendModal(false); setSelectedUser(null); }}>
              Cancel
            </Button>
            <Button
              variant={selectedUser.is_suspended ? 'primary' : 'danger'}
              onClick={handleToggleSuspend}
            >
              {selectedUser.is_suspended ? 'Confirm Unsuspend' : 'Confirm Suspension'}
            </Button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
