// Shram Setu Admin — Verification Request Detail & Review Action Screen
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  User,
  MapPin,
  Briefcase,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { VERIFICATION_STATUS } from '../../utils/constants';

const SAMPLE_REQUEST_DETAILS = {
  'req-101': {
    id: 'req-101',
    worker_id: 'w-1',
    worker_name: 'Ram Kumar Tamang',
    phone: '+977-9841234567',
    email: 'ram.tamang@gmail.com',
    district: 'Kathmandu',
    trade: 'Electrician',
    years_experience: 6,
    daily_wage: 'NPR 800–1,200/day',
    bio: 'Certified building electrician with 6+ years of commercial and residential wiring experience in Kathmandu Valley.',
    skills: ['Domestic Wiring', '3-Phase Industrial Circuits', 'Solar Inverter Setup', 'Fuse Board Repair'],
    certificate_name: 'CTEVT Level 2 Electrical Installation & Wiring',
    certificate_no: 'CTEVT-EL-2024-8841',
    issuing_body: 'Council for Technical Education and Vocational Training (CTEVT)',
    issue_date: '2024-03-15',
    expiry_date: '2029-03-15',
    status: 'pending',
    previous_attempts: [
      {
        attempt_date: '2024-01-10',
        decision: 'rejected',
        reason: 'Blurry photo of citizenship document',
        reviewer: 'CTEVT Officer A',
      },
    ],
  },
};

