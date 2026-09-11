import { useEffect, useMemo, useState } from 'react';
import { DUMMY_SUBMISSIONS, getFormTitle } from '../../../data/forms';
import { FORM_SAMPLE_DATA } from '../../../data/formSampleData';
import { FormLayout } from '../form/FormLayout';

interface Props {
  formId: string;
  mode: 'create' | 'view';
  recordId?: number | null;
  onBack: () => void;
}

export function FormFillOverlay({ formId, mode, recordId, onBack }: Props) {
  const readonly = mode === 'view';
  const submission = useMemo(() => {
    if (!recordId) return null;
    return (DUMMY_SUBMISSIONS[formId] ?? []).find(r => r.id === recordId) ?? null;
  }, [formId, recordId]);

  const [layout, setLayout] = useState<'a' | 'b'>(submission?.layout ?? 'a');
  const title = getFormTitle(formId);

  useEffect(() => {
    setLayout(submission?.layout ?? 'a');
  }, [submission]);

  useEffect(() => {
    document.body.classList.add('form-mode');
    document.body.classList.remove('dashboard-mode');
    return () => {
      document.body.classList.remove('form-mode');
      document.body.classList.add('dashboard-mode');
    };
  }, []);

  return (
    <div className={`form-view active${readonly ? ' readonly' : ''}`}>
      <header className="topbar">
        <div className="topbar-brand">
          <img src="/assets/bpl-cortex-ot-logo.png" alt="BPL Cortex OT" className="topbar-logo" />
        </div>
        <div className="topbar-user"><div className="avatar">JJ</div> Dr Jacob Jenner</div>
      </header>
      <div className="form-toolbar">
        <div className="form-breadcrumb">
          <button type="button" className="action-link" onClick={onBack}>Forms</button>
          {' / '}
          <span>{title}</span>
          <span className={`mode-tag${readonly ? ' view' : ''}`}>
            {readonly ? 'View (read-only)' : 'Create'}
          </span>
        </div>
        <div className="layout-switch">
          <button type="button" className={layout === 'a' ? 'active' : ''} onClick={() => setLayout('a')}>Form A</button>
          <button type="button" className={layout === 'b' ? 'active' : ''} onClick={() => setLayout('b')}>Form B</button>
        </div>
      </div>
      <div className="form-body">
        <FormLayout layout={layout} data={FORM_SAMPLE_DATA} readonly={readonly} />
      </div>
      <footer className="form-footer">
        {!readonly && (
          <>
            <button type="button" className="btn btn-submit">Submit</button>
            <button type="button" className="btn btn-reset">Reset</button>
          </>
        )}
        <button type="button" className="btn btn-back" onClick={onBack}>Go Back</button>
      </footer>
    </div>
  );
}
