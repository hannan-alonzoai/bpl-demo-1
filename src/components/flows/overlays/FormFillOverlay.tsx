import { useState } from 'react';
import { getFormTitle } from '../../../data/forms';

interface Props {
  formId: string;
  onBack: () => void;
}

export function FormFillOverlay({ formId, onBack }: Props) {
  const [layout, setLayout] = useState<'a' | 'b'>('a');
  const title = getFormTitle(formId);

  return (
    <div className="form-view active">
      <header className="topbar">
        <div className="topbar-brand">
          <img src="/assets/bpl-cortex-ot-logo.png" alt="BPL Cortex OT" className="topbar-logo" />
        </div>
        <div className="topbar-user"><div className="avatar">JJ</div> Dr Jacob Jenner</div>
      </header>
      <div className="form-toolbar">
        <div className="form-breadcrumb">
          <button type="button" className="btn-link" onClick={onBack}>Forms</button>
          {' / '}
          <span>{title}</span>
          <span className="mode-tag">Create</span>
        </div>
        <div className="layout-switch">
          <button type="button" className={layout === 'a' ? 'active' : ''} onClick={() => setLayout('a')}>Form A</button>
          <button type="button" className={layout === 'b' ? 'active' : ''} onClick={() => setLayout('b')}>Form B</button>
        </div>
      </div>
      <div className="form-body">
        <div className={`form-grid-${layout}`}>
          <div className="form-quadrant">
            <div className="block-label">Airway</div>
            <div className="check-grid">
              <label className="check"><input type="checkbox" defaultChecked /> LMA</label>
              <label className="check"><input type="checkbox" defaultChecked /> ETT Oral</label>
              <label className="check"><input type="checkbox" /> Rapid Sequence</label>
              <label className="check"><input type="checkbox" defaultChecked /> Endotracheal</label>
            </div>
          </div>
          <div className="form-quadrant">
            <div className="block-label">Monitoring</div>
            <div className="check-grid cols-3">
              <label className="check"><input type="checkbox" defaultChecked /> NIBP</label>
              <label className="check"><input type="checkbox" defaultChecked /> SpO₂</label>
              <label className="check"><input type="checkbox" defaultChecked /> EtCO₂</label>
              <label className="check"><input type="checkbox" defaultChecked /> ABP</label>
              <label className="check"><input type="checkbox" defaultChecked /> ECG</label>
              <label className="check"><input type="checkbox" defaultChecked /> Temp</label>
            </div>
          </div>
          <div className="form-quadrant">
            <div className="block-label">Technique</div>
            <div className="input-grid">
              <div className="field-item">
                <span className="field-label">Depth (cm)</span>
                <input type="text" defaultValue="22" />
              </div>
              <div className="field-item">
                <span className="field-label">ETT Size</span>
                <input type="text" defaultValue="7.5" />
              </div>
            </div>
          </div>
          <div className="form-quadrant">
            <div className="block-label">Notes</div>
            <textarea rows={4} defaultValue="Pre-anesthesia assessment completed. Patient stable for GA." style={{ width: '100%' }} />
          </div>
        </div>
      </div>
      <footer className="form-footer">
        <button type="button" className="btn btn-submit">Submit</button>
        <button type="button" className="btn btn-reset">Reset</button>
        <button type="button" className="btn btn-back" onClick={onBack}>Go Back</button>
      </footer>
    </div>
  );
}
