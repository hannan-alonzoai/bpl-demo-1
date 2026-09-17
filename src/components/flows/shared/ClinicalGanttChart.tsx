import { useEffect, useState, type CSSProperties } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';

export const GANTT_LABEL_W = 160;
export const GANTT_TRACK_W = 720;
/** Space after the timeline for dose/rate labels (right of bars) */
export const GANTT_TRACK_VALUE_GUTTER = 96;

/** Side-by-side Record layout — narrowest the track may get before it scrolls; it grows to fill wider cards */
export const GANTT_COMPACT_LABEL_W = 148;
export const GANTT_COMPACT_TRACK_W = 440;
export const GANTT_COMPACT_TRACK_VALUE_GUTTER = 76;

function ganttDims(compact: boolean) {
  return compact
    ? {
        labelW: GANTT_COMPACT_LABEL_W,
        trackW: GANTT_COMPACT_TRACK_W,
        gutter: GANTT_COMPACT_TRACK_VALUE_GUTTER,
      }
    : { labelW: GANTT_LABEL_W, trackW: GANTT_TRACK_W, gutter: GANTT_TRACK_VALUE_GUTTER };
}
const CHART_START_MIN = 17 * 60;
const CHART_END_MIN = 20 * 60;
const CHART_SPAN = CHART_END_MIN - CHART_START_MIN;

export const GANTT_TIME_TICKS = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];

export type GanttSegment = {
  startMin: number;
  endMin: number;
  label: string;
  labelPosition?: 'on-bar' | 'below' | 'right';
};

export type GanttRow = {
  id: string;
  name: string;
  barClass: string;
  legendClass: string;
  segments: GanttSegment[];
};

export type GanttSection = {
  title: string;
  rows: GanttRow[];
};

function pct(min: number) {
  return ((min - CHART_START_MIN) / CHART_SPAN) * 100;
}

