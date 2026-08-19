// Shram Setu — Trade slugs, status labels, semantic colors, districts

// ─── Trade Categories ─────────────────────────────────────────────
export const TRADES = [
  { slug: 'electrician', nameEn: 'Electrician', nameNe: 'इलेक्ट्रिशियन', icon: 'zap', description: 'Wiring, installations, electrical repairs' },
  { slug: 'plumber', nameEn: 'Plumber', nameNe: 'प्लम्बर', icon: 'droplets', description: 'Pipe fitting, water systems, drainage' },
  { slug: 'mason', nameEn: 'Mason', nameNe: 'डकर्मी', icon: 'brick-wall', description: 'Bricklaying, stonework, construction' },
  { slug: 'carpenter', nameEn: 'Carpenter', nameNe: 'सिकर्मी', icon: 'hammer', description: 'Woodwork, furniture, framing' },
  { slug: 'painter', nameEn: 'Painter', nameNe: 'रंगाई', icon: 'paintbrush', description: 'Interior & exterior painting' },
  { slug: 'welder', nameEn: 'Welder', nameNe: 'वेल्डर', icon: 'flame', description: 'Metal welding & fabrication' },
  { slug: 'hvac', nameEn: 'HVAC Technician', nameNe: 'एचभीएसी', icon: 'wind', description: 'Heating, ventilation, air conditioning' },
  { slug: 'gardener', nameEn: 'Gardener / Landscaper', nameNe: 'माली', icon: 'trees', description: 'Landscaping, garden maintenance' },
  { slug: 'tiler', nameEn: 'Tiler', nameNe: 'टाइल मिस्त्री', icon: 'grid-3x3', description: 'Floor & wall tiling' },
  { slug: 'general', nameEn: 'General Laborer', nameNe: 'सामान्य श्रमिक', icon: 'hard-hat', description: 'General construction & labor' },
];

// ─── Verification Status ──────────────────────────────────────────
export const VERIFICATION_STATUS = {
  unverified: { label: 'Unverified', color: 'var(--color-text-tertiary)', bgColor: '#F1F5F9', icon: 'shield-x' },
  pending: { label: 'Pending', color: '#D97706', bgColor: '#FEF3CD', icon: 'shield-alert' },
  in_review: { label: 'In Review', color: '#1B4D89', bgColor: '#EEF4FA', icon: 'shield-ellipsis' },
  verified: { label: 'Verified', color: '#16A34A', bgColor: '#D1FAE5', icon: 'shield-check' },
  rejected: { label: 'Rejected', color: '#C81E27', bgColor: '#FEF2F2', icon: 'shield-ban' },
  more_info_needed: { label: 'More Info Needed', color: '#D97706', bgColor: '#FEF3CD', icon: 'shield-question' },
};

// ─── Job Status ───────────────────────────────────────────────────
export const JOB_STATUS = {
  open: { label: 'Open', color: '#16A34A', bgColor: '#D1FAE5' },
  applications_received: { label: 'Applications Received', color: '#D97706', bgColor: '#FEF3CD' },
  assigned: { label: 'Worker Assigned', color: '#1B4D89', bgColor: '#EEF4FA' },
  completed: { label: 'Completed', color: '#16A34A', bgColor: '#D1FAE5' },
  cancelled: { label: 'Cancelled', color: '#C81E27', bgColor: '#FEF2F2' },
};

// ─── Application Status ──────────────────────────────────────────
export const APPLICATION_STATUS = {
  pending: { label: 'Pending', color: '#D97706', bgColor: '#FEF3CD' },
  accepted: { label: 'Accepted', color: '#16A34A', bgColor: '#D1FAE5' },
  rejected: { label: 'Rejected', color: '#C81E27', bgColor: '#FEF2F2' },
};

// ─── Availability ─────────────────────────────────────────────────
export const AVAILABILITY = {
  available: { label: 'Available', color: '#059669', dotColor: '#10B981' },
  busy: { label: 'Busy', color: '#D97706', dotColor: '#F59E0B' },
  not_taking_work: { label: 'Not Taking Work', color: '#8BA4B5', dotColor: '#94A3B8' },
};

// ─── Employer Types ───────────────────────────────────────────────
export const EMPLOYER_TYPES = {
  individual: 'Individual',
  business: 'Business',
  government: 'Government',
  ngo: 'NGO',
};

// ─── Notification Types ───────────────────────────────────────────
export const NOTIFICATION_TYPES = {
  new_application: { label: 'New Application', icon: 'file-text' },
  application_accepted: { label: 'Application Accepted', icon: 'check-circle' },
  application_rejected: { label: 'Application Rejected', icon: 'x-circle' },
  new_review: { label: 'New Review', icon: 'star' },
  verification_approved: { label: 'Verification Approved', icon: 'shield-check' },
  verification_rejected: { label: 'Verification Rejected', icon: 'shield-x' },
  verification_more_info: { label: 'More Info Requested', icon: 'shield-question' },
  new_verification_request: { label: 'New Verification Request', icon: 'shield-alert' },
};

// ─── Districts of Nepal (selected major ones for prototype) ──────
export const DISTRICTS = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kavrepalanchok', 'Chitwan',
  'Pokhara', 'Morang', 'Jhapa', 'Sunsari', 'Rupandehi',
  'Banke', 'Kailali', 'Makwanpur', 'Parsa', 'Dhanusha',
  'Kaski', 'Nuwakot', 'Sindhupalchok', 'Bara', 'Gorkha',
].sort();
