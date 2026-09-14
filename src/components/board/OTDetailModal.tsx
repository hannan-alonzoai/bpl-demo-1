import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Room, ViewMode } from '../../types';
import { classify } from '../../utils/classify';
import { VitalGroup } from './VitalViews';

interface Props {
  room: Room;
  view: ViewMode;
  open: boolean;
  onClose: () => void;
}

function CompletionBlock({ c }: { c: Room['completion'] }) {
  const statusLabel = c.status === 'on-track' ? 'on track' : 'watch';
  const tagClass = c.tag === 'over-run risk' ? 'ci-tag risk' : 'ci-tag';
  return (
    <div className="completion">
      <div className="completion-top">
        <span className={`status-chip ${c.status}`}><span className="dot" />{statusLabel}</span>
        <span className="priority-badge">{c.priority}</span>
      </div>
      <div className="completion-body">
        <div>
          <div className="progress-head"><span>Elapsed</span><b>{c.pct}%</b></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${c.pct}%` }} /></div>
        </div>
        <div className="completion-info">
          <div className="ci-tagrow"><span className={tagClass}>{c.tag}</span></div>
          <div className="ci-row">
            <span>Predicted finish</span>
            <b>{c.finish}{c.delay ? <span className="ci-delay">{c.delay}</span> : null}</b>
          </div>
          <div className="ci-row">
            <span>Next patient</span>
            <span className={`ci-pill ${c.nextReady ? 'ready' : 'notready'}`}>{c.nextReady ? 'ready' : 'not ready'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OTDetailModal({ room, view, open, onClose }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-panel"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="card-top">
            <div className="card-id" id="modal-title">{room.id}</div>
            <div className={`status-pill status-${room.status}`}>{room.statusLabel}</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body">
          <div className="patient-line">{room.patient}</div>
          <div className="procedure-line">{room.procedure}</div>

          <div className="vitals-row modal-vitals-summary">
            {room.vitals.map(v => (
              <div className="vital" key={v.l}>
                <div className="label">{v.l}</div>
                <div className={`value ${classify(v.key, typeof v.v === 'number' ? v.v : undefined)}`}>{v.v}</div>
              </div>
            ))}
          </div>

          {room.alert && <div className="alert-strip">⚠ {room.alert}</div>}

          <CompletionBlock c={room.completion} />

          <div className="detail modal-detail">
            <div className="detail-inner">
              <div className="detail-group hemo">
                <h4>HEMODYNAMICS</h4>
                <VitalGroup items={room.detail.hemo} view={view} />
              </div>
              <div className="detail-group vent">
                <h4>VENTILATION</h4>
                <VitalGroup items={room.detail.vent} view={view} />
              </div>
              <div className="detail-group temp">
                <h4>TEMPERATURE</h4>
                <VitalGroup items={room.detail.temp} view={view} />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-link-btn" onClick={() => navigate(`/ot/${room.id}`)}>
            Open full record →
          </button>
        </div>
      </div>
    </div>
  );
}
