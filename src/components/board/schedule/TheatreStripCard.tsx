import type { Room } from '../../../types';
import { scheduleClassify } from './scheduleUtils';
import { ProgressPie } from './ProgressPie';
import { currentStageForIndex, parsePatient } from './scheduleUtils';

interface Props {
  room: Room;
  stageIndex: number;
  completionPct: number;
  selected?: boolean;
  onSelect: () => void;
}

export function TheatreStripCard({ room, stageIndex, completionPct, selected, onSelect }: Props) {
  const { name, asa } = parsePatient(room.patient);
  const stage = currentStageForIndex(stageIndex);

  return (
    <button
      type="button"
      className={`ot-theatre-card${selected ? ' selected' : ''}`}
      data-id={room.id}
      data-status={room.status}
      onClick={onSelect}
    >
      <div className="theatre-card-inner">
        <div className="theatre-card-body">
          <div className="theatre-card-main">
            <div className="theatre-card-header">
              <div className="theatre-card-meta-line">
                <span className="theatre-id">{room.id}</span>
                <span className="theatre-card-meta-sep">|</span>
                <span className="theatre-stage">{stage.name}</span>
              </div>
              {room.alert ? (
                <div className="theatre-card-alert-below" title={room.alert}>
                  ⚠ {room.alert}
                </div>
              ) : (
                <div className="theatre-card-alert-below is-empty" aria-hidden="true">
                  &nbsp;
                </div>
              )}
              <p className="theatre-patient-line">
                <span className="theatre-patient-label">Patient Name:-</span>
                <span className="theatre-patient-value">{name}</span>
              </p>
            </div>
            <p className="theatre-proc">{room.procedure}</p>
            <span className="theatre-asa-below">{asa ?? '—'}</span>
          </div>
          <div className="theatre-card-right">
            <ProgressPie pct={completionPct} label="Completed" />
          </div>
        </div>
        <div className="theatre-strip-vitals">
          {room.vitals.map(v => {
            const vc = scheduleClassify(v.key, typeof v.v === 'number' ? v.v : undefined);
            return (
              <div className="strip-vital" key={v.l}>
                <div className="strip-vital-label">{v.l}</div>
                <div className={`strip-vital-value ${vc}`}>{v.v}</div>
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}
