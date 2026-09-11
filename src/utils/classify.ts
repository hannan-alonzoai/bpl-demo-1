import { RANGES } from '../data/ranges';

export function classify(key: string | undefined, value: number | string | undefined): string {
  const r = key ? RANGES[key] : undefined;
  if (!r || r.modeOnly || value === undefined || value === null) return 'vclass-normal';
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (Number.isNaN(num)) return 'vclass-normal';
  if (num < (r.min ?? 0)) {
    if (key === 'HR' || key === 'Pulse') return num <= 40 ? 'vclass-critical' : 'vclass-caution';
    return 'vclass-caution';
  }
  if (!r.noHigh && r.max !== undefined && num > r.max) return 'vclass-critical';
  return 'vclass-normal';
}

export function perRowForWidth(width: number): number {
  const minCard = 300;
  const n = Math.max(1, Math.floor(width / minCard));
  return Math.min(n, 3);
}
