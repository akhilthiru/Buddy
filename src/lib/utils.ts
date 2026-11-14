export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: boolean | number | string | undefined | null }
  | ClassValue[];

/**
 * Standard Tailwind CSS classname merger.
 * Pure zero-dependency implementation supporting conditionals, arrays, and objects.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const [key, val] of Object.entries(input)) {
        if (val) classes.push(key);
      }
    }
  }
  return classes.join(' ');
}

/**
 * Formats a numeric Indian Rupee amount with ₹ symbol and commas
 * e.g., 7500 -> ₹7,500
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Relative time formatting (e.g., 'Just now', '10m ago', '2h ago', 'Yesterday')
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

/**
 * Formats clock time e.g., '10:35 AM'
 */
export function formatClockTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Human-readable display label for Discovery Modalities
 */
export function getModalityLabel(modality: string): { label: string; badge: string; code: string } {
  switch (modality) {
    case 'MODALITY_1':
      return { code: 'M1', badge: 'Has Room Available', label: 'Offering a private/shared room in current flat' };
    case 'MODALITY_2':
      return { code: 'M2', badge: 'Looking for Room', label: 'Seeking vacant accommodation with flatmate' };
    case 'MODALITY_3':
      return { code: 'M3', badge: 'Flat Leased / Relocating', label: 'Has lease, seeking co-tenant for moving' };
    case 'MODALITY_4':
    default:
      return { code: 'M4', badge: 'Team Up First', label: 'Looking for compatible flatmate to apartment hunt together' };
  }
}

/**
 * Human-readable Trivandrum micro-market names
 */
export function getSuburbLabel(suburb: string): string {
  const map: Record<string, string> = {
    KAZHAKKOOTTAM: 'Kazhakkoottam',
    KARIAVATTOM: 'Kariavattom',
    SREEKARYAM: 'Sreekaryam',
    ULLOOR: 'Ulloor',
    PATTOM: 'Pattom',
    KOWDIAR: 'Kowdiar',
    MANACAUD: 'Manacaud',
    VELLAYAMBALAM: 'Vellayambalam',
  };
  return map[suburb] || suburb;
}
