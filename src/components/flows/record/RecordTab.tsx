import {
  FLUIDS_INTAKE, FLUIDS_OUTPUT, FLUIDS_PREVIEW_COLS, FLUIDS_TIMES,
  MEDICATIONS_PREVIEW_COLS, MEDICATIONS_SECTIONS, MEDICATIONS_TIMES, STAFFING,
} from '../../../data/flows';
import { FluidsGrid, MedicationsGrid } from '../shared/FluidsGrid';
import { Flowsheet } from './Flowsheet';

interface Props {
  onOpenFluids: () => void;
  onOpenMedications: () => void;
}

export function RecordTab({ onOpenFluids, onOpenMedications }: Props) {
  const fluidTimes = FLUIDS_TIMES.slice(-FLUIDS_PREVIEW_COLS);
  const medTimes = MEDICATIONS_TIMES.slice(-MEDICATIONS_PREVIEW_COLS);

  return (
    <div className="record-view">
      <div className="record-card">
        <div className="record-card-header">
          <h3>Flowsheet</h3>
          <span className="record-card-meta">select stage · live from HL7</span>
        </div>
        <div className="record-card-body">
          <Flowsheet />
        </div>
      </div>

      <div className="record-grid-2">
        <div className="record-card clickable" title="Click to open full fluids chart" onClick={onOpenFluids} onKeyDown={() => {}} role="button" tabIndex={0}>
          <div className="record-card-header">
            <h3>Fluids</h3>
            <span className="record-card-meta view-all-link">View all →</span>
          </div>
          <div className="record-card-body">
            <FluidsGrid times={fluidTimes} allTimes={FLUIDS_TIMES} intake={FLUIDS_INTAKE} output={FLUIDS_OUTPUT} />
          </div>
        </div>
        <div className="record-card clickable" title="Click to open full medications chart" onClick={onOpenMedications} onKeyDown={() => {}} role="button" tabIndex={0}>
          <div className="record-card-header">
            <h3>Medications</h3>
            <span className="record-card-meta view-all-link">View all →</span>
          </div>
          <div className="record-card-body">
            <MedicationsGrid times={medTimes} allTimes={MEDICATIONS_TIMES} sections={MEDICATIONS_SECTIONS} />
          </div>
        </div>
      </div>

      <div className="record-card">
        <div className="record-card-header">
          <h3>Staffing</h3>
          <span className="record-card-meta">set pre-op · editable inline <span className="badge-count">2</span></span>
        </div>
        <div className="record-card-body">
          <div className="record-list">
            {STAFFING.map(s => (
              <div className="record-row" key={s.name}>
                <span>{s.name}</span>
                <span className="val">{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
