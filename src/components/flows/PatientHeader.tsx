import { useState, type ReactNode } from 'react';
import { OR_STAGES } from '../../data/flows';
import type { PatientProfile } from '../../types';

interface Props {
  patient: PatientProfile;
  currentStageIdx: number;
}

const DETAIL_PANEL_ID = 'patient-mobile-detail';

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AllergyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5z" />
    </svg>
  );
}

function ValidateBtn({ compact, short }: { compact?: boolean; short?: boolean }) {
  return (
    <button type="button" className={compact ? 'btn-validate btn-validate-compact' : 'btn-validate'}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 8l4 4 6-7" />
      </svg>
      {short ? 'Validate' : 'Validate Parameter'}
    </button>
  );
}

function ageFromDob(dob: string): number | null {
  const parts = dob.split(/[/-]/).map(Number);
  if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return null;
  const [dd, mm, yyyy] = parts;
  const birth = new Date(yyyy, mm - 1, dd);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

function MobileDetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="patient-mobile-row">
      <span className="patient-mobile-row-label">{label}</span>
      <span className="patient-mobile-row-value">{children}</span>
    </div>
  );
}

export function PatientHeader({ patient, currentStageIdx }: Props) {
  const [desktopExpanded, setDesktopExpanded] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const procShort = patient.procedure.split('(')[0].trim();
  const age = ageFromDob(patient.dob);
  const hasAllergy = patient.allergies && patient.allergies !== 'None known';
  const stageName = OR_STAGES[currentStageIdx]?.name ?? OR_STAGES[0].name;
  const stageCount = `${currentStageIdx + 1}/${OR_STAGES.length}`;

  return (
    <div className={`patient-header-panel${mobileExpanded ? ' mobile-expanded' : ''}`}>
      {/* Desktop */}
      <div className={`patient-header-desktop${desktopExpanded ? '' : ' collapsed'}`}>
        <div
          className="patient-header-compact"
          onClick={e => {
            if ((e.target as HTMLElement).closest('.btn-validate') || (e.target as HTMLElement).closest('.patient-expand-toggle')) return;
            setDesktopExpanded(v => !v);
          }}
          onKeyDown={() => {}}
          role="presentation"
        >
          <button
            type="button"
            className="patient-expand-toggle"
            aria-expanded={desktopExpanded}
            onClick={() => setDesktopExpanded(v => !v)}
          >
            <span className="chevron">▶</span>
            <span className="toggle-label">{desktopExpanded ? 'Hide' : 'Details'}</span>
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
              <span className="compact-key">Stage</span>
              <span className="compact-val highlight">
                {stageName} <span className="compact-val-count">{stageCount}</span>
              </span>
            </span>
            <span className="compact-kv">
              <span className="compact-key">Allergies</span>
              <span className="compact-val allergy">
                <AllergyIcon />
                {patient.allergies}
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
        </div>
      </div>

      {/* Mobile */}
      <div className="patient-header-mobile">
        <div className="patient-mobile-card">
          <button
            type="button"
            className="patient-mobile-identity"
            aria-expanded={mobileExpanded}
            aria-controls={DETAIL_PANEL_ID}
            onClick={() => setMobileExpanded(v => !v)}
          >
            <span className="patient-mobile-name-row">
              <span className="patient-mobile-name">{patient.name}</span>
            </span>
            <span className="patient-mobile-meta">
              <span className="patient-mobile-proc">{procShort}</span>
              <span className="patient-mobile-meta-sep" aria-hidden>·</span>
              <span className="patient-mobile-stage">{stageName}</span>
              <span className="patient-mobile-stage-count">{stageCount}</span>
            </span>
          </button>
          {hasAllergy ? (
            <span className="patient-mobile-allergy">
              <AllergyIcon />
              {patient.allergies}
            </span>
          ) : null}
          <button
            type="button"
            className={`patient-mobile-toggle${mobileExpanded ? ' open' : ''}`}
            aria-expanded={mobileExpanded}
            aria-controls={DETAIL_PANEL_ID}
            aria-label={mobileExpanded ? 'Hide patient details' : 'Show patient details'}
            onClick={() => setMobileExpanded(v => !v)}
          >
            <ChevronDownIcon />
          </button>
        </div>

        <div className="patient-mobile-quick">
          <ValidateBtn compact short />
        </div>

        <div
          className={`patient-mobile-detail-wrap${mobileExpanded ? ' open' : ''}`}
          id={DETAIL_PANEL_ID}
          aria-hidden={!mobileExpanded}
        >
          <div className="patient-mobile-detail-inner">
            <div className="patient-mobile-detail scroll-y">
              <MobileDetailRow label="UHID / CRN">{patient.crn}</MobileDetailRow>
              <MobileDetailRow label="DOB / Age">
                {patient.dob}
                {age != null ? ` (${age} years)` : ''}
              </MobileDetailRow>
              <MobileDetailRow label="Gender">
                <span className="text-blue">{patient.gender}</span>
              </MobileDetailRow>
              <MobileDetailRow label="ASA Status">
                <span className="pill pill-asa">{patient.asa}</span>
              </MobileDetailRow>
              <MobileDetailRow label="Admit Date & Time">
                {patient.admitDate} ({patient.admitTime})
              </MobileDetailRow>
              <MobileDetailRow label="Care Unit & Bed">
                <span className="pill pill-blue">{patient.careUnit}</span>
                <span className="pill pill-blue">{patient.bed}</span>
              </MobileDetailRow>
              <MobileDetailRow label="Consulting">{patient.consulting}</MobileDetailRow>
              <MobileDetailRow label="Case Type">{patient.caseType}</MobileDetailRow>
              <MobileDetailRow label="Allergies">
                {hasAllergy ? <span className="allergy-warn"><AllergyIcon /> {patient.allergies}</span> : patient.allergies}
              </MobileDetailRow>
              <MobileDetailRow label="Diagnosis">
                <span className="text-blue">{patient.diagnosis}</span>
              </MobileDetailRow>
              <MobileDetailRow label="Comorbidities">{patient.comorbidities}</MobileDetailRow>
              <MobileDetailRow label="Other">{patient.other}</MobileDetailRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
