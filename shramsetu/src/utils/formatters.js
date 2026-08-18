// Shram Setu — Formatting utilities

/**
 * Format wage range as "NPR 800–1,200/day"
 */
export function formatWage(min, max) {
  const fmt = (n) => n?.toLocaleString('en-NP') ?? '—';
  if (min != null && max != null) {
    return `NPR ${fmt(min)}–${fmt(max)}/day`;
  }
  if (min != null) return `NPR ${fmt(min)}+/day`;
  if (max != null) return `Up to NPR ${fmt(max)}/day`;
  return 'Negotiable';
}

/**
 * Format rating display: "4.5 (12 reviews)"
 */
export function formatRating(average, count) {
  if (!count || count === 0) return 'No reviews yet';
  const avg = Number(average).toFixed(1);
  return `${avg} (${count} review${count !== 1 ? 's' : ''})`;
}

/**
 * Format budget range for jobs: "NPR 5,000–15,000"
 */
export function formatBudget(min, max) {
  const fmt = (n) => n?.toLocaleString('en-NP') ?? '—';
  if (min != null && max != null) {
    return `NPR ${fmt(min)}–${fmt(max)}`;
  }
  if (min != null) return `NPR ${fmt(min)}+`;
  if (max != null) return `Up to NPR ${fmt(max)}`;
  return 'Budget negotiable';
}

/**
 * Format relative time: "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(isoDate) {
  if (!isoDate) return '';
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format date: "Aug 18, 2026"
 */
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Truncate text to maxLen with ellipsis
 */
export function truncate(text, maxLen = 100) {
  if (!text || text.length <= maxLen) return text ?? '';
  return text.slice(0, maxLen).trim() + '…';
}

/**
 * Get initials from a name: "Ram Kumar" → "RK"
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}
