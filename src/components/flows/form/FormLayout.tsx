import { useState } from 'react';
import type { FormSampleData } from '../../../data/formSampleData';

interface Props {
  layout: 'a' | 'b';
  data: FormSampleData;
  readonly?: boolean;
}

function val(data: FormSampleData, key: string) {
  return String(data[key] ?? '');
}

function checked(data: FormSampleData, key: string) {
  return !!data[key];
}

function Check({ data, field, label, readonly }: { data: FormSampleData; field: string; label: string; readonly?: boolean }) {
  return (
    <label className="check">
      <input type="checkbox" defaultChecked={checked(data, field)} disabled={readonly} />
      {label}
    </label>
  );
}

function CheckWithInput({
  data, field, label, inputKey, placeholder, readonly,
}: {
  data: FormSampleData; field: string; label: string; inputKey: string; placeholder?: string; readonly?: boolean;
}) {
  return (
    <label className="check-with-input">
      <span className="check-label">
        <input type="checkbox" defaultChecked={checked(data, field)} disabled={readonly} />
        {label}
      </span>
      <input type="text" defaultValue={val(data, inputKey)} placeholder={placeholder} disabled={readonly} />
    </label>
  );
}

function TextField({ data, label, field, readonly }: { data: FormSampleData; label: string; field: string; readonly?: boolean }) {
  return (
    <div className="field-item">
      <span className="field-label">{label}</span>
      <input type="text" defaultValue={val(data, field)} disabled={readonly} />
    </div>
  );
}

function RadioPair({
  data, name, field, label, readonly,
}: { data: FormSampleData; name: string; field: string; label: string; readonly?: boolean }) {
  const v = val(data, field);
  return (
    <div className="radio-group">
      <span className="group-label">{label}</span>
      <label className="radio">
        <input type="radio" name={name} defaultChecked={v === 'yes'} disabled={readonly} />
        Yes
      </label>
      <label className="radio">
        <input type="radio" name={name} defaultChecked={v === 'no'} disabled={readonly} />
        No
      </label>
    </div>
  );
}

function AirwayFields({ data, readonly }: { data: FormSampleData; readonly?: boolean }) {
  return (
    <>
      <div className="form-block">
        <div className="block-label">Airway device</div>
        <div className="input-grid">
          <CheckWithInput data={data} field="lma" label="LMA" inputKey="lmaSize" placeholder="Size" readonly={readonly} />
          <CheckWithInput data={data} field="ettOral" label="ETT Oral" inputKey="ettSize" placeholder="Size" readonly={readonly} />
          <CheckWithInput data={data} field="dltLt" label="DLT Left" inputKey="dltLtSize" placeholder="Size" readonly={readonly} />
          <CheckWithInput data={data} field="dltRt" label="DLT Right" inputKey="dltRtSize" placeholder="Size" readonly={readonly} />
        </div>
        <div className="check-grid" style={{ marginTop: 12 }}>
          <Check data={data} field="ettNasal" label="ETT Nasal" readonly={readonly} />
          <Check data={data} field="trach" label="Tracheostomy" readonly={readonly} />
          <Check data={data} field="mask" label="Mask" readonly={readonly} />
        </div>
        <div className="inline-fields" style={{ marginTop: 12 }}>
          <TextField data={data} label="Tracheostomy size" field="trachSize" readonly={readonly} />
          <TextField data={data} label="Mask depth (cm)" field="maskDepth" readonly={readonly} />
        </div>
      </div>
      <div className="form-block">
        <div className="block-label">Induction</div>
        <div className="check-grid">
          <Check data={data} field="rapidInduction" label="Rapid Induction" readonly={readonly} />
          <Check data={data} field="slowInduction" label="Slow Induction" readonly={readonly} />
        </div>
      </div>
      <div className="form-block">
        <div className="block-label">Intubation route</div>
        <div className="check-grid cols-3">
          <Check data={data} field="endotracheal" label="Endotracheal" readonly={readonly} />
          <Check data={data} field="endobronchial" label="Endobronchial" readonly={readonly} />
          <Check data={data} field="mouth" label="Mouth" readonly={readonly} />
          <Check data={data} field="nose" label="Nose" readonly={readonly} />
          <Check data={data} field="izq" label="Izq" readonly={readonly} />
          <Check data={data} field="derecho" label="Derecho" readonly={readonly} />
          <Check data={data} field="tracheotomy" label="Tracheotomy" readonly={readonly} />
        </div>
        <div className="inline-fields" style={{ marginTop: 14 }}>
          <TextField data={data} label="Type" field="type" readonly={readonly} />
          <TextField data={data} label="Depth (cm)" field="depth" readonly={readonly} />
        </div>
        <div className="radio-group" style={{ marginTop: 12 }}>
          <span className="group-label">Cuff</span>
          <label className="radio">
            <input type="radio" name="cuff2" defaultChecked={checked(data, 'cuffWith')} disabled={readonly} />
            With
          </label>
          <label className="radio">
            <input type="radio" name="cuff2" disabled={readonly} />
            Without
          </label>
        </div>
      </div>
      <div className="form-block">
        <Check data={data} field="anesthesiaMonitoring" label="Anesthesia Monitoring" readonly={readonly} />
      </div>
    </>
  );
}

