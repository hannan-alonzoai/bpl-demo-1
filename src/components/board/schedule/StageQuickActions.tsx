import { Link } from 'react-router-dom';
import type { Room } from '../../../types';
import { StageProgressTracker } from '../../shared/StageProgressTracker';
import { CaseTrackSummary } from './CaseTrackSummary';
import { caseTrackForRoom, SCHEDULE_STAGES } from './scheduleUtils';

interface Props {
  room: Room;
  currentIndex: number;
  onRequestAdvance: (nextIndex: number) => void;
  /** Mobile expand: compact tracker window (same as OT flowsheet). */
  upcomingOnly?: boolean;
  /** When set (mobile expand), show full-record link directly above quick actions. */
  fullRecordRoomId?: string;
}

export function StageQuickActions({
  room,
  currentIndex,
  onRequestAdvance,
  upcomingOnly,
  fullRecordRoomId,
}: Props) {
  const track = caseTrackForRoom(room);
  const boardCompact = !upcomingOnly;

  return (
    <div className="detail-stages">
      {fullRecordRoomId ? (
        <div className="detail-stages-record-row">
          <Link
            to={`/ot/${fullRecordRoomId}`}
            className="detail-record-link detail-record-link-mobile-expand"
          >
            Open full record <span className="record-link-arrow" aria-hidden>→</span>
          </Link>
        </div>
      ) : null}
      <div className="detail-stages-label">Quick actions · case stages</div>
      <div className="detail-stages-row">
        <div className="detail-stages-track">
          <StageProgressTracker
            stages={SCHEDULE_STAGES}
            currentIndex={currentIndex}
            onRequestAdvance={onRequestAdvance}
            mobileCompact={upcomingOnly}
            boardCompact={boardCompact}
          />
        </div>
        <CaseTrackSummary track={track} compact={upcomingOnly} />
      </div>
    </div>
  );
}
