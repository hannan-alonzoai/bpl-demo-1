import { useState } from 'react';
import { OR_STAGES, VITAL_SOURCES } from '../../../data/flows';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { stageVitals } from '../../../utils/stageVitals';
import { ParamChip } from '../shared/ParamChip';

interface FlowsheetProps {
  currentStageIdx: number;
  viewStageIdx: number;
  onViewStageChange: (idx: number) => void;
  onRequestAdvance: (targetIdx: number) => void;
}

function stageNodeClass(i: number, currentStageIdx: number, viewStageIdx: number) {
  const nextIdx = currentStageIdx + 1;
  let cls = 'ot-stage-node';
  if (i > nextIdx) cls += ' locked';
  else if (i === nextIdx) cls += ' next';
  else if (i < currentStageIdx) cls += ' done';
  else if (i === currentStageIdx) cls += ' current';
  if (i === viewStageIdx && viewStageIdx !== currentStageIdx) cls += ' viewing';
  return cls;
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M3 8.5l3.5 3.5 6.5-7" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
    </svg>
  );
}

type MonitorParam = ReturnType<typeof stageVitals>['monitorParams'][number];

type MonitorLane = {
  key: string;
  label: string;
  unit: string;
  color: string;
  value: string;
  desktopPoints: string;
  mobilePoints: string;
};

function buildMonitorLanes(stageIdx: number, params: MonitorParam[]): MonitorLane[] {
  const offset = stageIdx * 5;
  const hr = params.find(p => p.param === 'Heart Rate');
  const rr = params.find(p => p.param === 'Resp. Rate');
  const spo2 = params.find(p => p.param === 'SpO₂');
  const temp = params.find(p => p.param === 'Temp1');

  const desktop = (fn: (i: number, x: number) => number) =>
    Array.from({ length: 100 }, (_, i) => {
      const x = i * 7.6;
      return `${x},${fn(i, x)}`;
    }).join(' ');

  const mobile = (fn: (i: number, x: number) => number, width = 320) =>
    Array.from({ length: 80 }, (_, i) => {
      const x = i * (width / 79);
      return `${x},${fn(i, x)}`;
    }).join(' ');

  return [
    {
      key: 'ecg',
      label: 'ECG',
      unit: 'mV',
      color: '#16a34a',
      value: hr ? `${hr.value} ${hr.unit ?? 'bpm'}`.trim() : '—',
      desktopPoints: desktop((i) => {
        const beat = (i + offset) % 12;
        if (beat === 0) return 18;
        if (beat === 1) return 52;
        if (beat === 2) return 28;
        return 35 + Math.sin((i + offset) * 0.8) * 3;
      }),
      mobilePoints: mobile((i) => {
        const beat = (i + offset) % 12;
        if (beat === 0) return 38;
        if (beat === 1) return 8;
        if (beat === 2) return 28;
        return 22 + Math.sin((i + offset) * 0.8) * 4;
      }),
    },
    {
      key: 'resp',
      label: 'Resp',
      unit: 'a.u.',
      color: '#1d4ed8',
      value: rr ? `${rr.value} ${rr.unit ?? '/min'}`.trim() : '—',
      desktopPoints: desktop(i => 95 + Math.sin((i + offset) * 0.18) * 18),
      mobilePoints: mobile(i => 24 + Math.sin((i + offset) * 0.18) * 14),
    },
    {
      key: 'spo2',
      label: 'SpO₂',
      unit: '%',
      color: '#dc2626',
      value: spo2 ? `${spo2.value} ${spo2.unit ?? '%'}`.trim() : '—',
      desktopPoints: desktop(i => {
        const pulse = Math.abs(Math.sin((i + offset) * 0.45));
        return 165 - pulse * 22;
      }),
      mobilePoints: mobile(i => {
        const pulse = Math.abs(Math.sin((i + offset) * 0.45));
        return 28 - pulse * 18;
      }),
    },
    {
      key: 'temp',
      label: 'Temp',
      unit: '°C',
      color: '#ea580c',
      value: temp ? `${temp.value} ${temp.unit ?? '°C'}`.trim() : '—',
      desktopPoints: desktop(i => 215 + Math.sin((i + offset) * 0.05) * 2),
      mobilePoints: mobile(i => 24 + Math.sin((i + offset) * 0.05) * 3),
    },
  ];
}

