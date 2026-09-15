import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { FormFillOverlay } from '../components/flows/overlays/FormFillOverlay';
import { FluidsOverlay } from '../components/flows/overlays/FluidsOverlay';
import { MedicationsOverlay } from '../components/flows/overlays/MedicationsOverlay';
import { PatientHeader } from '../components/flows/PatientHeader';
import { FormTab } from '../components/flows/form/FormTab';
import { RecordTab } from '../components/flows/record/RecordTab';
import { StaffTab } from '../components/flows/record/StaffTab';
import { ReportTab } from '../components/flows/report/ReportTab';
import { ScoreTab } from '../components/flows/score/ScoreTab';
import { SectionTabs } from '../components/flows/SectionTabs';
import { Topbar } from '../components/flows/Topbar';
import { StageProceedDialog } from '../components/flows/shared/StageProceedDialog';
import { getDefaultStageIndex, OR_STAGES } from '../data/flows';
import { getPatient } from '../data/patients';
import { getRoom } from '../data/rooms';
import type { FlowTab, OverlayView } from '../types';
import '../styles/flows.css';

export function PatientFlowsPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [tab, setTab] = useState<FlowTab>('record');
  const [overlay, setOverlay] = useState<OverlayView>(null);
  const [formId, setFormId] = useState('pre-anesthesia');
  const [formMode, setFormMode] = useState<'create' | 'view'>('create');
  const [formRecordId, setFormRecordId] = useState<number | null>(null);

  const defaultStage = roomId ? getDefaultStageIndex(roomId) : 0;
  const [currentStageIdx, setCurrentStageIdx] = useState(defaultStage);
  const [viewStageIdx, setViewStageIdx] = useState(defaultStage);
  const [pendingAdvanceIdx, setPendingAdvanceIdx] = useState<number | null>(null);

  useEffect(() => {
    document.body.classList.add('dashboard-mode');
    return () => document.body.classList.remove('dashboard-mode');
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const idx = getDefaultStageIndex(roomId);
    setCurrentStageIdx(idx);
    setViewStageIdx(idx);
  }, [roomId]);

  if (!roomId || !getRoom(roomId)) {
    return <Navigate to="/board" replace />;
  }

  const patient = getPatient(roomId);

  function confirmStageAdvance() {
    if (pendingAdvanceIdx == null) return;
    setCurrentStageIdx(pendingAdvanceIdx);
    setViewStageIdx(pendingAdvanceIdx);
    setPendingAdvanceIdx(null);
  }

  if (overlay === 'fluids') {
    return <FluidsOverlay patient={patient} onBack={() => setOverlay(null)} />;
  }
  if (overlay === 'medications') {
    return <MedicationsOverlay patient={patient} onBack={() => setOverlay(null)} />;
  }
  if (overlay === 'form') {
    return (
      <FormFillOverlay
        formId={formId}
        mode={formMode}
        recordId={formRecordId}
        onBack={() => setOverlay(null)}
      />
    );
  }

  return (
    <div className="dashboard-view">
      <Topbar />
      <PatientHeader patient={patient} currentStageIdx={currentStageIdx} />
      <SectionTabs active={tab} onChange={setTab} patient={patient} />

      <div className={`tab-content${tab === 'record' ? ' active' : ''}`}>
        {tab === 'record' && (
          <RecordTab
            currentStageIdx={currentStageIdx}
            viewStageIdx={viewStageIdx}
            onViewStageChange={setViewStageIdx}
            onRequestStageAdvance={setPendingAdvanceIdx}
          />
        )}
      </div>
      <div className={`tab-content${tab === 'score' ? ' active' : ''}`}>
        {tab === 'score' && <ScoreTab />}
      </div>
      <div id="tabForm" className={`tab-content${tab === 'form' ? ' active' : ''}`}>
        {tab === 'form' && (
          <FormTab
            onNewEntry={id => {
              setFormId(id);
              setFormMode('create');
              setFormRecordId(null);
              setOverlay('form');
            }}
            onViewEntry={(id, recordId) => {
              setFormId(id);
              setFormMode('view');
              setFormRecordId(recordId);
              setOverlay('form');
            }}
          />
        )}
      </div>
      <div id="tabReport" className={`tab-content${tab === 'report' ? ' active' : ''}`}>
        {tab === 'report' && <ReportTab patient={patient} />}
      </div>
      <div className={`tab-content${tab === 'staff' ? ' active' : ''}`}>
        {tab === 'staff' && <StaffTab />}
      </div>

      {pendingAdvanceIdx != null && (
        <StageProceedDialog
          stages={OR_STAGES}
          targetStageIndex={pendingAdvanceIdx}
          onConfirm={confirmStageAdvance}
          onCancel={() => setPendingAdvanceIdx(null)}
        />
      )}
    </div>
  );
}
