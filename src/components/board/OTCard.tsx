import type { Room } from '../../types';
import { classify } from '../../utils/classify';

interface Props {
  room: Room;
  onViewDetails: () => void;
}

function ElapsedPie({ pct }: { pct: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = c - (clamped / 100) * c;

  return (
    <div className="compact-pie" aria-label={`Elapsed ${clamped}%`}>
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <g transform="rotate(-90 26 26)">
          <circle className="pie-bg" cx="26" cy="26" r={r} />
          <circle className="pie-fg" cx="26" cy="26" r={r} strokeDasharray={c} strokeDashoffset={offset} />
        </g>
        <text x="26" y="26" textAnchor="middle" dominantBaseline="central" className="pie-num">{clamped}%</text>
      </svg>
      <span className="compact-pie-label">Elapsed</span>
    </div>
  );
}

export function OTCard({ room, onViewDetails }: Props) {
  const { completion: c } = room;

  return (
    <div className="card card-compact" data-id={room.id} data-status={room.status}>
      <div className="card-top">
        <div className="card-id">{room.id}</div>
        <div className={`status-pill status-${room.status}`}>{room.statusLabel}</div>
      </div>
      <div className="card-compact-body">
        <div className="card-compact-main">
          <div className="patient-line patient-line-compact">{room.patient}</div>
          <div className="vitals-row vitals-row-compact">
            {room.vitals.map(v => (
              <div className="vital" key={v.l}>
                <div className="label">{v.l}</div>
                <div className={`value ${classify(v.key, typeof v.v === 'number' ? v.v : undefined)}`}>{v.v}</div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="view-details-link"
            onClick={e => {
              e.stopPropagation();
              onViewDetails();
            }}
          >
            View details
          </button>
        </div>
        <ElapsedPie pct={c.pct} />
      </div>
    </div>
  );
}
