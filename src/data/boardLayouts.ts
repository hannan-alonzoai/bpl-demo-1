export type BoardLayoutId = 'flip' | 'scroll' | 'compact' | 'schedule' | 'rows';

export interface BoardLayoutOption {
  id: BoardLayoutId;
  name: string;
  shortLabel: string;
  description: string;
  /** Static HTML demo at site root (also copied to dist on build). */
  demoFile: string;
}

export const BOARD_LAYOUTS: BoardLayoutOption[] = [
  {
    id: 'flip',
    name: 'Flip cards',
    shortLabel: 'Flip',
    description: 'Full cards in a grid; click to flip for hemodynamics, ventilation, and temperature.',
    demoFile: 'index.htm',
  },
  {
    id: 'scroll',
    name: 'Scroll cards',
    shortLabel: 'Scroll',
    description: 'Taller cards with in-card scroll for the full vitals readout on one face.',
    demoFile: 'index2.html',
  },
  {
    id: 'compact',
    name: 'Compact grid',
    shortLabel: 'Compact',
    description: 'Smaller summary cards with elapsed pie and a detail modal on “View details”.',
    demoFile: 'index3.html',
  },
  {
    id: 'schedule',
    name: 'Schedule strip',
    shortLabel: 'Schedule',
    description: 'Horizontal OT strip with search; selected room shows detail in a panel below.',
    demoFile: 'index4.html',
  },
  {
    id: 'rows',
    name: 'List rows',
    shortLabel: 'Rows',
    description: 'KPI metrics and scannable OT rows; click a row for the full detail modal.',
    demoFile: 'index5.html',
  },
];

export function boardLayoutById(id: string | undefined): BoardLayoutOption | undefined {
  return BOARD_LAYOUTS.find(l => l.id === id);
}

export function demoUrlForLayout(layout: BoardLayoutOption): string {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return `${normalized}${layout.demoFile}`;
}