export function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = SAMPLE_REQUEST_DETAILS[id] || SAMPLE_REQUEST_DETAILS['req-101'];

  const [actionModal, setActionModal] = useState(null); // 'approve' | 'reject' | 'more_info'
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Invalid certificate registration number');
  const [moreInfoMessage, setMoreInfoMessage] = useState('');
  const [currentStatus, setCurrentStatus] = useState(request.status);

  const handleApprove = () => {
    setCurrentStatus('approved');
    setActionModal(null);
  };

  const handleReject = () => {
    setCurrentStatus('rejected');
    setActionModal(null);
  };

  const handleRequestMoreInfo = () => {
    setCurrentStatus('more_info_needed');
    setActionModal(null);
  };

  const statusConfig = VERIFICATION_STATUS[currentStatus] || VERIFICATION_STATUS.pending;

  return (
    <AdminLayout>
      {/* Top back navigation */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/verifier/queue"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            color: 'var(--color-text-secondary)',
            fontWeight: '600',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Back to Verification Queue
        </Link>

        <Badge color={statusConfig.color} bgColor={statusConfig.bgColor} size="md">
          {statusConfig.label}
        </Badge>
      </div>

      {/* Main Review Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '28px', alignItems: 'start' }}>
        {/* Left Column: Certificate & Qualifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Certificate Credential Box */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: '28px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-lg)', background: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} color="var(--color-primary-600)" />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
                  Vocational Certificate Under Review
                </h3>
                <span style={{ fontSize: '12.5px', color: 'var(--color-text-tertiary)' }}>
                  CTEVT Official Record
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'var(--color-background-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                border: '1px solid var(--color-border)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13.5px' }}>
                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: '700' }}>Certificate Name</span>
                  <div style={{ fontWeight: '700', color: 'var(--color-text-primary)', marginTop: '2px' }}>{request.certificate_name}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: '700' }}>Registration / Roll No</span>
                  <div style={{ fontWeight: '700', color: 'var(--color-primary-600)', marginTop: '2px' }}>{request.certificate_no}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: '700' }}>Issuing Authority</span>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginTop: '2px' }}>{request.issuing_body}</div>
                </div>
                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: '700' }}>Issue Date / Validity</span>
                  <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginTop: '2px' }}>{request.issue_date} (Valid to {request.expiry_date})</div>
                </div>
              </div>
            </div>

            {/* Simulated Document Preview Window */}
            <div
              style={{
                border: '2px dashed var(--color-primary-200)',
                borderRadius: 'var(--radius-xl)',
                padding: '32px 20px',
                textAlign: 'center',
                background: 'var(--color-primary-50)',
              }}
            >
              <FileText size={36} color="var(--color-primary-500)" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                {request.certificate_name}.pdf
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                Uploaded document scan (2.4 MB)
              </div>
              <div style={{ marginTop: '14px' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('#', '_blank')}
                >
                  <ExternalLink size={13} />
                  Open Full Resolution Document
                </Button>
              </div>
            </div>
          </div>

          {/* Previous Verification History */}
          {request.previous_attempts?.length > 0 && (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-2xl)',
                padding: '24px',
                border: '1px solid var(--color-border)',
              }}
            >
              <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>
                Previous Verification History
              </h4>
              {request.previous_attempts.map((att, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-lg)',
                    background: '#FEE2E2',
                    border: '1px solid #FECACA',
                    fontSize: '13px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: 'var(--color-danger)' }}>
                    <span>Attempt Decision: {att.decision.toUpperCase()}</span>
                    <span>{att.attempt_date}</span>
                  </div>
                  <div style={{ color: '#7F1D1D', marginTop: '4px' }}>
                    Reason: {att.reason} ({att.reviewer})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Worker Profile & Review Action Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Worker Profile Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: '24px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
              Worker Profile Summary
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: 'var(--color-primary-700)',
                  fontSize: '18px',
                }}
              >
                RT
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                  {request.worker_name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-primary-600)', fontWeight: '600' }}>
                  {request.trade} • {request.years_experience} Years Exp
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--color-text-tertiary)" /> {request.district}, Nepal
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={14} color="var(--color-text-tertiary)" /> Daily Wage: {request.daily_wage}
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              "{request.bio}"
            </p>

            <div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                Declared Skills
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {request.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-background-subtle)',
                      border: '1px solid var(--color-border)',
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      fontWeight: '500',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Decision Controls Box */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-2xl)',
              padding: '24px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
              Review Decision
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Select an official CTEVT verification outcome:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setActionModal('approve')}
              >
                <CheckCircle2 size={16} />
                Approve & Issue Verified Badge
              </Button>

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setActionModal('more_info')}
                style={{ borderColor: 'var(--color-warning)' }}
              >
                <HelpCircle size={16} color="var(--color-warning)" />
                Request More Information
              </Button>

              <Button
                variant="danger"
                size="md"
                fullWidth
                onClick={() => setActionModal('reject')}
              >
                <XCircle size={16} />
                Reject Application
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={actionModal === 'approve'}
        onClose={() => setActionModal(null)}
        title="Approve CTEVT Verification"
        description={`Grant official verification status to ${request.worker_name}.`}
      >
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
            Reviewer Audit Notes (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Verified against CTEVT database roll no. Validated Level 2 qualification..."
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-border)', fontSize: '13.5px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setActionModal(null)}>Cancel</Button>
          <Button variant="secondary" onClick={handleApprove}>Confirm Approval</Button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={actionModal === 'reject'}
        onClose={() => setActionModal(null)}
        title="Reject Verification Application"
        description="A clear rejection reason is mandatory and will be communicated to the applicant."
      >
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
            Rejection Reason *
          </label>
          <select
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-border)', fontSize: '13.5px', outline: 'none', background: '#FFFFFF' }}
          >
            <option value="Invalid certificate registration number">Invalid certificate registration number</option>
            <option value="Certificate expired / not valid">Certificate expired / not valid</option>
            <option value="Unrecognized training institution">Unrecognized training institution</option>
            <option value="Unreadable / blurred document scan">Unreadable / blurred document scan</option>
            <option value="Identity mismatch between profile and certificate">Identity mismatch between profile and certificate</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
            Reviewer Internal Notes
          </label>
          <textarea
            rows={2}
            placeholder="Additional notes for institutional audit record..."
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-border)', fontSize: '13.5px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setActionModal(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleReject}>Confirm Rejection</Button>
        </div>
      </Modal>

      {/* Request More Info Modal */}
      <Modal
        isOpen={actionModal === 'more_info'}
        onClose={() => setActionModal(null)}
        title="Request Additional Information"
        description="Notify the worker to submit clearer scans or supplementary documents."
      >
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
            Message to Worker *
          </label>
          <textarea
            rows={4}
            placeholder="Please re-upload page 2 of your CTEVT diploma showing the official seal..."
            value={moreInfoMessage}
            onChange={(e) => setMoreInfoMessage(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-border)', fontSize: '13.5px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setActionModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleRequestMoreInfo}>Send Request to Worker</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
