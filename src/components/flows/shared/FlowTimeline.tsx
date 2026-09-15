import { useEffect, useRef, type ReactElement } from 'react';
import type { FluidRow } from '../../../types';

const COL_W = 52;
const LABEL_W = 148;

type TimelineGroup = { label: string; rows: FluidRow[] };

interface Props {
  scrollId: string;
  times: string[];
  groups: TimelineGroup[];
  ariaLabel: string;
}

function TimelineTrack({ row, n, times }: { row: FluidRow; n: number; times: string[] }) {
  const nodes: ReactElement[] = [];
  const cells = row.cells;
  let i = 0;
  while (i < n) {
    const cell = cells[i];
    if (cell === 'flow') {
      let j = i;
      while (j < n && cells[j] === 'flow') j++;
      const left = i * COL_W;
      const width = (j - i) * COL_W - 4;
      nodes.push(
        <span
          key={`flow-${i}`}
          className="flow-timeline-bar flow"
          style={{ left, width }}
          title={`Infusing ${times[i]} – ${times[j - 1]}`}
        />,
      );
      i = j;
    } else if (cell === 'pause') {
      const left = i * COL_W + COL_W / 2 - 8;
      nodes.push(
        <span key={`pause-${i}`} className="flow-timeline-pause" style={{ left }} title={`Paused ${times[i]}`}>
          ⏸
        </span>,
      );
      i++;
    } else if (cell === 'value') {
      const left = i * COL_W + COL_W / 2 - 10;
      const val = row.values?.[i] ?? '•';
      nodes.push(
        <span key={`val-${i}`} className="flow-timeline-marker" style={{ left }} title={`${times[i]}: ${val}`}>
          {val}
        </span>,
      );
      i++;
    } else {
      i++;
    }
  }
  return <>{nodes}</>;
}

export function FlowTimeline({ scrollId, times, groups, ariaLabel }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const n = times.length;
  const trackW = n * COL_W;
  const innerW = LABEL_W + trackW + 12;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    });
  }, [scrollId, times.length, groups.length]);

  return (
    <div className="flow-timeline">
      <div className="flow-timeline-legend">
        <span>
          <i className="leg-flow" /> Running
        </span>
        <span>
          <i className="leg-pause" /> Paused
        </span>
        <span>
          <i className="leg-marker" /> Event / dose
        </span>
      </div>
      <div className="flow-timeline-scroll" id={scrollId} ref={scrollRef} tabIndex={0} aria-label={ariaLabel}>
        <div className="flow-timeline-inner" style={{ minWidth: innerW }}>
          <div className="flow-timeline-head">
            <div className="flow-timeline-label flow-timeline-head-spacer" style={{ width: LABEL_W }} />
            <div className="flow-timeline-times" style={{ width: trackW }}>
              {times.map(t => (
                <span key={t} className="flow-timeline-time" style={{ width: COL_W }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          {groups.map(g => (
            <div key={g.label}>
              <div className="flow-timeline-section">{g.label}</div>
              {g.rows.map(row => (
                <div className="flow-timeline-row" key={row.name}>
                  <div className="flow-timeline-label" style={{ width: LABEL_W }}>
                    {row.name}
                    {row.stayTotal ? <span className="flow-timeline-stay">{row.stayTotal}</span> : null}
                  </div>
                  <div className="flow-timeline-track" style={{ width: trackW }}>
                    <TimelineTrack row={row} n={n} times={times} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="fluids-preview-note">
        <span>Scroll left for earlier intervals · view opens at current time</span>
      </p>
    </div>
  );
}
