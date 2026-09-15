import { useState } from 'react';
import {
  FLUIDS_INTAKE,
  FLUIDS_OUTPUT,
  FLUIDS_PREVIEW_COLS,
  FLUIDS_TIMES,
  MEDICATIONS_PREVIEW_COLS,
  MEDICATIONS_SECTIONS,
  MEDICATIONS_TIMES,
} from '../../../data/flows';
import { FlowTimeline } from '../shared/FlowTimeline';
import { FluidsGrid, MedicationsGrid } from '../shared/FluidsGrid';
import { Flowsheet } from './Flowsheet';

type RecordSub = 'flowsheet' | 'fluids' | 'medications';
type FluidsViewMode = 'table' | 'timeline';

interface Props {
  currentStageIdx: number;
  viewStageIdx: number;
  onViewStageChange: (idx: number) => void;
  onRequestStageAdvance: (targetIdx: number) => void;
}

function FluidsViewToggle({ mode, onChange }: { mode: FluidsViewMode; onChange: (m: FluidsViewMode) => void }) {
  return (
    <div className="fluids-view-toggle" role="tablist" aria-label="Fluids view">
      <button
        type="button"
        role="tab"
        className={`fluids-view-tab${mode === 'table' ? ' active' : ''}`}
        aria-selected={mode === 'table'}
        onClick={() => onChange('table')}
      >
        Table
      </button>
      <button
        type="button"
        role="tab"
        className={`fluids-view-tab${mode === 'timeline' ? ' active' : ''}`}
        aria-selected={mode === 'timeline'}
        onClick={() => onChange('timeline')}
      >
        Timeline
      </button>
    </div>
  );
}

export function RecordTab({
  currentStageIdx,
  viewStageIdx,
  onViewStageChange,
  onRequestStageAdvance,
}: Props) {
  const [recordSub, setRecordSub] = useState<RecordSub>('flowsheet');
  const [fluidsView, setFluidsView] = useState<FluidsViewMode>('table');
  const [medsView, setMedsView] = useState<FluidsViewMode>('table');

  const fluidPreviewTimes = FLUIDS_TIMES.slice(-FLUIDS_PREVIEW_COLS);
  const medPreviewTimes = MEDICATIONS_TIMES.slice(-MEDICATIONS_PREVIEW_COLS);

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
        <div className="record-card" title="Fluids intake / output">
          <div className="record-card-header fluids-card-header">
            <h3>Fluids</h3>
            <div className="fluids-header-right">
              <FluidsViewToggle mode={fluidsView} onChange={setFluidsView} />
            </div>
          </div>
          <div className="record-card-body">
            {fluidsView === 'table' ? (
              <FluidsGrid
                times={fluidPreviewTimes}
                allTimes={FLUIDS_TIMES}
                intake={FLUIDS_INTAKE}
                output={FLUIDS_OUTPUT}
              />
            ) : (
              <FlowTimeline
                scrollId="fluids-timeline-scroll"
                times={FLUIDS_TIMES}
                groups={[
                  { label: 'Intake', rows: FLUIDS_INTAKE },
                  { label: 'Output', rows: FLUIDS_OUTPUT },
                ]}
                ariaLabel="Fluids Gantt timeline, scroll horizontally"
              />
            )}
          </div>
        </div>
      </div>

      <div className={`record-subpanel${recordSub === 'medications' ? ' active' : ''}`} hidden={recordSub !== 'medications'}>
        <div className="record-card" title="Medications infusion timeline">
          <div className="record-card-header fluids-card-header">
            <h3>Medications</h3>
            <div className="fluids-header-right">
              <FluidsViewToggle mode={medsView} onChange={setMedsView} />
            </div>
          </div>
          <div className="record-card-body">
            {medsView === 'table' ? (
              <MedicationsGrid times={medPreviewTimes} allTimes={MEDICATIONS_TIMES} sections={MEDICATIONS_SECTIONS} />
            ) : (
              <FlowTimeline
                scrollId="meds-timeline-scroll"
                times={MEDICATIONS_TIMES}
                groups={MEDICATIONS_SECTIONS.map(sec => ({ label: sec.title, rows: sec.rows }))}
                ariaLabel="Medications Gantt timeline, scroll horizontally"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
