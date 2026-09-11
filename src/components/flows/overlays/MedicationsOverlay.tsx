import { MEDICATIONS_SECTIONS, MEDICATIONS_TIMES } from '../../../data/flows';
import type { PatientProfile } from '../../../types';
import { MedicationsGrid } from '../shared/FluidsGrid';

interface Props {
  patient: PatientProfile;
  onBack: () => void;
}

export function MedicationsOverlay({ patient, onBack }: Props) {
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
          <span className="chart-toolbar-title">Medications</span>
        </div>
        <span className="record-card-meta">{patient.name} · {patient.crn} · {patient.bed}</span>
      </div>
      <div className="fluids-full-body">
        <MedicationsGrid times={MEDICATIONS_TIMES} allTimes={MEDICATIONS_TIMES} sections={MEDICATIONS_SECTIONS} />
      </div>
      <footer className="form-footer">
        <button type="button" className="btn btn-back" onClick={onBack}>Go Back</button>
      </footer>
    </div>
  );
}
