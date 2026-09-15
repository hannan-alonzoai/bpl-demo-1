import { Link } from 'react-router-dom';
import type { Room, ViewMode } from '../../../types';
import { ScheduleDetailBody } from './ScheduleDetailBody';
import { currentStageForIndex } from './scheduleUtils';

const VIEW_MODES: ViewMode[] = ['rings', 'bars', 'numbers'];

interface Props {
  room: Room | null;
  view: ViewMode;
  stageIndex: number;
  onViewChange: (view: ViewMode) => void;
  onRequestStageAdvance: (nextIndex: number) => void;
}

export function ScheduleDetailPanel({
  room,
  view,
  stageIndex,
  onViewChange,
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
            {room && (
              <Link to={`/ot/${room.id}`} className="detail-record-link">
                Open full record →
              </Link>
            )}
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
        <div className="view-toggle" role="group" aria-label="Vitals display">
          {VIEW_MODES.map(v => (
            <button
              key={v}
              type="button"
              data-view={v}
              className={view === v ? 'active' : ''}
              onClick={() => onViewChange(v)}
            >
              {v === 'rings' ? 'Rings' : v === 'bars' ? 'Bars' : 'Numbers'}
            </button>
          ))}
        </div>
      </div>
      <div id="detail-content" className={room ? 'detail-body' : 'detail-empty'}>
        {!room && 'Select an OT room above to view live vitals and case details.'}
        {room && (
          <ScheduleDetailBody
            room={room}
            view={view}
            stageIndex={stageIndex}
            onRequestStageAdvance={onRequestStageAdvance}
          />
        )}
      </div>
    </section>
  );
}
