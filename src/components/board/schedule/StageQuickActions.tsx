import { Link } from 'react-router-dom';
import { StageProgressTracker } from '../../shared/StageProgressTracker';
import { SCHEDULE_STAGES } from './scheduleUtils';

interface Props {
  currentIndex: number;
  onRequestAdvance: (nextIndex: number) => void;
  /** Mobile expand: compact tracker window (same as OT flowsheet). */
  upcomingOnly?: boolean;
  /** When set (mobile expand), show full-record link directly above quick actions. */
  fullRecordRoomId?: string;
}

export function StageQuickActions({
  currentIndex,
  onRequestAdvance,
  upcomingOnly,
  fullRecordRoomId,
}: Props) {
  return (
    <div className="detail-stages">
      {fullRecordRoomId ? (
        <div className="detail-stages-record-row">
          <Link
            to={`/ot/${fullRecordRoomId}`}
            className="detail-record-link detail-record-link-mobile-expand"
          >
            Open full record →
          </Link>
        </div>
      ) : null}
      <div className="detail-stages-label">Quick actions · case stages</div>
      <StageProgressTracker
        stages={SCHEDULE_STAGES}
        currentIndex={currentIndex}
        onRequestAdvance={onRequestAdvance}
        mobileCompact={upcomingOnly}
      />
    </div>
  );
}
