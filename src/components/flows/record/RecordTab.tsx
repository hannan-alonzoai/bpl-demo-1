import { useEffect, useState } from 'react';
import { STAFFING } from '../../../data/flows';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { FluidsGanttChart } from '../shared/FluidsGanttChart';
import { MedicationsGanttChart } from '../shared/MedicationsGanttChart';
import { Flowsheet } from './Flowsheet';

type RecordSub = 'flowsheet' | 'fluids_medications' | 'staffing';

interface Props {
  currentStageIdx: number;
  viewStageIdx: number;
  onViewStageChange: (idx: number) => void;
  onRequestStageAdvance: (targetIdx: number) => void;
}

const MOBILE_SUBS: { id: RecordSub; label: string; mobileLabel: string }[] = [
  { id: 'flowsheet', label: 'Flowsheet', mobileLabel: 'Flowsheet' },
  { id: 'fluids_medications', label: 'Fluids & Medications', mobileLabel: 'Fluids & Meds' },
  { id: 'staffing', label: 'Staffing', mobileLabel: 'Staffing' },
];

const DESKTOP_SUBS: { id: RecordSub; label: string; mobileLabel: string }[] = [
  { id: 'flowsheet', label: 'Flowsheet', mobileLabel: 'Flowsheet' },
  { id: 'staffing', label: 'Staffing', mobileLabel: 'Staffing' },
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
  const subs = isMobile ? MOBILE_SUBS : DESKTOP_SUBS;
  const [recordSub, setRecordSub] = useState<RecordSub>('flowsheet');

  useEffect(() => {
    if (!isMobile && recordSub === 'fluids_medications') {
      setRecordSub('flowsheet');
    }
  }, [isMobile, recordSub]);

  const flowsheetBlock = (
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
  );

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
            <span className="record-subtab-label">{s.label}</span>
            <span className="record-subtab-label-mobile">{s.mobileLabel}</span>
          </button>
        ))}
      </div>

      <div className={`record-subpanel${recordSub === 'flowsheet' ? ' active' : ''}`} hidden={recordSub !== 'flowsheet'}>
        {isMobile ? (
          flowsheetBlock
        ) : (
          <div className="record-flowsheet-stack">
            {flowsheetBlock}
            <div className="record-fluids-meds-row">
              <FluidsCard />
              <MedicationsCard />
            </div>
          </div>
        )}
      </div>

      {isMobile ? (
        <div
          className={`record-subpanel record-subpanel-charts${recordSub === 'fluids_medications' ? ' active' : ''}`}
          hidden={recordSub !== 'fluids_medications'}
        >
          <FluidsCard />
          <MedicationsCard />
        </div>
      ) : null}

      <div className={`record-subpanel${recordSub === 'staffing' ? ' active' : ''}`} hidden={recordSub !== 'staffing'}>
        <div className="record-card record-card-staff">
          <div className="record-card-header">
            <h3>Staffing</h3>
          </div>
          <div className="record-card-body">
            <div className="staff-mobile-list">
              {STAFFING.map(s => (
                <div className="staff-mobile-row" key={s.name}>
                  <span className="staff-mobile-name">{s.name}</span>
                  <span className="staff-mobile-time">{s.time.split('→')[0].trim()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
