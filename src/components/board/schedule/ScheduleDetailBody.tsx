import type { Room, ViewMode } from '../../../types';
import { ScheduleVitalGroup } from './ScheduleVitalViews';
import { StageQuickActions } from './StageQuickActions';

interface Props {
  room: Room;
  view: ViewMode;
  stageIndex: number;
  onRequestStageAdvance: (nextIndex: number) => void;
  mobileExpand?: boolean;
}

export function ScheduleDetailBody({ room, view, stageIndex, onRequestStageAdvance, mobileExpand }: Props) {
  const groups = (
    <>
      <div className="detail-group hemo">
        <h4>HEMODYNAMICS</h4>
        <ScheduleVitalGroup items={room.detail.hemo} view={view} />
      </div>
      <div className="detail-group vent">
        <h4>VENTILATION</h4>
        <ScheduleVitalGroup items={room.detail.vent} view={view} />
      </div>
      <div className="detail-group temp">
        <h4>TEMPERATURE</h4>
        <ScheduleVitalGroup items={room.detail.temp} view={view} />
      </div>
    </>
  );

  if (mobileExpand) {
    return (
      <div className="mobile-expand-body">
        <StageQuickActions currentIndex={stageIndex} onRequestAdvance={onRequestStageAdvance} />
        <div className="detail-vitals mobile-expand-vitals">
          <h3>Patient vitals</h3>
          <div className="detail-inner">{groups}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="detail-hero">
        <StageQuickActions currentIndex={stageIndex} onRequestAdvance={onRequestStageAdvance} />
      </div>
      <div className="detail-vitals">
        <h3>Patient vitals</h3>
        <div className="detail-inner">{groups}</div>
      </div>
    </>
  );
}
