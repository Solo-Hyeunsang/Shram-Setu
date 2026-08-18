// Shram Setu Admin — Content Moderation Page
import { useState } from 'react';
import { ShieldAlert, Trash2, CheckCircle2, Star } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../utils/formatters';

const SAMPLE_MODERATION_ITEMS = [
  {
    id: 'mod-1',
    type: 'review',
    author: 'Disgruntled User',
    target: 'Ram Kumar Tamang',
    content: 'Abusive language and unverified claims about worker pricing.',
    rating: 1,
    report_reason: 'Inappropriate language / harassment',
    created_at: '2026-08-17T14:00:00Z',
    status: 'flagged',
  },
  {
    id: 'mod-2',
    type: 'portfolio_item',
    author: 'New Worker Account',
    target: 'Portfolio Gallery',
    content: 'Uploaded copyrighted internet image instead of genuine construction photo.',
    report_reason: 'Copyright / fake portfolio image',
    created_at: '2026-08-18T09:30:00Z',
    status: 'flagged',
  },
];

export function ContentModeration() {
  const [items, setItems] = useState(SAMPLE_MODERATION_ITEMS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteItem = () => {
    if (!selectedItem) return;
    setItems(items.filter((i) => i.id !== selectedItem.id));
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleDismissFlag = (itemId) => {
    setItems(items.filter((i) => i.id !== itemId));
  };

  const columns = [
    {
      header: 'Reported Content & Author',
      accessor: 'content',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--color-text-primary)' }}>{row.type.toUpperCase()}: {row.author}</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>"{row.content}"</div>
        </div>
      ),
    },
    {
      header: 'Flag Reason',
      accessor: 'report_reason',
      render: (row) => (
        <Badge color="#EF4444" bgColor="#FEE2E2">
          {row.report_reason}
        </Badge>
      ),
    },
    {
      header: 'Reported',
      accessor: 'created_at',
      render: (row) => formatDate(row.created_at),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDismissFlag(row.id)}
            style={{ padding: '4px 10px', fontSize: '12px' }}
          >
            <CheckCircle2 size={12} color="var(--color-secondary)" />
            Dismiss
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setSelectedItem(row);
              setShowDeleteModal(true);
            }}
            style={{ padding: '4px 10px', fontSize: '12px' }}
          >
            <Trash2 size={12} />
            Delete Content
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
          Content Moderation
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
          Review reported user feedback, reviews, and uploaded portfolio imagery.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        searchPlaceholder="Search reported items..."
        emptyMessage="No pending content moderation flags."
      />

      {/* Delete Item Modal */}
      {selectedItem && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedItem(null); }}
          title="Delete Reported Content"
          description={`Are you sure you want to permanently remove this ${selectedItem.type}?`}
        >
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              The content will be removed from the public marketplace and recalculated from user review statistics.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => { setShowDeleteModal(false); setSelectedItem(null); }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteItem}>
              Confirm Permanent Deletion
            </Button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
