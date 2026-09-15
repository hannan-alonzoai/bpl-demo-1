import type { DetailVital, ViewMode } from '../../../types';
import { scheduleClassify } from './scheduleUtils';

/** Patient vitals in detail panel — matches index4.html geometry and coloring. */
export function ScheduleVitalRings({ items }: { items: DetailVital[] }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <div className="gauge-row">
      {items.map(g => {
        const pct = Math.max(0, Math.min(1, g.v / g.max));
        const offset = c - pct * c;
        const vclass = scheduleClassify(g.key, g.v);
        return (
          <div className="gauge" key={g.l}>
            <svg viewBox="0 0 56 56">
              <g transform="rotate(-90 28 28)">
                <circle className="ring-bg" cx="28" cy="28" r={r} />
                <circle
                  className={`ring-fg ${vclass}`}
                  cx="28"
                  cy="28"
                  r={r}
                  strokeDasharray={c}
                  strokeDashoffset={offset}
                />
              </g>
              <text x="28" y="28" textAnchor="middle" dominantBaseline="central" className="gauge-num">
                {g.v}
              </text>
            </svg>
            <div className="g-label">{g.l}</div>
            <div className="g-unit">{g.u}</div>
          </div>
        );
      })}
    </div>
  );
}

export function ScheduleVitalBars({ items }: { items: DetailVital[] }) {
  return (
    <div className="bar-list">
      {items.map(g => {
        const pct = Math.max(2, Math.min(100, (g.v / g.max) * 100));
        const vclass = scheduleClassify(g.key, g.v);
        return (
          <div className="bar-row" key={g.l}>
            <span className="bar-label">{g.l}</span>
            <div className="bar-track">
              <div className={`bar-fill ${vclass}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`bar-value ${vclass}`}>
              {g.v} <small>{g.u}</small>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ScheduleVitalNumbers({ items }: { items: DetailVital[] }) {
  return (
    <div className="num-grid">
      {items.map(g => {
        const vclass = scheduleClassify(g.key, g.v);
        return (
          <div className="num-item" key={g.l}>
            <span className="num-label">{g.l}</span>
            <span className={`num-value ${vclass}`}>
              {g.v}
              <small>{g.u}</small>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ScheduleVitalGroup({ items, view }: { items: DetailVital[]; view: ViewMode }) {
  if (view === 'bars') return <ScheduleVitalBars items={items} />;
  if (view === 'numbers') return <ScheduleVitalNumbers items={items} />;
  return <ScheduleVitalRings items={items} />;
}
