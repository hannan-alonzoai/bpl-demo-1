import { FLUIDS_INTAKE, FLUIDS_OUTPUT, FLUIDS_TIMES } from '../../../data/flows';
import type { PatientProfile } from '../../../types';
import { FluidsGrid } from '../shared/FluidsGrid';

interface Props {
  patient: PatientProfile;
  onBack: () => void;
}

export function FluidsOverlay({ patient, onBack }: Props) {
  return (
    <div className="form-view active">
      <header className="topbar">
        <div className="topbar-brand">
          <img src="/assets/bpl-cortex-ot-logo.png" alt="BPL Cortex OT" className="topbar-logo" />
        </div>
        <div className="topbar-user"><div className="avatar">JJ</div> Dr Jacob Jenner</div>
      </header>
      <div className="form-toolbar">
        <div className="chart-toolbar-left">
          <button type="button" className="btn-back-toolbar" onClick={onBack}>← Back to Record</button>
          <span className="chart-toolbar-title">Fluids</span>
        </div>
        <span className="record-card-meta">{patient.name} · {patient.crn} · {patient.bed}</span>
      </div>
      <div className="fluids-full-body">
        <FluidsGrid times={FLUIDS_TIMES} allTimes={FLUIDS_TIMES} intake={FLUIDS_INTAKE} output={FLUIDS_OUTPUT} />
      </div>
      <footer className="form-footer">
        <button type="button" className="btn btn-back" onClick={onBack}>Go Back</button>
      </footer>
    </div>
  );
}
