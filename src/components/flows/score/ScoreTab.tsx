import { useState } from 'react';
import { PARAM_SCORES, SCORE_TYPES } from '../../../data/scores';

export function ScoreTab() {
  const [selectedId, setSelectedId] = useState('apache2');
  const score = PARAM_SCORES[selectedId];

  return (
    <div className="scores-shell">
      <aside className="scores-panel">
        <div className="scores-panel-header">
          <h2>Scores</h2>
          <div className="score-count">{SCORE_TYPES.length} score types</div>
        </div>
        <div className="score-list scroll-y">
          {SCORE_TYPES.map(s => (
            <button
              key={s.id}
              type="button"
              className={`score-list-item${selectedId === s.id ? ' active' : ''}`}
              onClick={() => setSelectedId(s.id)}
            >
              <span className="score-list-icon">{s.icon}</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </aside>
      <div className="scores-main">
        {score && (
          <div className="scores-form-sheet">
            <div className="scores-header">
              <div>
                <h1>{score.title}</h1>
                <div className="subtitle">{score.subtitle}</div>
              </div>
              <div className="gcs-total">
                <div>
                  <div className="gcs-total-label">Total</div>
                  <div className="gcs-total-value">{score.total}</div>
                </div>
                <div className="gcs-total-breakdown">{score.breakdown}</div>
              </div>
            </div>
            <div className="scores-body scroll-y">
              {score.sections.map(sec => (
                <div className="score-block" key={sec.title}>
                  <div className="score-block-title">{sec.title}</div>
                  <table className="param-table">
                    <thead>
                      <tr><th>{sec.col1}</th><th>{sec.col2}</th></tr>
                    </thead>
                    <tbody>
                      {sec.rows.map(row => (
                        <tr key={row.label}>
                          <td>{row.label}</td>
                          <td>
                            <input type="text" className="param-input" defaultValue={String(row.value)} />
                            {row.unit ? <span className="param-unit">{row.unit}</span> : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            <div className="scores-footer">
              <button type="button" className="btn btn-primary">Calculate</button>
              <button type="button" className="btn btn-secondary">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
