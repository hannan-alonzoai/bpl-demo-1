import type { Room } from '../../../types';
import {
  countByWorkflowStatus,
  getOtWorkflowStatus,
  OT_STATUS_META,
  type OtStatusFilter,
} from './scheduleStatus';

interface Props {
  rooms: Room[];
  active: OtStatusFilter;
  onChange: (filter: OtStatusFilter) => void;
}

export function OtStatusFilters({ rooms, active, onChange }: Props) {
  const counts = countByWorkflowStatus(rooms);

  return (
    <div className="ot-status-filters-block">
      <div className="ot-filter-pills scroll-x" role="tablist" aria-label="Filter OT list">
        <button
          type="button"
          role="tab"
          className={`ot-filter-pill${active === 'all' ? ' active' : ''}`}
          aria-selected={active === 'all'}
          onClick={() => onChange('all')}
        >
          All OTs ({rooms.length})
        </button>
        {OT_STATUS_META.map(meta => (
          <button
            key={`pill-${meta.id}`}
            type="button"
            role="tab"
            className={`ot-filter-pill${active === meta.id ? ' active' : ''}`}
            aria-selected={active === meta.id}
            onClick={() => onChange(meta.id)}
          >
            {meta.label} ({counts[meta.id]})
          </button>
        ))}
      </div>
    </div>
  );
}

export function filterRoomsByWorkflow(rooms: Room[], filter: OtStatusFilter): Room[] {
  if (filter === 'all') return rooms;
  return rooms.filter(r => getOtWorkflowStatus(r) === filter);
}
