import { useEffect, useState } from 'react';
import { STAFFING } from '../../../data/flows';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { FluidsGanttChart } from '../shared/FluidsGanttChart';
import { MedicationsGanttChart } from '../shared/MedicationsGanttChart';
import { Flowsheet } from './Flowsheet';

type RecordSubMobile = 'flowsheet' | 'fluids' | 'medications' | 'staffing';
type RecordSubDesktop = 'flowsheet' | 'fluidsMeds' | 'staffing';
type RecordSub = RecordSubMobile | RecordSubDesktop;

interface Props {
  currentStageIdx: number;
  viewStageIdx: number;
  onViewStageChange: (idx: number) => void;
  onRequestStageAdvance: (targetIdx: number) => void;
}

const MOBILE_SUBS: { id: RecordSubMobile; label: string }[] = [
  { id: 'flowsheet', label: 'Flowsheet' },
  { id: 'fluids', label: 'Fluids' },
  { id: 'medications', label: 'Medications' },
  { id: 'staffing', label: 'Staffing' },
];

const DESKTOP_SUBS: { id: RecordSubDesktop; label: string }[] = [
  { id: 'flowsheet', label: 'Flowsheet' },
  { id: 'fluidsMeds', label: 'Fluids & Medications' },
  { id: 'staffing', label: 'Staffing' },
];

function FluidsGanttCard() {
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

function MedicationsGanttCard() {
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
    if (!isMobile && (recordSub === 'fluids' || recordSub === 'medications')) {
      setRecordSub('fluidsMeds');
    } else if (isMobile && recordSub === 'fluidsMeds') {
      setRecordSub('fluids');
    }
  }, [isMobile, recordSub]);

  const isActive = (id: RecordSub) => recordSub === id;

  return (
    <div className="record-view record-view-shell">
      <div className="record-subtabs" role="tablist" aria-label="Record sections">
        {subs.map(s => (
          <button
            key={s.id}
            type="button"
            role="tab"
            className={`record-subtab${isActive(s.id) ? ' active' : ''}`}
            aria-selected={isActive(s.id)}
            onClick={() => setRecordSub(s.id)}
          >
            <span className="record-subtab-label">{s.label}</span>
          </button>
        ))}
      </div>

      <div className={`record-subpanel${isActive('flowsheet') ? ' active' : ''}`} hidden={!isActive('flowsheet')}>
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

      {!isMobile ? (
        <div
          className={`record-subpanel record-fluids-meds-panel${isActive('fluidsMeds') ? ' active' : ''}`}
          hidden={!isActive('fluidsMeds')}
        >
          <div className="record-fluids-meds-grid">
            <FluidsGanttCard />
            <MedicationsGanttCard />
          </div>
        </div>
      ) : (
        <>
          <div className={`record-subpanel${isActive('fluids') ? ' active' : ''}`} hidden={!isActive('fluids')}>
            <FluidsGanttCard />
          </div>
          <div
            className={`record-subpanel${isActive('medications') ? ' active' : ''}`}
            hidden={!isActive('medications')}
          >
            <MedicationsGanttCard />
          </div>
        </>
      )}

      <div className={`record-subpanel${isActive('staffing') ? ' active' : ''}`} hidden={!isActive('staffing')}>
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
