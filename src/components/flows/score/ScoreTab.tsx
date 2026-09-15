import { useState } from 'react';
import { PARAM_SCORES, SCORE_TYPES, type ScoreTypeMeta } from '../../../data/scores';
import { useIsMobile } from '../../../hooks/useIsMobile';
import type { ScoreData } from '../../../types';

function flattenFields(scoreId: string) {
  const score = PARAM_SCORES[scoreId];
  if (!score) return [];
  return score.sections.flatMap(sec =>
    sec.rows.map(row => ({
      sectionTitle: sec.title,
      label: sec.title,
      value: row.value,
      unit: row.unit,
      key: `${sec.title}-${row.label}`,
    })),
  );
}

function ScoreCompactCard({
  meta,
  data,
  active,
  onClick,
}: {
  meta: ScoreTypeMeta;
  data: ScoreData | undefined;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`score-select-card tone-${meta.tone}${active ? ' active' : ''}`}
      onClick={onClick}
    >
      <div className="score-select-card-top">
        <span className={`score-badge tone-${meta.tone}`}>{meta.icon}</span>
        <span className="score-select-chevron" aria-hidden>
          ›
        </span>
      </div>
      <div className="score-select-card-copy">
        <span className="score-select-name">{meta.name}</span>
        <span className="score-select-desc">{meta.description}</span>
      </div>
      <div className="score-select-card-foot">
        <div className="score-select-total">
          <span className="score-select-total-label">TOTAL</span>
          <span className="score-select-total-value">{data?.total ?? '—'}</span>
        </div>
        <div className="score-select-breakdown">{data?.breakdown ?? ''}</div>
      </div>
    </button>
  );
}