function formatGanttClock(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Hover tooltip: segment window on the timeline (volume/dose stays on the chart labels). */
function segmentTimeRange(seg: GanttSegment) {
  return `${formatGanttClock(seg.startMin)} – ${formatGanttClock(seg.endMin)}`;
}

function SegmentBar({ seg, barClass }: { seg: GanttSegment; barClass: string }) {
  const left = pct(seg.startMin);
  const width = pct(seg.endMin) - left;
  const pos = seg.labelPosition ?? 'on-bar';

  return (
    <div className="fluids-gantt-segment-wrap" style={{ left: `${left}%`, width: `${width}%` }}>
      <div className={`fluids-gantt-bar ${barClass}`} title={segmentTimeRange(seg)}>
        {pos === 'on-bar' ? <span className="fluids-gantt-bar-label">{seg.label}</span> : null}
      </div>
      {pos === 'below' ? <span className="fluids-gantt-bar-label fluids-gantt-bar-label--below">{seg.label}</span> : null}
      {pos === 'right' ? <span className="fluids-gantt-bar-label fluids-gantt-bar-label--right">{seg.label}</span> : null}
    </div>
  );
}

function GanttRowView({ row }: { row: GanttRow }) {
  const hasBelowLabel = row.segments.some(s => s.labelPosition === 'below');

  return (
    <div className={`fluids-gantt-row${hasBelowLabel ? ' fluids-gantt-row--below-labels' : ''}`}>
      <div className="fluids-gantt-label">
        <span className="fluids-gantt-label-name">{row.name}</span>
      </div>
      <div className="fluids-gantt-track">
        <div className="fluids-gantt-grid-lines" aria-hidden="true">
          {GANTT_TIME_TICKS.map(t => (
            <span key={t} className="fluids-gantt-grid-line" />
          ))}
        </div>
        {row.segments.map((seg, i) => (
          <SegmentBar key={`${row.id}-${i}`} seg={seg} barClass={row.barClass} />
        ))}
      </div>
    </div>
  );
}

interface Props {
  sections: GanttSection[];
  ariaLabel: string;
  /** Narrower chart for two-column Record layout (default). */
  compact?: boolean;
}

/** Hour marks only — half-hour labels do not fit a phone-width track. */
const COMPACT_TICKS = GANTT_TIME_TICKS.filter(t => t.endsWith(':00'));

/** Dose / rate values move under the row name when bars are too narrow to carry labels. */
function segmentSummary(row: GanttRow) {
  return row.segments
    .map(s => s.label)
    .filter(Boolean)
    .join(' · ');
}

function CompactGantt({ sections, ariaLabel }: Props) {
  const legendRows = sections.flatMap(s => s.rows);
  const lastTick = COMPACT_TICKS.length - 1;
  const [activeBar, setActiveBar] = useState<string | null>(null);

  useEffect(() => {
    if (!activeBar) return;
    const dismiss = (e: MouseEvent | TouchEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('.gantt-c-bar')) setActiveBar(null);
    };
    document.addEventListener('touchstart', dismiss, { passive: true });
    document.addEventListener('click', dismiss);
    return () => {
      document.removeEventListener('touchstart', dismiss);
      document.removeEventListener('click', dismiss);
    };
  }, [activeBar]);

  return (
    <div className="gantt-c" aria-label={ariaLabel}>
      <div className="gantt-c-head">
        <div className="gantt-c-head-track">
          {COMPACT_TICKS.map((t, i) => (
            <span
              key={t}
              className="gantt-c-time"
              style={{
                left: `${(i / lastTick) * 100}%`,
                transform: i === 0 ? 'none' : i === lastTick ? 'translateX(-100%)' : 'translateX(-50%)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {sections.map(section => (
        <div className="gantt-c-section" key={section.title}>
          <div className="gantt-c-section-title">{section.title}</div>
          {section.rows.map(row => (
            <div className="gantt-c-row" key={row.id}>
              <div className="gantt-c-label">
                <span className="gantt-c-name">{row.name}</span>
                <span className="gantt-c-sub">{segmentSummary(row)}</span>
              </div>
              <div className="gantt-c-track">
                <div className="gantt-c-grid" aria-hidden="true">
                  {COMPACT_TICKS.map((t, i) => (
                    <span key={t} className="gantt-c-grid-line" style={{ left: `${(i / lastTick) * 100}%` }} />
                  ))}
                </div>
                {row.segments.map((seg, i) => {
                  const left = pct(seg.startMin);
                  const barKey = `${row.id}-${i}`;
                  const tip = segmentTimeRange(seg);
                  return (
                    <span
                      key={barKey}
                      className={`gantt-c-bar ${row.barClass}${activeBar === barKey ? ' show-tip' : ''}`}
                      style={{ left: `${left}%`, width: `${pct(seg.endMin) - left}%` }}
                      data-tip={tip}
                      role="button"
                      tabIndex={0}
                      aria-label={`${row.name}, ${tip}`}
                      onClick={e => {
                        e.stopPropagation();
                        setActiveBar(prev => (prev === barKey ? null : barKey));
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveBar(prev => (prev === barKey ? null : barKey));
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="gantt-c-legend">
        {legendRows.map(row => (
          <span key={row.id} className="gantt-c-legend-item">
            <i className={row.legendClass} aria-hidden="true" />
            {row.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ClinicalGanttChart({ sections, ariaLabel, compact = true }: Props) {
  const isMobile = useIsMobile();
  const legendRows = sections.flatMap(s => s.rows);
  const { labelW, trackW, gutter } = ganttDims(compact && !isMobile);

  if (isMobile) {
    return <CompactGantt sections={sections} ariaLabel={ariaLabel} />;
  }

  const ganttVars = {
    '--gantt-label-w': `${labelW}px`,
    '--gantt-track-w': `${trackW}px`,
    '--gantt-gutter': `${gutter}px`,
  } as CSSProperties;

  return (
    <div className="fluids-gantt" style={ganttVars}>
      <div className="fluids-gantt-scroll" tabIndex={0} aria-label={ariaLabel}>
        <div className="fluids-gantt-inner">
          <div className="fluids-gantt-head">
            <div className="fluids-gantt-label fluids-gantt-head-spacer" />
            <div className="fluids-gantt-times">
              {GANTT_TIME_TICKS.map(t => (
                <span key={t} className="fluids-gantt-time">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {sections.map(section => (
            <div key={section.title}>
              <div className="fluids-gantt-section">{section.title}</div>
              {section.rows.map(row => (
                <GanttRowView key={row.id} row={row} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="fluids-gantt-legend">
        {legendRows.map(row => (
          <span key={row.id} className="fluids-gantt-legend-item">
            <i className={row.legendClass} aria-hidden="true" />
            {row.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Minutes helper: hours and minutes from 17:00 chart origin day time */
export function ganttMin(h: number, m: number) {
  return h * 60 + m;
}
