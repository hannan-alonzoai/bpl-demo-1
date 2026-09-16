import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '../../../hooks/useIsMobile';
import type { MonitorParam } from '../../../types';

interface Props {
  stageIdx: number;
  params: MonitorParam[];
  onClose: () => void;
}

/** Demo clock: the flowsheet axis ends at 09:41, so the zoom view holds the hour before it. */
const HISTORY_END_SEC = 9 * 3600 + 41 * 60;
const HISTORY_SPAN_SEC = 60 * 60;
const HISTORY_START_SEC = HISTORY_END_SEC - HISTORY_SPAN_SEC;
const MIN_SPAN_SEC = 15;
const DEFAULT_SPAN_SEC = 15;

const VIEW_W = 1000;
const VIEW_H = 240;
/** Columns sampled across the plot, each reduced to a min/max pair so spikes survive zoom-out. */
const COLS = 360;
const SUB_SAMPLES = 12;

const RANGE_PRESETS = [
  { label: '1 min', sec: 60 },
  { label: '5 min', sec: 300 },
  { label: '15 min', sec: 900 },
  { label: '30 min', sec: 1800 },
  { label: '1 hour', sec: 3600 },
];

type Lane = {
  key: string;
  label: string;
  color: string;
  wave: (tSec: number) => number;
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function numeric(p: MonitorParam | undefined, fallback: number) {
  const n = typeof p?.value === 'number' ? p.value : Number(p?.value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function ecgWave(cycles: number) {
  const p = cycles - Math.floor(cycles);
  const g = (centre: number, width: number) => Math.exp(-(((p - centre) / width) ** 2));
  const y =
    0.44 +
    g(0.16, 0.035) * 0.08 -
    g(0.3, 0.012) * 0.1 +
    g(0.34, 0.012) * 0.5 -
    g(0.39, 0.016) * 0.16 +
    g(0.6, 0.05) * 0.14;
  return clamp(y, 0, 1);
}

function plethWave(cycles: number) {
  const p = cycles - Math.floor(cycles);
  const rise = Math.sin(Math.PI * Math.min(p / 0.55, 1)) ** 1.3;
  const dicrotic = Math.exp(-(((p - 0.68) / 0.07) ** 2)) * 0.22;
  return clamp(0.25 + rise * 0.5 + dicrotic, 0, 1);
}

function buildLanes(stageIdx: number, params: MonitorParam[]): Lane[] {
  const find = (name: string) => params.find(p => p.param === name);
  const hr = find('Heart Rate');
  const rr = find('Resp. Rate');
  const pulse = find('Pulse');
  const phase = stageIdx * 37;
  const hrHz = numeric(hr, 90) / 60;
  const rrHz = numeric(rr, 16) / 60;
  const pulseHz = numeric(pulse, numeric(hr, 90)) / 60;

  return [
    {
      key: 'ecg',
      label: 'ECG',
      color: '#16a34a',
      wave: t => ecgWave((t + phase) * hrHz),
    },
    {
      key: 'resp',
      label: 'Resp. Rate',
      color: '#1d4ed8',
      wave: t => 0.5 + 0.34 * Math.sin(2 * Math.PI * (t + phase) * rrHz),
    },
    {
      key: 'spo2',
      label: 'SpO₂',
      color: '#dc2626',
      wave: t => plethWave((t + phase) * pulseHz),
    },
    {
      key: 'temp',
      label: 'Temp',
      color: '#ea580c',
      wave: t => 0.5 + 0.05 * Math.sin((t + phase) / 420) + 0.02 * Math.sin((t + phase) / 97),
    },
  ];
}

/** Min/max ribbon per column: a crisp line when zoomed in, a density band when zoomed out. */
function envelopePath(wave: (t: number) => number, t0: number, t1: number, top: number, height: number) {
  const dt = (t1 - t0) / COLS;
  const upper: string[] = [];
  const lower: string[] = [];

  for (let c = 0; c <= COLS; c++) {
    const x = ((c / COLS) * VIEW_W).toFixed(1);
    let min = Infinity;
    let max = -Infinity;
    for (let s = 0; s < SUB_SAMPLES; s++) {
      const v = wave(t0 + dt * (c + s / SUB_SAMPLES));
      if (v < min) min = v;
      if (v > max) max = v;
    }
    upper.push(`${x},${(top + (1 - max) * height).toFixed(1)}`);
    lower.push(`${x},${(top + (1 - min) * height).toFixed(1)}`);
  }

  return `M${upper.join('L')}L${lower.reverse().join('L')}Z`;
}

function clockLabel(sec: number, withSeconds: boolean) {
  const s = ((Math.round(sec) % 86400) + 86400) % 86400;
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  if (!withSeconds) return `${hh}:${mm}`;
  return `${hh}:${mm}:${String(s % 60).padStart(2, '0')}`;
}

const SUMMARY = [
  { param: 'Heart Rate', short: 'HR', tone: 'hr' },
  { param: 'Resp. Rate', short: 'Resp', tone: 'resp' },
  { param: 'SpO₂', short: 'SpO₂', tone: 'spo2' },
  { param: 'Temp1', short: 'Temp', tone: 'temp' },
];

export function MonitorZoomModal({ stageIdx, params, onClose }: Props) {
  const isMobile = useIsMobile();
  const [view, setView] = useState({ spanSec: DEFAULT_SPAN_SEC, endSec: HISTORY_END_SEC });
  const [hidden, setHidden] = useState<string[]>([]);
  const [customOpen, setCustomOpen] = useState(true);
  const plotRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, number>());
  const pinchDist = useRef<number | null>(null);
  const dragX = useRef<number | null>(null);

  const lanes = useMemo(() => buildLanes(stageIdx, params), [stageIdx, params]);
  const visibleLanes = lanes.filter(l => !hidden.includes(l.key));

  const startSec = view.endSec - view.spanSec;
  const withSeconds = view.spanSec <= 120;
  const ticks = Array.from({ length: 5 }, (_, i) => startSec + (view.spanSec * i) / 4);

  const paths = useMemo(() => {
    if (!visibleLanes.length) return [];
    const band = VIEW_H / visibleLanes.length;
    return visibleLanes.map((lane, i) => ({
      key: lane.key,
      color: lane.color,
      d: envelopePath(lane.wave, startSec, view.endSec, i * band + band * 0.12, band * 0.76),
    }));
    // visibleLanes is derived from lanes + hidden, both tracked below
  }, [lanes, hidden, startSec, view.endSec]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyView = useCallback((spanSec: number, endSec: number) => {
    const span = clamp(spanSec, MIN_SPAN_SEC, HISTORY_SPAN_SEC);
    return { spanSec: span, endSec: clamp(endSec, HISTORY_START_SEC + span, HISTORY_END_SEC) };
  }, []);

  const zoomBy = useCallback(
    (factor: number) => {
      setView(v => {
        const centre = v.endSec - v.spanSec / 2;
        const span = clamp(v.spanSec * factor, MIN_SPAN_SEC, HISTORY_SPAN_SEC);
        return applyView(span, centre + span / 2);
      });
    },
    [applyView],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      zoomBy(e.deltaY > 0 ? 1.18 : 1 / 1.18);
    }
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomBy]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, e.clientX);
    const xs = [...pointers.current.values()];
    if (xs.length >= 2) {
      pinchDist.current = Math.abs(xs[0] - xs[1]);
      dragX.current = null;
    } else {
      dragX.current = e.clientX;
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, e.clientX);
    const xs = [...pointers.current.values()];
    const width = plotRef.current?.clientWidth ?? 1;

    if (xs.length >= 2) {
      const dist = Math.abs(xs[0] - xs[1]);
      if (pinchDist.current && dist > 0) zoomBy(pinchDist.current / dist);
      pinchDist.current = dist;
      return;
    }
    if (dragX.current == null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = e.clientX;
    setView(v => applyView(v.spanSec, v.endSec - (dx / width) * v.spanSec));
  }

  function endPointer(e: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    const xs = [...pointers.current.values()];
    pinchDist.current = xs.length >= 2 ? pinchDist.current : null;
    dragX.current = xs.length === 1 ? xs[0] : null;
  }

  function toggleLane(key: string) {
    setHidden(prev => {
      if (prev.includes(key)) return prev.filter(k => k !== key);
      if (prev.length >= lanes.length - 1) return prev;
      return [...prev, key];
    });
  }

  const activePreset = customOpen
    ? null
    : RANGE_PRESETS.find(p => Math.abs(p.sec - view.spanSec) < 1) ?? null;
  const minEnd = HISTORY_START_SEC + view.spanSec;
  const scrubDisabled = minEnd >= HISTORY_END_SEC;
  const windowLeft = ((startSec - HISTORY_START_SEC) / HISTORY_SPAN_SEC) * 100;
  const windowWidth = (view.spanSec / HISTORY_SPAN_SEC) * 100;
  const sliderPos = (Math.log(view.spanSec / MIN_SPAN_SEC) / Math.log(HISTORY_SPAN_SEC / MIN_SPAN_SEC)) * 100;

  return createPortal(
    <div
      className="monitor-zoom-overlay"
      role="presentation"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="monitor-zoom-modal" role="dialog" aria-modal="true" aria-labelledby="monitor-zoom-title">
        <header className="monitor-zoom-header">
          <div className="monitor-zoom-heading">
            <h3 id="monitor-zoom-title">Live Patient Monitor</h3>
            <span className="flowsheet-live-badge">
              <span className="flowsheet-live-dot" aria-hidden />
              Live
            </span>
          </div>
          <button type="button" className="monitor-zoom-close" onClick={onClose} aria-label="Close zoom view">
            ✕
          </button>
        </header>

        <div className="monitor-zoom-body">
          <div className="monitor-zoom-vitals">
            {SUMMARY.map(meta => {
              const p = params.find(x => x.param === meta.param);
              return (
                <div key={meta.param} className={`monitor-zoom-vital tone-${meta.tone}`}>
                  <span className="monitor-zoom-vital-label">{meta.short}</span>
                  <span className="monitor-zoom-vital-value">
                    {p ? p.value : '—'}
                    {p?.unit ? <small>{p.unit}</small> : null}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="monitor-zoom-chart-card">
            <div className="monitor-zoom-toolbar">
              <div className="monitor-zoom-legend">
                {lanes.map(lane => {
                  const off = hidden.includes(lane.key);
                  return (
                    <button
                      key={lane.key}
                      type="button"
                      className={`monitor-zoom-legend-item${off ? ' off' : ''}`}
                      aria-pressed={!off}
                      onClick={() => toggleLane(lane.key)}
                    >
                      <i style={{ background: lane.color }} aria-hidden />
                      {lane.label}
                    </button>
                  );
                })}
              </div>
              <div className="monitor-zoom-actions">
                <button type="button" onClick={() => zoomBy(1 / 1.5)} aria-label="Zoom in" title="Zoom in">
                  +
                </button>
                <button type="button" onClick={() => zoomBy(1.5)} aria-label="Zoom out" title="Zoom out">
                  −
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView({ spanSec: DEFAULT_SPAN_SEC, endSec: HISTORY_END_SEC });
                    setCustomOpen(true);
                    setHidden([]);
                  }}
                  aria-label="Reset zoom"
                  title="Reset zoom"
                >
                  ⟲
                </button>
              </div>
            </div>

            <div
              className="monitor-zoom-plot"
              ref={plotRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endPointer}
              onPointerCancel={endPointer}
            >
              <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" role="img" aria-label="Zoomable waveform chart">
                {ticks.map((t, i) => (
                  <line
                    key={`grid-${t}-${i}`}
                    x1={(i / 4) * VIEW_W}
                    y1={0}
                    x2={(i / 4) * VIEW_W}
                    y2={VIEW_H}
                    stroke="#eef2f8"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                {visibleLanes.map((lane, i) => (
                  <line
                    key={`band-${lane.key}`}
                    x1={0}
                    y1={((i + 1) / visibleLanes.length) * VIEW_H}
                    x2={VIEW_W}
                    y2={((i + 1) / visibleLanes.length) * VIEW_H}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                {paths.map(p => (
                  <path
                    key={p.key}
                    d={p.d}
                    fill={p.color}
                    fillOpacity={0.75}
                    stroke={p.color}
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            </div>

            <div className="monitor-zoom-times">
              {ticks.map((t, i) => (
                <span key={`tick-${t}-${i}`}>{clockLabel(t, withSeconds)}</span>
              ))}
            </div>

            <div className="monitor-zoom-ranges">
              {RANGE_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  className={`monitor-zoom-range${activePreset?.label === preset.label ? ' active' : ''}`}
                  onClick={() => {
                    setCustomOpen(false);
                    setView(v => applyView(preset.sec, v.endSec));
                  }}
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                className={`monitor-zoom-range${activePreset ? '' : ' active'}`}
                onClick={() => setCustomOpen(v => !v)}
              >
                Custom
              </button>
            </div>

            {customOpen ? (
              <label className="monitor-zoom-custom">
                <span>Window</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={sliderPos}
                  onChange={e => {
                    const ratio = Number(e.target.value) / 100;
                    const span = MIN_SPAN_SEC * (HISTORY_SPAN_SEC / MIN_SPAN_SEC) ** ratio;
                    setView(v => applyView(span, v.endSec));
                  }}
                />
                <span className="monitor-zoom-custom-value">
                  {view.spanSec < 60
                    ? `${Math.round(view.spanSec)} s`
                    : `${(view.spanSec / 60).toFixed(view.spanSec % 60 ? 1 : 0)} min`}
                </span>
              </label>
            ) : null}

            <div className="monitor-zoom-scrub">
              <span
                className="monitor-zoom-scrub-window"
                style={{ left: `${windowLeft}%`, width: `${windowWidth}%` }}
                aria-hidden
              />
              <input
                type="range"
                min={minEnd}
                max={HISTORY_END_SEC}
                step={5}
                value={view.endSec}
                disabled={scrubDisabled}
                aria-label="Pan the visible time window"
                onChange={e => setView(v => applyView(v.spanSec, Number(e.target.value)))}
              />
            </div>

            <p className="monitor-zoom-hint">
              {isMobile
                ? 'Pinch to zoom, drag to pan. Tap legend to show/hide signals.'
                : 'Scroll to zoom, drag to pan. Click legend to show/hide signals.'}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
