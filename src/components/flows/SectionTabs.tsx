import type { FlowTab, PatientProfile } from '../../types';

interface Props {
  active: FlowTab;
  onChange: (tab: FlowTab) => void;
  patient: PatientProfile;
  className?: string;
}

const TABS: { id: FlowTab; label: string; count?: string }[] = [
  { id: 'record', label: 'Record' },
  { id: 'score', label: 'Score' },
  { id: 'form', label: 'Form', count: '(3)' },
  { id: 'report', label: 'Report' },
  { id: 'staff', label: 'Staff' },
];

export function SectionTabs({ active, onChange, patient, className }: Props) {
  const initials = `${patient.name.split(' ').map(n => n[0]).join('. ')}.`;

  return (
    <div className={`tabs-zone${className ? ` ${className}` : ''}`}>
      <div className="section-tabs">
        <div className="section-tabs-left">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`section-tab${active === tab.id ? ' active' : ''}`}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
              {tab.count ? <span className="tab-count">{tab.count}</span> : null}
            </button>
          ))}
        </div>
        <div className="patient-badge">
          <span className="status-dot" />
          {initials} · {patient.roomId} · {patient.asa}
        </div>
      </div>
    </div>
  );
}