function MonitorFields({ data, readonly }: { data: FormSampleData; readonly?: boolean }) {
  const monitors: [string, string][] = [
    ['nibp', 'NIBP'], ['spo2', 'SpO₂'], ['etco2', 'ETCO₂'], ['abp', 'ABP'],
    ['cvp', 'CVP'], ['pap', 'PAP'], ['bis', 'BIS'], ['preEso', 'Pre Eso Steth'],
    ['tee', 'TEE'], ['urine', 'Urine'], ['ecg', 'ECG'], ['temp', 'Temperature'],
  ];
  const special: [string, string][] = [
    ['fiberoptic', 'Fiberoptic'], ['intubation', 'Intubation'], ['oneLung', 'One Lung Ventilation'],
    ['jetVent', 'Jet Ventilation'], ['cpb', 'CPB'], ['iabp', 'IABP'],
    ['vao', 'VAO'], ['endoscope', 'Endoscope'], ['hypotension', 'Induced Hypotension'],
  ];

  return (
    <>
      <div className="form-block">
        <div className="block-label">Monitors</div>
        <div className="check-grid cols-3">
          {monitors.map(([k, l]) => <Check key={k} data={data} field={k} label={l} readonly={readonly} />)}
        </div>
        <div className="inline-fields" style={{ marginTop: 12 }}>
          <div className="field-item" style={{ maxWidth: '100%' }}>
            <span className="field-label">Other monitor</span>
            <input type="text" defaultValue={val(data, 'monitorOtherText')} placeholder="Specify if other" disabled={readonly} />
          </div>
        </div>
      </div>
      <div className="form-block">
        <div className="block-label">Special techniques</div>
        <div className="check-grid cols-3">
          {special.map(([k, l]) => <Check key={k} data={data} field={k} label={l} readonly={readonly} />)}
        </div>
      </div>
      <div className="form-block">
        <div className="block-label">Delivery (if applicable)</div>
        <div className="input-grid cols-3">
          <TextField data={data} label="Baby delivered time" field="babyTime" readonly={readonly} />
          <TextField data={data} label="Apgar — 1 min" field="apgar1" readonly={readonly} />
          <TextField data={data} label="Apgar — 5 min" field="apgar5" readonly={readonly} />
        </div>
        <div className="radio-group" style={{ marginTop: 12 }}>
          <span className="group-label">Gender</span>
          <label className="radio">
            <input type="radio" name="gender" defaultChecked={val(data, 'gender') === 'male'} disabled={readonly} />
            Male
          </label>
          <label className="radio">
            <input type="radio" name="gender" defaultChecked={val(data, 'gender') === 'female'} disabled={readonly} />
            Female
          </label>
        </div>
      </div>
    </>
  );
}

