import type { CaseTrackSnapshot } from '../../../types';

interface Props {
  track: CaseTrackSnapshot;
  compact?: boolean;
}

export function CaseTrackSummary({ track, compact }: Props) {
  return (
    <aside className={`detail-case-track${compact ? ' detail-case-track-compact' : ''}`} aria-label="Recent intake">
      <div className="detail-case-track-item detail-case-track-fluid">
        <span className="detail-case-track-label">Last fluid</span>
        <span className="detail-case-track-name">{track.lastFluid.name}</span>
        <span className="detail-case-track-time">{track.lastFluid.at}</span>
      </div>
      <div className="detail-case-track-item detail-case-track-med">
        <span className="detail-case-track-label">Last medicine</span>
        <span className="detail-case-track-name">{track.lastMedication.name}</span>
        <span className="detail-case-track-time">{track.lastMedication.at}</span>
      </div>
    </aside>
  );
}
