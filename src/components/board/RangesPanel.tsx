import { RANGES } from '../../data/ranges';

interface Props {
  open: boolean;
}

export function RangesPanel({ open }: Props) {
  const rows = Object.values(RANGES);

  return (
    <div className={`ranges-panel${open ? ' open' : ''}`}>
      <div className="ranges-card">
        <h3>Clinical reference ranges</h3>
        <p className="ranges-sub">Values used to colour-code every reading on the dashboard.</p>
        <table className="ranges-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Low</th>
              <th>Base / Normal range</th>
              <th>Average / Typical</th>
              <th>High</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.label}>
                <td className="param">{r.label}</td>
                <td className="low">{r.low}</td>
                <td className="base">{r.base}</td>
                <td>{r.avg}</td>
                <td className="high">{r.high}</td>
                <td>{r.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ranges-legend">
          <span><i style={{ background: 'var(--typical)' }} />Typical deviation</span>
          <span><i style={{ background: 'var(--normal)' }} />Normal</span>
          <span><i style={{ background: 'var(--critical)' }} />Critical</span>
        </div>
        <div className="ranges-foot">
          Heart rate 40–60 bpm is read as bradycardia (orange); 40 bpm or below is severe bradycardia (red).
        </div>
      </div>
    </div>
  );
}
