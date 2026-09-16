import { Link } from 'react-router-dom';
import type { Room } from '../../../types';
import { ScheduleDetailBody } from './ScheduleDetailBody';
import { currentStageForIndex } from './scheduleUtils';

interface Props {
  room: Room | null;
  stageIndex: number;
  onRequestStageAdvance: (nextIndex: number) => void;
}

export function ScheduleDetailPanel({
  room,
  stageIndex,
  onRequestStageAdvance,
}: Props) {
  return (
    <section className="detail-panel" aria-live="polite">
      <div className="detail-panel-head">
        <div className="detail-panel-headline">
          <div className="detail-panel-title-row">
            <h2>
              {!room ? (
                'Select an OT room'
              ) : (
                <>
                  {room.id} <span className="detail-title-sep">|</span> {room.procedure}
                </>
              )}
            </h2>
          </div>
          {room && (
            <div className="detail-panel-badges">
              <span className="theatre-stage">{currentStageForIndex(stageIndex).name}</span>
              {room.alert && (
                <div className="alert-strip alert-strip-inline">⚠ {room.alert}</div>
              )}
            </div>
          )}
        </div>
        {room ? (
          <Link to={`/ot/${room.id}`} className="detail-record-link detail-record-link-head">
            Open full record <span className="record-link-arrow" aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
      <div id="detail-content" className={room ? 'detail-body' : 'detail-empty'}>
        {!room && 'Select an OT room above to view live vitals and case details.'}
        {room && (
          <ScheduleDetailBody
            room={room}
            view="rings"
            stageIndex={stageIndex}
            onRequestStageAdvance={onRequestStageAdvance}
          />
        )}
      </div>
    </section>
  );
}
