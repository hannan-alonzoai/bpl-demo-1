import { useState } from 'react';
import { OR_STAGES } from '../../data/flows';
import type { PatientProfile } from '../../types';

interface Props {
  patient: PatientProfile;
  currentStageIdx: number;
}

function AllergyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5z" />
    </svg>
  );
}

function ValidateBtn({ compact }: { compact?: boolean }) {
  return (
    <button type="button" className={compact ? 'btn-validate btn-validate-compact' : 'btn-validate'}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 8l4 4 6-7" />
      </svg>
      Validate Parameter
    </button>
  );
}

export function PatientHeader({ patient, currentStageIdx }: Props) {
  const [expanded, setExpanded] = useState(false);
  const procShort = patient.procedure.split('(')[0].trim();
  const stage = OR_STAGES[currentStageIdx];
  const stageNum = currentStageIdx + 1;

  return (
    <div className={`patient-header-panel${expanded ? '' : ' collapsed'}`}>
      <div
        className="patient-header-compact"
        onClick={e => {
          if ((e.target as HTMLElement).closest('.btn-validate') || (e.target as HTMLElement).closest('.patient-expand-toggle')) return;
          setExpanded(v => !v);
        }}
        onKeyDown={() => {}}
        role="presentation"
      >
        <button
          type="button"
          className="patient-expand-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded(v => !v)}
        >
          <span className="chevron">▶</span>
          <span className="toggle-label">{expanded ? 'Hide' : 'Details'}</span>
        </button>
        <div className="patient-compact-summary">
          <span className="compact-kv">
            <span className="compact-key">Name</span>
            <span className="compact-val">{patient.name}</span>
          </span>
          <span className="compact-kv">
            <span className="compact-key">Procedure</span>
            <span className="compact-val highlight">{procShort}</span>
          </span>
          <span className="compact-kv">
            <span className="compact-key">Allergies</span>
            <span className="compact-val allergy">
              <AllergyIcon />
              {patient.allergies}
            </span>
          </span>
          <span className="compact-kv">
            <span className="compact-key">Stage</span>
            <span className="compact-val highlight">{stage?.name ?? '—'}</span>
            <span className="compact-val compact-stage-progress">
              {stageNum} / {OR_STAGES.length}
            </span>
          </span>
        </div>
        <ValidateBtn compact />
      </div>

      <div className="patient-header-expanded">
        <div className="patient-zone">
          <div className="patient-meta-cards">
            <div className="meta-card">
              <div className="meta-item">
                <span className="meta-label">Patient Name</span>
                <span className="meta-value strong">{patient.name}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">UHID / CRN</span>
                <span className="pill pill-gray">{patient.crn}</span>
              </div>
              <div className="meta-item">
                <span className="meta-inline">DOB: <strong>{patient.dob}</strong></span>
                <span className="meta-inline" style={{ marginTop: 2 }}>Gender: <strong>{patient.gender}</strong></span>
              </div>
            </div>
            <div className="meta-card">
              <div className="meta-item">
                <span className="meta-label">Admit Date &amp; Time</span>
                <span className="meta-value">{patient.admitDate} <span style={{ color: 'var(--gray-500)', fontWeight: 400 }}>({patient.admitTime})</span></span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Care Unit &amp; Bed</span>
                <div className="meta-row">
                  <span className="meta-value">{patient.careUnit}</span>
                  <span className="pill pill-blue">{patient.bed}</span>
                </div>
              </div>
              <div className="meta-item">
                <span className="meta-label">Consulting</span>
                <span className="meta-value">{patient.consulting}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Case Type</span>
                <span className="meta-value">{patient.caseType}</span>
              </div>
            </div>
            <div className="meta-card">
              <div className="meta-item">
                <span className="meta-label">ASA</span>
                <span className="pill pill-asa">{patient.asa}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Allergies</span>
                <span className="allergy-warn"><AllergyIcon /> {patient.allergies}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Diagnosis</span>
                <span className="meta-value">{patient.diagnosis}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Procedures</span>
                <span className="meta-value highlight">{patient.procedure}</span>
              </div>
            </div>
            <div className="meta-card">
              <div className="meta-item">
                <span className="meta-label">Comorbidities</span>
                <span className="meta-value">{patient.comorbidities}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Other</span>
                <span className="meta-value">{patient.other}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="actions-zone">
          <div className="action-bar">
            <span className="action-bar-label">Actions</span>
            <div className="action-group">
              <button type="button" className="action-chip">More Info</button>
              <button type="button" className="action-chip">OR Events</button>
              <button type="button" className="action-chip">Quick Note</button>
              <button type="button" className="action-chip">Print PDF</button>
              <button type="button" className="action-chip">Interval</button>
            </div>
            <div className="action-divider" />
            <ValidateBtn />
          </div>
        </div>
      </div>
    </div>
  );
}
