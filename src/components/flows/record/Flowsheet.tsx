import { useState } from 'react';
import { OR_STAGES, VITAL_SOURCES } from '../../../data/flows';
import { stageVitals } from '../../../utils/stageVitals';
import { ParamChip } from '../shared/ParamChip';

interface FlowsheetProps {
  currentStageIdx: number;
  viewStageIdx: number;
  onViewStageChange: (idx: number) => void;
  onRequestAdvance: (targetIdx: number) => void;
}

function stageBoxClass(i: number, currentStageIdx: number, viewStageIdx: number) {
  const nextIdx = currentStageIdx + 1;
  if (i > nextIdx) return 'stage-box locked';
  if (i === nextIdx) return 'stage-box next';
  let cls = 'stage-box';
  if (i < currentStageIdx) cls += ' done';
  if (i === currentStageIdx) cls += ' current';
  if (i === viewStageIdx && viewStageIdx !== currentStageIdx) cls += ' viewing';
  return cls;
}

function Waveform({ stageIdx, params }: { stageIdx: number; params: ReturnType<typeof stageVitals>['monitorParams'] }) {
  const offset = stageIdx * 5;
  const t0 = `${8 + Math.floor(stageIdx / 2)}:${String(28 + (stageIdx % 2) * 15).padStart(2, '0')}`;
  const tMid = `${8 + Math.floor((stageIdx + 1) / 2)}:${String(10 + stageIdx * 3).padStart(2, '0')}`;
  const t1 = `${9 + Math.floor(stageIdx / 3)}:${String(5 + stageIdx * 2).padStart(2, '0')}`;

  return (
    <div className="flowsheet-waveform-block">
      <div className="vitals-param-list vitals-param-list-above">
        {params.map(p => (
          <ParamChip key={p.param} param={p.param} value={p.value} unit={p.unit} kind={p.kind} />
        ))}
      </div>
      <div className="flowsheet-chart-wrap">
        <svg className="flowsheet-chart" viewBox="0 0 800 200" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#16a34a"
            strokeWidth="2"
            points={Array.from({ length: 80 }, (_, i) => `${i * 10},${100 + Math.sin((i + offset) * 0.4) * 40}`).join(' ')}
          />
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            points={Array.from({ length: 80 }, (_, i) => `${i * 10},${120 + Math.sin((i + offset) * 0.25) * 20}`).join(' ')}
          />
        </svg>
        <div className="flowsheet-chart-time">
          <span>{t0}</span>
          <span>{tMid}</span>
          <span>{t1}</span>
        </div>
        <div className="waveform-legend">
          <span>
            <i style={{ background: '#16a34a' }} /> ECG
          </span>
          <span>
            <i style={{ background: '#2563eb' }} /> Resp. Rate
          </span>
          <span>
            <i style={{ background: '#ea580c' }} /> SpO₂
          </span>
          <span>
            <i style={{ background: '#dc2626' }} /> Temp1
          </span>
        </div>
      </div>
    </div>
  );
}

function VitalsPanel({ stageIdx, sourceId }: { stageIdx: number; sourceId: string }) {
  const data = stageVitals(stageIdx);

  if (sourceId === 'monitor') {
    return <Waveform stageIdx={stageIdx} params={data.monitorParams} />;
  }
  if (sourceId === 'anaesthesia_machine') {
    const a = data.anes;
    const cells: [string, string | number, string][] = [
      ['FiO₂', a.fio2, '%'],
      ['Tidal Vol', a.tv, 'mL'],
      ['RR', a.rr, '/min'],
      ['PEEP', a.peep, 'cmH₂O'],
      ['EtCO₂', a.etco2, 'mmHg'],
      ['Agent', a.agent, ''],
      ['MAC', a.mac, ''],
    ];
    return (
      <div className="anes-grid">
        {cells.map(([label, val, unit]) => (
          <div className="anes-cell" key={label}>
            <div className="label">{label}</div>
            <div className="value">
              {val}
              {unit && val !== '—' ? <span className="unit"> {unit}</span> : null}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (sourceId === 'syringe_pump') {
    return (
      <div className="pump-grid">
        {data.pumps.map(p => (
          <div className="pump-card" key={p.drug}>
            <div className="pump-card-header">
              <span className="pump-drug">{p.drug}</span>
              <span className={`pump-status${p.active ? '' : ' idle'}`}>{p.active ? '● infusing' : 'idle'}</span>
            </div>
            <div className="pump-row">
              <span>Rate</span>
              <span className="val">{p.rate}</span>
            </div>
            <div className="pump-row">
              <span>Vol infused</span>
              <span className="val">{p.infused}</span>
            </div>
            <div className="pump-row">
              <span>VTBI</span>
              <span className="val">{p.vtbi}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function Flowsheet({ currentStageIdx, viewStageIdx, onViewStageChange, onRequestAdvance }: FlowsheetProps) {
  const [sourceId, setSourceId] = useState('monitor');

  const nextIdx = currentStageIdx + 1;

  function onStageClick(targetIdx: number) {
    if (targetIdx > nextIdx) return;
    if (targetIdx === nextIdx) {
      onRequestAdvance(targetIdx);
      return;
    }
    onViewStageChange(targetIdx);
  }

  return (
    <>
      <div className="stage-boxes-wrap">
        <div className="stage-boxes">
          {OR_STAGES.map((s, i) => {
            const cls = stageBoxClass(i, currentStageIdx, viewStageIdx);
            const locked = i > nextIdx;
            const isNext = i === nextIdx && nextIdx < OR_STAGES.length;
            const title = isNext ? `Proceed to ${s.name}` : s.desc;

            if (locked) {
              return (
                <div key={s.id} className={cls} title="Complete prior stages first" aria-disabled="true">
                  <span className="stage-box-num">{i + 1}</span>
                  <span className="stage-box-name">{s.name}</span>
                  <span className="stage-box-time">{s.time}</span>
                </div>
              );
            }

            return (
              <button
                key={s.id}
                type="button"
                className={cls}
                title={title}
                onClick={() => onStageClick(i)}
              >
                <span className="stage-box-num">{i + 1}</span>
                <span className="stage-box-name">{s.name}</span>
                <span className="stage-box-time">{s.time}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flowsheet-vitals-layout">
        <div className="vitals-source-tabs-stack" role="tablist" aria-label="Vitals source">
          {VITAL_SOURCES.map(s => (
            <button
              key={s.id}
              type="button"
              role="tab"
              className={`vitals-source-tab${s.id === sourceId ? ' active' : ''}`}
              aria-selected={s.id === sourceId}
              title={s.name}
              onClick={() => setSourceId(s.id)}
            >
              {s.short ?? s.name}
            </button>
          ))}
        </div>
        <div className="flowsheet-vitals-main">
          <div className="flowsheet-vitals-panel">
            <VitalsPanel stageIdx={viewStageIdx} sourceId={sourceId} />
          </div>
        </div>
      </div>
    </>
  );
}
