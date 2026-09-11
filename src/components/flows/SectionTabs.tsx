import type { FlowTab, PatientProfile } from '../../types';

interface Props {
  active: FlowTab;
  onChange: (tab: FlowTab) => void;
  patient: PatientProfile;
}

const TABS: { id: FlowTab; label: string; count?: string }[] = [
  { id: 'record', label: 'Record', count: '(1)' },
  { id: 'score', label: 'Score' },
  { id: 'form', label: 'Form', count: '(3)' },
  { id: 'report', label: 'Report' },
];

export function SectionTabs({ active, onChange, patient }: Props) {
  const initials = patient.name.split(' ').map(n => n[0]).join('. ').slice(0, 5);

  return (
    <div className="tabs-zone">
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
          {initials} · {patient.bed} · {patient.asa}
        </div>
      </div>
    </div>
  );
}
