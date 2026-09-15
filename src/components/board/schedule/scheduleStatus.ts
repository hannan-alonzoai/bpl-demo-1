import type { Room } from '../../../types';

export type OtWorkflowStatus = 'critical' | 'in_surgery' | 'in_prep' | 'cleaning' | 'on_hold';

export type OtStatusFilter = 'all' | OtWorkflowStatus;

export const OT_STATUS_META: {
  id: OtWorkflowStatus;
  label: string;
  dot: string;
}[] = [
  { id: 'critical', label: 'Critical', dot: 'critical' },
  { id: 'in_surgery', label: 'In Surgery', dot: 'surgery' },
  { id: 'in_prep', label: 'In Prep', dot: 'prep' },
  { id: 'cleaning', label: 'Cleaning', dot: 'cleaning' },
  { id: 'on_hold', label: 'On Hold', dot: 'hold' },
];

/** Maps demo room data to operational OT workflow status for schedule filters. */
export function getOtWorkflowStatus(room: Room): OtWorkflowStatus {
  const tag = room.completion.tag.toLowerCase();
  const pct = room.completion.pct;

  if (room.status === 'critical' || (room.alert && room.status === 'attention')) {
    return 'critical';
  }
  if (room.completion.delay || tag.includes('hold')) {
    return 'on_hold';
  }
  if (tag.includes('clean') || pct <= 8) {
    return 'cleaning';
  }
  if (tag.includes('prep') || pct < 28) {
    return 'in_prep';
  }
  return 'in_surgery';
}

export function countByWorkflowStatus(roomList: Room[]): Record<OtWorkflowStatus, number> {
  const counts: Record<OtWorkflowStatus, number> = {
    critical: 0,
    in_surgery: 0,
    in_prep: 0,
    cleaning: 0,
    on_hold: 0,
  };
  for (const r of roomList) {
    counts[getOtWorkflowStatus(r)] += 1;
  }
  return counts;
}