function ScoreDetailPanel({
  selectedId,
  meta,
  score,
  showAll,
  onToggleShowAll,
  calcFlash,
  savedFlash,
  onCalculate,
  onSave,
  mobileAccordion,
  onCollapse,
}: {
  selectedId: string;
  meta: ScoreTypeMeta;
  score: ScoreData;
  showAll: boolean;
  onToggleShowAll: () => void;
  calcFlash: boolean;
  savedFlash: boolean;
  onCalculate: () => void;
  onSave: () => void;
  mobileAccordion?: boolean;
  onCollapse?: () => void;
}) {
  const fields = flattenFields(selectedId);
  const primaryFields = fields.slice(0, 4);
  const extraFields = fields.slice(4);

  return (
    <div className={`scores-detail-card${mobileAccordion ? ' scores-detail-card-mobile' : ''}`}>
      <div className="scores-detail-header">
        <div className="scores-detail-title-block">
          <span className={`score-badge tone-${meta.tone}`}>{meta.icon}</span>
          <div>
            <h1>{score.title}</h1>
            <div className="subtitle">{score.subtitle}</div>
          </div>
        </div>
        {mobileAccordion ? (
          <div className="scores-mobile-expanded-actions">
            <div className="scores-detail-total scores-detail-total-inline">
              <div className="gcs-total-label">TOTAL</div>
              <div className="gcs-total-value">{score.total}</div>
            </div>
            <button type="button" className="score-mobile-collapse-btn" aria-label="Collapse" onClick={onCollapse}>
              ⌃
            </button>
            <button type="button" className="score-mobile-menu-btn" aria-label="More options" disabled>
              ⋮
            </button>
          </div>
        ) : (
          <div className="scores-detail-total">
            <div className="gcs-total-label">TOTAL</div>
            <div className="gcs-total-value">{score.total}</div>
            <div className="gcs-total-breakdown">{score.breakdown}</div>
          </div>
        )}
      </div>

      <div className="scores-body scroll-y">
        <div className="score-form-grid">
          {primaryFields.map(field => (
            <label className="score-field" key={field.key}>
              <span className="score-field-label">{field.label}</span>
              <span className="score-field-control">
                <input
                  type="text"
                  className="score-field-input"
                  defaultValue={String(field.value)}
                  key={`${selectedId}-${field.key}`}
                />
                {field.unit ? <span className="score-field-unit">{field.unit}</span> : null}
              </span>
            </label>
          ))}
        </div>

        {selectedId === 'apache2' ? (
          <div className="score-demo-block">
            <div className="score-demo-heading">Demographics option</div>
            <div className="score-form-grid">
              <label className="score-field">
                <span className="score-field-label">Ethnicity</span>
                <span className="score-field-control">
                  <select className="score-field-select" defaultValue="Asian">
                    <option>Asian</option>
                    <option>White</option>
                    <option>Black</option>
                    <option>Other</option>
                  </select>
                </span>
              </label>
              <label className="score-field">
                <span className="score-field-label">Admission type</span>
                <span className="score-field-control">
                  <select className="score-field-select" defaultValue="Elective">
                    <option>Elective</option>
                    <option>Emergency</option>
                    <option>Urgent</option>
                  </select>
                </span>
              </label>
            </div>
          </div>
        ) : null}

        {extraFields.length > 0 || selectedId === 'apache2' ? (
          <>
            <button
              type="button"
              className={`score-expand-row${showAll ? ' open' : ''}`}
              onClick={onToggleShowAll}
            >
              <span>Show all {score.title} parameters</span>
              <span className="score-expand-chevron" aria-hidden>
                ›
              </span>
            </button>
            {showAll ? (
              <div className="score-form-grid score-form-grid-extra">
                {(extraFields.length > 0 ? extraFields : primaryFields).map(field => (
                  <label className="score-field" key={`extra-${field.key}`}>
                    <span className="score-field-label">{field.label}</span>
                    <span className="score-field-control">
                      <input type="text" className="score-field-input" defaultValue={String(field.value)} />
                      {field.unit ? <span className="score-field-unit">{field.unit}</span> : null}
                    </span>
                  </label>
                ))}
              </div>
            ) : null}
          </>
        ) : null}

        {(calcFlash || savedFlash) && (
          <div className="score-feedback" role="status">
            {calcFlash ? `Calculated ${score.title}: total ${score.total}` : null}
            {savedFlash ? `${score.title} score saved` : null}
          </div>
        )}
      </div>

      <div className="scores-footer">
        <button type="button" className="btn btn-primary" onClick={onCalculate}>
          Calculate
        </button>
        <button type="button" className="btn btn-secondary" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export function ScoreTab() {
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = useState('apache2');
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [calcFlash, setCalcFlash] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const meta = SCORE_TYPES.find(s => s.id === selectedId) ?? SCORE_TYPES[0];
  const score = PARAM_SCORES[selectedId];

  function handleCalculate() {
    setCalcFlash(true);
    window.setTimeout(() => setCalcFlash(false), 1200);
  }

  function handleSave() {
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1200);
  }

  function openMobileScore(id: string) {
    setSelectedId(id);
    setShowAll(false);
    setMobileExpandedId(prev => (prev === id ? null : id));
  }

  function selectDesktopScore(id: string) {
    setSelectedId(id);
    setShowAll(false);
  }

  const detailProps =
    score && meta
      ? {
          selectedId,
          meta,
          score,
          showAll,
          onToggleShowAll: () => setShowAll(v => !v),
          calcFlash,
          savedFlash,
          onCalculate: handleCalculate,
          onSave: handleSave,
        }
      : null;

  return (
    <div className="scores-shell scores-shell-redesign">
      <aside className="scores-panel scores-panel-cards">
        <div className="scores-panel-header">
          <h2>Scores</h2>
        </div>
        <div className="score-count-line">{SCORE_TYPES.length} score types</div>

        {isMobile ? (
          <div className="score-card-list scroll-y score-card-list-mobile">
            {SCORE_TYPES.map(s => {
              const data = PARAM_SCORES[s.id];
              const expanded = mobileExpandedId === s.id;

              if (expanded && detailProps && s.id === selectedId) {
                return (
                  <div key={s.id} className="score-mobile-expanded-slot">
                    <ScoreDetailPanel
                      {...detailProps}
                      mobileAccordion
                      onCollapse={() => setMobileExpandedId(null)}
                    />
                  </div>
                );
              }

              return (
                <ScoreCompactCard
                  key={s.id}
                  meta={s}
                  data={data}
                  active={selectedId === s.id}
                  onClick={() => openMobileScore(s.id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="score-card-list scroll-y">
            {SCORE_TYPES.map(s => {
              const data = PARAM_SCORES[s.id];
              return (
                <ScoreCompactCard
                  key={s.id}
                  meta={s}
                  data={data}
                  active={selectedId === s.id}
                  onClick={() => selectDesktopScore(s.id)}
                />
              );
            })}
          </div>
        )}
      </aside>

      {!isMobile ? (
        <div className="scores-main scores-main-redesign">
          {detailProps ? (
            <ScoreDetailPanel {...detailProps} />
          ) : (
            <div className="scores-placeholder">Select a score to begin</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
