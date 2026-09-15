import { useEffect } from 'react';
import { SCHEDULE_STAGES } from './scheduleUtils';

interface Props {
  targetStageIndex: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StageProceedDialog({ targetStageIndex, onConfirm, onCancel }: Props) {
  const stage = SCHEDULE_STAGES[targetStageIndex];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      className="stage-proceed-overlay"
      role="presentation"
      onClick={e => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="stage-proceed-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stage-proceed-title"
        onClick={e => e.stopPropagation()}
      >
        <h4 id="stage-proceed-title">Proceed to new stage?</h4>
        <p>
          Advance the case to <strong>{stage.name}</strong> (stage {targetStageIndex + 1} of{' '}
          {SCHEDULE_STAGES.length})?
        </p>
        <div className="stage-proceed-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={onConfirm}>
            Yes, proceed
          </button>
        </div>
      </div>
    </div>
  );
}