function RegionalFields({ data, readonly }: { data: FormSampleData; readonly?: boolean }) {
  return (
    <>
      <div className="form-block">
        <div className="block-label">Technique</div>
        <div className="input-grid">
          <CheckWithInput data={data} field="epidural" label="Epidural — Level L" inputKey="epiduralL" placeholder="e.g. L3" readonly={readonly} />
          <CheckWithInput data={data} field="epiduralT" label="Epidural — Level T" inputKey="epiduralTVal" placeholder="e.g. T8" readonly={readonly} />
        </div>
        <div className="check-grid" style={{ marginTop: 12 }}>
          <Check data={data} field="brachial" label="Brachial Plexus" readonly={readonly} />
          <Check data={data} field="spinal" label="Spinal" readonly={readonly} />
          <Check data={data} field="caudal" label="Caudal" readonly={readonly} />
          <Check data={data} field="raOther" label="Others" readonly={readonly} />
        </div>
      </div>
      <div className="form-block">
        <div className="block-label">Procedure details</div>
        <div className="input-grid">
          <TextField data={data} label="Approach" field="approach" readonly={readonly} />
          <TextField data={data} label="Site" field="site" readonly={readonly} />
          <TextField data={data} label="Needle" field="needle" readonly={readonly} />
          <TextField data={data} label="Anesthetic level" field="level" readonly={readonly} />
          <TextField data={data} label="Agents" field="agents" readonly={readonly} />
          <TextField data={data} label="Technical difficulty" field="difficulty" readonly={readonly} />
        </div>
      </div>
    </>
  );
}

function AirwayMgmtFields({ data, readonly }: { data: FormSampleData; readonly?: boolean }) {
  return (
    <>
      <div className="form-block">
        <div className="input-grid">
          <RadioPair data={data} name="lmaEasy" field="lmaEasy" label="LMA insertion easy" readonly={readonly} />
          <RadioPair data={data} name="intubEasy" field="intubEasy" label="Intubation easy" readonly={readonly} />
        </div>
      </div>
      <div className="form-block">
        <div className="block-label">Grading &amp; equipment</div>
        <div className="inline-fields">
          <TextField data={data} label="LV Grade" field="lvGrade" readonly={readonly} />
          <TextField data={data} label="DL" field="dl" readonly={readonly} />
          <div className="field-item">
            <span className="field-label">Attempt / Blade</span>
            <select defaultValue={val(data, 'blade') || 'Attempt 1'} disabled={readonly}>
              <option>Attempt 1</option>
              <option>Attempt 2</option>
              <option>Attempt 3</option>
            </select>
          </div>
        </div>
      </div>
      <div className="form-block">
        <div className="block-label">Methods</div>
        <div className="check-grid">
          <Check data={data} field="rapidSeq" label="Rapid Sequence" readonly={readonly} />
          <Check data={data} field="cricoid" label="Cricoid Pressure" readonly={readonly} />
          <Check data={data} field="videoLary" label="Video Laryngoscope" readonly={readonly} />
        </div>
      </div>
      <div className="form-block">
        <div className="block-label">Confirm by</div>
        <div className="check-grid">
          <Check data={data} field="bbs" label="BBS" readonly={readonly} />
          <Check data={data} field="fob" label="FOB" readonly={readonly} />
          <Check data={data} field="etco2Confirm" label="ETCO₂" readonly={readonly} />
        </div>
      </div>
    </>
  );
}

export function FormLayout({ layout, data, readonly = false }: Props) {
  const [activeTab, setActiveTab] = useState('airway');

  if (layout === 'b') {
    const tabs = [
      { id: 'airway', label: 'Airway & Induction', content: <AirwayFields data={data} readonly={readonly} /> },
      { id: 'monitors', label: 'Monitors & Techniques', content: <MonitorFields data={data} readonly={readonly} /> },
      { id: 'regional', label: 'Regional / Nerve Block', content: <RegionalFields data={data} readonly={readonly} /> },
      { id: 'mgmt', label: 'Airway Management', content: <AirwayMgmtFields data={data} readonly={readonly} /> },
    ];
    return (
      <div className="form-grid-b">
        <div className="form-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              className={`form-tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tabs.map(t => (
          <div key={t.id} className={`tab-panel section-card${activeTab === t.id ? ' active' : ''}`}>
            {t.content}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="form-grid-a">
      <div className="quadrant">
        <div className="quadrant-title">Airway &amp; Induction</div>
        <AirwayFields data={data} readonly={readonly} />
      </div>
      <div className="quadrant">
        <div className="quadrant-title">Monitors &amp; Special Techniques</div>
        <MonitorFields data={data} readonly={readonly} />
      </div>
      <div className="quadrant">
        <div className="quadrant-title">Regional Anesthesia / Nerve Block</div>
        <RegionalFields data={data} readonly={readonly} />
      </div>
      <div className="quadrant">
        <div className="quadrant-title">Airway Management</div>
        <AirwayMgmtFields data={data} readonly={readonly} />
      </div>
    </div>
  );
}
