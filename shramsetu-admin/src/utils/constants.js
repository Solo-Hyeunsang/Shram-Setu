// Shram Setu Admin — Constants

export const TRADES = [
  { slug: 'electrician', nameEn: 'Electrician', nameNe: 'इलेक्ट्रिशियन', icon: 'zap' },
  { slug: 'plumber', nameEn: 'Plumber', nameNe: 'प्लम्बर', icon: 'droplets' },
  { slug: 'mason', nameEn: 'Mason', nameNe: 'डकर्मी', icon: 'brick-wall' },
  { slug: 'carpenter', nameEn: 'Carpenter', nameNe: 'सिकर्मी', icon: 'hammer' },
  { slug: 'painter', nameEn: 'Painter', nameNe: 'रंगाई', icon: 'paintbrush' },
  { slug: 'welder', nameEn: 'Welder', nameNe: 'वेल्डर', icon: 'flame' },
  { slug: 'hvac', nameEn: 'HVAC Technician', nameNe: 'एचभीएसी', icon: 'wind' },
  { slug: 'gardener', nameEn: 'Gardener / Landscaper', nameNe: 'माली', icon: 'trees' },
  { slug: 'tiler', nameEn: 'Tiler', nameNe: 'टाइल मिस्त्री', icon: 'grid-3x3' },
  { slug: 'general', nameEn: 'General Laborer', nameNe: 'सामान्य श्रमिक', icon: 'hard-hat' },
];

export const VERIFICATION_STATUS = {
  unverified: { label: 'Unverified', color: '#64748B', bgColor: '#F1F5F9' },
  pending: { label: 'Pending Review', color: '#D97706', bgColor: '#FEF3CD' },
  in_review: { label: 'In Review', color: '#328CBD', bgColor: '#E0F2FE' },
  approved: { label: 'Approved (Verified)', color: '#0D9488', bgColor: '#CCFBF1' },
  rejected: { label: 'Rejected', color: '#EF4444', bgColor: '#FEE2E2' },
  more_info_needed: { label: 'More Info Needed', color: '#F59E0B', bgColor: '#FEF3C7' },
};

export const JOB_STATUS = {
  open: { label: 'Open', color: '#0D9488', bgColor: '#CCFBF1' },
  applications_received: { label: 'Applications Received', color: '#D97706', bgColor: '#FEF3CD' },
  assigned: { label: 'Assigned', color: '#328CBD', bgColor: '#E0F2FE' },
  completed: { label: 'Completed', color: '#0D9488', bgColor: '#CCFBF1' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bgColor: '#FEE2E2' },
};

export const DISTRICTS = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kavrepalanchok', 'Chitwan',
  'Pokhara', 'Morang', 'Jhapa', 'Sunsari', 'Rupandehi',
  'Banke', 'Kailali', 'Makwanpur', 'Parsa', 'Dhanusha',
].sort();
