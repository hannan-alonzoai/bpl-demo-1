import { useState } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { FluidsGanttChart } from '../shared/FluidsGanttChart';
import { MedicationsGanttChart } from '../shared/MedicationsGanttChart';
import { Flowsheet } from './Flowsheet';

type RecordSub = 'flowsheet' | 'fluids_medications';

interface Props {
  currentStageIdx: number;
  viewStageIdx: number;
  onViewStageChange: (idx: number) => void;
  onRequestStageAdvance: (targetIdx: number) => void;
}

const MOBILE_SUBS: { id: RecordSub; label: string; mobileLabel: string }[] = [
  { id: 'flowsheet', label: 'Flowsheet', mobileLabel: 'Flowsheet' },
  { id: 'fluids_medications', label: 'Fluids & Medications', mobileLabel: 'Fluids & Meds' },
];

function FluidsCard() {
  return (
    <div className="record-card record-card-gantt" title="Fluids intake / output">
      <div className="record-card-header">
        <h3>Fluids</h3>
        <button type="button" className="gantt-add-btn" disabled title="Demo only">
          + Add Entry
        </button>
      </div>
      <div className="record-card-body">
        <FluidsGanttChart />
      </div>
    </div>
  );
}

function MedicationsCard() {
  return (
    <div className="record-card record-card-gantt" title="Medications timeline">
      <div className="record-card-header">
        <h3>Medications</h3>
        <button type="button" className="gantt-add-btn" disabled title="Demo only">
          + Add Medication
        </button>
      </div>
      <div className="record-card-body">
        <MedicationsGanttChart />
      </div>
    </div>
  );
}

export function RecordTab({
  currentStageIdx,
  viewStageIdx,
  onViewStageChange,
  onRequestStageAdvance,
}: Props) {
  const isMobile = useIsMobile();
  const [recordSub, setRecordSub] = useState<RecordSub>('flowsheet');

  const flowsheet = (
    <Flowsheet
      currentStageIdx={currentStageIdx}
      viewStageIdx={viewStageIdx}
      onViewStageChange={onViewStageChange}
      onRequestAdvance={onRequestStageAdvance}
    />
  );

  /* Desktop: no mini tabs — Flowsheet is a titled container like Fluids / Medications */
  if (!isMobile) {
    return (
      <div className="record-view record-view-shell">
        <div className="record-flowsheet-stack">
          <div className="record-card flowsheet-record-card">
            <div className="record-card-header">
              <h3>Flowsheet</h3>
            </div>
            <div className="record-card-body flowsheet-panel">{flowsheet}</div>
          </div>
          <div className="record-fluids-meds-row">
            <FluidsCard />
            <MedicationsCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="record-view record-view-shell">
      <div className="record-subtabs" role="tablist" aria-label="Record sections">
        {MOBILE_SUBS.map(s => (
          <button
            key={s.id}
            type="button"
            role="tab"
            className={`record-subtab${recordSub === s.id ? ' active' : ''}`}
            aria-selected={recordSub === s.id}
            onClick={() => setRecordSub(s.id)}
          >
            <span className="record-subtab-label">{s.label}</span>
            <span className="record-subtab-label-mobile">{s.mobileLabel}</span>
          </button>
        ))}
      </div>

      <div className={`record-subpanel${recordSub === 'flowsheet' ? ' active' : ''}`} hidden={recordSub !== 'flowsheet'}>
        <div className="record-card flowsheet-record-card">
          <div className="record-card-body flowsheet-panel">{flowsheet}</div>
        </div>
      </div>

      <div
        className={`record-subpanel record-subpanel-charts${recordSub === 'fluids_medications' ? ' active' : ''}`}
        hidden={recordSub !== 'fluids_medications'}
      >
        <FluidsCard />
        <MedicationsCard />
      </div>
    </div>
  );
}
