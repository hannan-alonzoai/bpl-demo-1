import { useState } from 'react';
import { FluidsGanttChart } from '../shared/FluidsGanttChart';
import { MedicationsGanttChart } from '../shared/MedicationsGanttChart';
import { Flowsheet } from './Flowsheet';

type RecordSub = 'flowsheet' | 'fluids' | 'medications';

interface Props {
  currentStageIdx: number;
  viewStageIdx: number;
  onViewStageChange: (idx: number) => void;
  onRequestStageAdvance: (targetIdx: number) => void;
}

export function RecordTab({
  currentStageIdx,
  viewStageIdx,
  onViewStageChange,
  onRequestStageAdvance,
}: Props) {
  const [recordSub, setRecordSub] = useState<RecordSub>('flowsheet');

  const subs: { id: RecordSub; label: string }[] = [
    { id: 'flowsheet', label: 'Flowsheet' },
    { id: 'fluids', label: 'Fluids' },
    { id: 'medications', label: 'Medications' },
  ];

  return (
    <div className="record-view record-view-shell">
      <div className="record-subtabs" role="tablist" aria-label="Record sections">
        {subs.map(s => (
          <button
            key={s.id}
            type="button"
            role="tab"
            className={`record-subtab${recordSub === s.id ? ' active' : ''}`}
            aria-selected={recordSub === s.id}
            onClick={() => setRecordSub(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={`record-subpanel${recordSub === 'flowsheet' ? ' active' : ''}`} hidden={recordSub !== 'flowsheet'}>
        <div className="record-card flowsheet-record-card">
          <div className="record-card-body flowsheet-panel">
            <Flowsheet
              currentStageIdx={currentStageIdx}
              viewStageIdx={viewStageIdx}
              onViewStageChange={onViewStageChange}
              onRequestAdvance={onRequestStageAdvance}
            />
          </div>
        </div>
      </div>

      <div className={`record-subpanel${recordSub === 'fluids' ? ' active' : ''}`} hidden={recordSub !== 'fluids'}>
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
      </div>

      <div className={`record-subpanel${recordSub === 'medications' ? ' active' : ''}`} hidden={recordSub !== 'medications'}>
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
      </div>
    </div>
  );
}
