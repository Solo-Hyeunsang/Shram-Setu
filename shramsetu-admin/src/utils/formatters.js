// Shram Setu Admin — Formatters

export function formatDate(isoDate) {
  if (!isoDate) return '—';
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(isoDate) {
  if (!isoDate) return '—';
  return new Date(isoDate).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatWage(min, max) {
  const fmt = (n) => n?.toLocaleString('en-NP') ?? '—';
  if (min != null && max != null) {
    return `NPR ${fmt(min)}–${fmt(max)}/day`;
  }
  if (min != null) return `NPR ${fmt(min)}+/day`;
  if (max != null) return `Up to NPR ${fmt(max)}/day`;
  return 'Negotiable';
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}