const CHART_TIMES = ['09:15', '09:28', '09:41'];

const SUMMARY_VITALS = [
  { param: 'Heart Rate', short: 'HR', tone: 'hr' as const },
  { param: 'Resp. Rate', short: 'Resp', tone: 'resp' as const },
  { param: 'SpO₂', short: 'SpO₂', tone: 'spo2' as const },
  { param: 'Temp1', short: 'Temp', tone: 'temp' as const },
];

function Waveform({ stageIdx, params }: { stageIdx: number; params: MonitorParam[] }) {
  const isMobile = useIsMobile();
  const lanes = buildMonitorLanes(stageIdx, params);
  const mobileLanes = lanes.filter(l => l.key !== 'temp');
  const [maximized, setMaximized] = useState(false);

  return (
    <div className={`flowsheet-waveform-block${maximized ? ' maximized' : ''}${isMobile ? ' is-mobile-monitor' : ''}`}>
      <div className="flowsheet-live-header">
        <span className="flowsheet-live-title">Live Patient Monitor</span>
        <span className="flowsheet-live-badge">
          <span className="flowsheet-live-dot" aria-hidden />
          Live
        </span>
        {isMobile ? (
          <button
            type="button"
            className="chart-maximize-btn chart-maximize-btn-inline"
            title={maximized ? 'Exit fullscreen' : 'Maximize chart'}
            aria-label={maximized ? 'Exit fullscreen' : 'Maximize chart'}
            onClick={() => setMaximized(v => !v)}
          >
            <MaximizeIcon />
          </button>
        ) : null}
      </div>

      {isMobile ? (
        <div className="flowsheet-vitals-summary" aria-label="Vital signs summary">
          {SUMMARY_VITALS.map(meta => {
            const p = params.find(x => x.param === meta.param);
            return (
              <div key={meta.param} className={`flowsheet-vital-card tone-${meta.tone}`}>
                <span className="flowsheet-vital-card-label">{meta.short}</span>
                <span className="flowsheet-vital-card-value">
                  {p ? p.value : '—'}
                  {p?.unit ? <small>{p.unit}</small> : null}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="vitals-param-list vitals-param-list-above">
          {params.map(p => (
            <ParamChip key={p.param} param={p.param} value={p.value} unit={p.unit} kind={p.kind} />
          ))}
        </div>
      )}

      <div className="flowsheet-chart-wrap">
        {!isMobile ? (
          <button
            type="button"
            className="chart-maximize-btn"
            title={maximized ? 'Exit fullscreen' : 'Maximize chart'}
            aria-label={maximized ? 'Exit fullscreen' : 'Maximize chart'}
            onClick={() => setMaximized(v => !v)}
          >
            <MaximizeIcon />
          </button>
        ) : null}

        {isMobile ? (
          <>
            <div className="waveform-legend waveform-legend-mobile" aria-hidden>
              {mobileLanes.map(lane => (
                <span key={lane.key}>
                  <i style={{ background: lane.color }} />
                  {lane.label}
                </span>
              ))}
            </div>
            <div className="flowsheet-stacked-lanes">
              {mobileLanes.map(lane => (
                <div key={lane.key} className="flowsheet-lane-row">
                  <div className="flowsheet-lane-meta">
                    <span className="flowsheet-lane-title" style={{ color: lane.color }}>
                      <i style={{ background: lane.color }} aria-hidden />
                      {lane.label}
                    </span>
                    <span className="flowsheet-lane-unit">{lane.unit}</span>
                  </div>
                  <div className="flowsheet-lane-body">
                    <svg className="flowsheet-lane-chart" viewBox="0 0 320 44" preserveAspectRatio="none" aria-hidden>
                      <line x1="0" y1="11" x2="320" y2="11" stroke="#eef2f8" strokeWidth="1" />
                      <line x1="0" y1="22" x2="320" y2="22" stroke="#eef2f8" strokeWidth="1" />
                      <line x1="0" y1="33" x2="320" y2="33" stroke="#eef2f8" strokeWidth="1" />
                      <polyline
                        fill="none"
                        stroke={lane.color}
                        strokeWidth="2"
                        strokeLinejoin="round"
                        points={lane.mobilePoints}
                      />
                    </svg>
                    <span className="flowsheet-lane-value" style={{ color: lane.color }}>
                      {lane.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flowsheet-chart-time flowsheet-chart-time-single">
              {CHART_TIMES.map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </>
        ) : (
          <div className="waveform-chart-body">
            <div className="waveform-lane-labels" aria-hidden>
              {lanes.map(lane => (
                <div key={lane.key} className="waveform-lane-label">
                  <i style={{ background: lane.color }} />
                  <span style={{ color: lane.color }}>{lane.label}</span>
                </div>
              ))}
            </div>
            <div className="waveform-svg-col">
              <svg className="flowsheet-chart" viewBox="0 0 760 240" preserveAspectRatio="none">
                {[60, 120, 180].map(y => (
                  <line key={y} x1="0" y1={y} x2="760" y2={y} stroke="#eef2f8" strokeWidth="1" />
                ))}
                {lanes.map(lane => (
                  <polyline
                    key={lane.key}
                    fill="none"
                    stroke={lane.color}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    points={lane.desktopPoints}
                  />
                ))}
              </svg>
              <div className="flowsheet-chart-time">
                {CHART_TIMES.map(t => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="waveform-lane-values" aria-hidden>
              {lanes.map(lane => (
                <div key={lane.key} className="waveform-lane-value" style={{ color: lane.color }}>
                  {lane.value}
                </div>
              ))}
            </div>
          </div>
        )}
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
  const isMobile = useIsMobile();
  const [sourceId, setSourceId] = useState('monitor');
  const nextIdx = currentStageIdx + 1;
  const progressPct =
    OR_STAGES.length <= 1 ? 0 : (Math.min(currentStageIdx, OR_STAGES.length - 1) / (OR_STAGES.length - 1)) * 100;

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
      <div className="ot-stage-tracker-wrap">
        <div className="ot-stage-tracker" role="list" aria-label="OT stage progress">
          <div className="ot-stage-track" aria-hidden>
            <div className="ot-stage-track-fill" style={{ width: `${progressPct}%` }} />
          </div>
          {OR_STAGES.map((s, i) => {
            const cls = stageNodeClass(i, currentStageIdx, viewStageIdx);
            const locked = i > nextIdx;
            const isNext = i === nextIdx && nextIdx < OR_STAGES.length;
            const isDone = i < currentStageIdx;
            const isCurrent = i === currentStageIdx;
            const isUpcoming = i > currentStageIdx;
            const title = isNext ? `Proceed to ${s.name}` : s.desc;

            const content = (
              <>
                <span className="ot-stage-marker">
                  {isDone ? <CheckIcon /> : <span className="ot-stage-num">{i + 1}</span>}
                </span>
                <span className="ot-stage-name">{s.name}</span>
                <span className="ot-stage-time">{s.time}</span>
                {isCurrent ? <span className="ot-stage-badge current">Current</span> : null}
                {isUpcoming ? <span className="ot-stage-badge upcoming">Upcoming</span> : null}
              </>
            );

            if (locked) {
              return (
                <div key={s.id} className={cls} role="listitem" title="Complete prior stages first" aria-disabled="true">
                  {content}
                </div>
              );
            }

            return (
              <button
                key={s.id}
                type="button"
                className={cls}
                role="listitem"
                title={title}
                onClick={() => onStageClick(i)}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {isMobile ? (
        <div className="flowsheet-mobile-source-row">
          <label className="flowsheet-mobile-source-label" htmlFor="vitals-source-mobile">
            Vitals Source
          </label>
          <select
            id="vitals-source-mobile"
            className="flowsheet-mobile-source-select"
            value={sourceId}
            onChange={e => setSourceId(e.target.value)}
          >
            {VITAL_SOURCES.map(s => (
              <option key={s.id} value={s.id}>{s.short ?? s.name}</option>
            ))}
          </select>
        </div>
      ) : null}

      <div className={`flowsheet-vitals-layout${isMobile ? ' flowsheet-vitals-layout-mobile' : ''}`}>
        {!isMobile ? (
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
        ) : null}
        <div className="flowsheet-vitals-main">
          <div className="flowsheet-vitals-panel">
            <VitalsPanel stageIdx={viewStageIdx} sourceId={sourceId} />
          </div>
        </div>
      </div>
    </>
  );
}
