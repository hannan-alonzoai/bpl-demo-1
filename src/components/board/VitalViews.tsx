import type { DetailVital, ViewMode } from '../../types';
import { classify } from '../../utils/classify';

export function VitalRings({ items }: { items: DetailVital[] }) {
  return (
    <div className="gauge-row">
      {items.map(g => {
        const r = 24;
        const c = 2 * Math.PI * r;
        const pct = Math.max(0, Math.min(1, g.v / g.max));
        const offset = c - pct * c;
        const vclass = classify(g.key, g.v);
        return (
          <div className="gauge" key={g.l}>
            <svg viewBox="0 0 60 60">
              <g transform="rotate(-90 30 30)">
                <circle className="ring-bg" cx="30" cy="30" r={r} />
                <circle className={`ring-fg ${vclass}`} cx="30" cy="30" r={r} strokeDasharray={c} strokeDashoffset={offset} />
              </g>
              <text x="30" y="30" textAnchor="middle" dominantBaseline="central" className="gauge-num">{g.v}</text>
            </svg>
            <div className="g-label">{g.l}</div>
            <div className="g-unit">{g.u}</div>
          </div>
        );
      })}
    </div>
  );
}

export function VitalBars({ items }: { items: DetailVital[] }) {
  return (
    <div className="bar-list">
      {items.map(g => {
        const pct = Math.max(2, Math.min(100, (g.v / g.max) * 100));
        const vclass = classify(g.key, g.v);
        return (
          <div className="bar-row" key={g.l}>
            <span className="bar-label">{g.l}</span>
            <div className="bar-track"><div className={`bar-fill ${vclass}`} style={{ width: `${pct}%` }} /></div>
            <span className={`bar-value ${vclass}`}>{g.v} <small>{g.u}</small></span>
          </div>
        );
      })}
    </div>
  );
}

export function VitalNumbers({ items }: { items: DetailVital[] }) {
  return (
    <div className="num-grid">
      {items.map(g => {
        const vclass = classify(g.key, g.v);
        return (
          <div className="num-item" key={g.l}>
            <span className="num-label">{g.l}</span>
            <span className={`num-value ${vclass}`}>{g.v}<small>{g.u}</small></span>
          </div>
        );
      })}
    </div>
  );
}

export function VitalGroup({ items, view }: { items: DetailVital[]; view: ViewMode }) {
  if (view === 'bars') return <VitalBars items={items} />;
  if (view === 'numbers') return <VitalNumbers items={items} />;
  return <VitalRings items={items} />;
}
