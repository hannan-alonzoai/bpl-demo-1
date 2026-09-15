export const GANTT_LABEL_W = 160;
export const GANTT_TRACK_W = 720;
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

function SegmentBar({ seg, barClass }: { seg: GanttSegment; barClass: string }) {
  const left = pct(seg.startMin);
  const width = pct(seg.endMin) - left;
  const pos = seg.labelPosition ?? 'on-bar';

  return (
    <div className="fluids-gantt-segment-wrap" style={{ left: `${left}%`, width: `${width}%` }}>
      <div className={`fluids-gantt-bar ${barClass}`} title={seg.label}>
        {pos === 'on-bar' ? <span className="fluids-gantt-bar-label">{seg.label}</span> : null}
      </div>
      {pos === 'below' ? <span className="fluids-gantt-bar-label fluids-gantt-bar-label--below">{seg.label}</span> : null}
      {pos === 'right' ? <span className="fluids-gantt-bar-label fluids-gantt-bar-label--right">{seg.label}</span> : null}
    </div>
  );
}

function GanttRowView({ row }: { row: GanttRow }) {
  return (
    <div className="fluids-gantt-row">
      <div className="fluids-gantt-label" style={{ width: GANTT_LABEL_W }}>
        <span className="fluids-gantt-label-name">{row.name}</span>
      </div>
      <div className="fluids-gantt-track" style={{ width: GANTT_TRACK_W }}>
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
}

export function ClinicalGanttChart({ sections, ariaLabel }: Props) {
  const legendRows = sections.flatMap(s => s.rows);

  return (
    <div className="fluids-gantt">
      <div className="fluids-gantt-scroll" tabIndex={0} aria-label={ariaLabel}>
        <div className="fluids-gantt-inner" style={{ minWidth: GANTT_LABEL_W + GANTT_TRACK_W + 16 }}>
          <div className="fluids-gantt-head">
            <div className="fluids-gantt-label fluids-gantt-head-spacer" style={{ width: GANTT_LABEL_W }} />
            <div className="fluids-gantt-times" style={{ width: GANTT_TRACK_W }}>
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
