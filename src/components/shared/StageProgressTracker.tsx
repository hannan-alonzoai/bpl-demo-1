import { useEffect, useRef } from 'react';
import type { OrStage } from '../../types';

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M3 8.5l3.5 3.5 6.5-7" />
    </svg>
  );
}

function stageNodeClass(i: number, currentIndex: number, viewIndex: number) {
  const nextIdx = currentIndex + 1;
  let cls = 'ot-stage-node';
  if (i > nextIdx) cls += ' locked';
  else if (i === nextIdx) cls += ' next';
  else if (i < currentIndex) cls += ' done';
  else if (i === currentIndex) cls += ' current';
  if (i === viewIndex && viewIndex !== currentIndex) cls += ' viewing';
  return cls;
}

interface Props {
  stages: OrStage[];
  currentIndex: number;
  viewIndex?: number;
  onRequestAdvance: (nextIndex: number) => void;
  onViewStageChange?: (idx: number) => void;
  /** Narrow viewports: 4-stage window + scroll anchor (board mobile / flowsheet mobile). */
  mobileCompact?: boolean;
  /** Surgery schedule detail: denser rail beside intake summary. */
  boardCompact?: boolean;
}

export function StageProgressTracker({
  stages,
  currentIndex,
  viewIndex = currentIndex,
  onRequestAdvance,
  onViewStageChange,
  mobileCompact,
  boardCompact,
}: Props) {
  const trackerRef = useRef<HTMLDivElement>(null);
  const nextIdx = currentIndex + 1;
  const progressPct =
    stages.length <= 1 ? 0 : (Math.min(currentIndex, stages.length - 1) / (stages.length - 1)) * 100;

  useEffect(() => {
    if (!mobileCompact) return;
    const wrap = trackerRef.current;
    const node = wrap?.querySelectorAll<HTMLElement>('.ot-stage-node')[currentIndex];
    if (!wrap || !node) return;
    wrap.scrollTo({ left: node.offsetLeft, behavior: 'smooth' });
  }, [mobileCompact, currentIndex, stages.length]);

  function onStageClick(targetIdx: number) {
    if (targetIdx > nextIdx) return;
    if (targetIdx === nextIdx) {
      onRequestAdvance(targetIdx);
      return;
    }
    onViewStageChange?.(targetIdx);
  }

  const wrapClass = [
    'ot-stage-tracker-wrap',
    mobileCompact && 'ot-stage-tracker-wrap--compact',
    boardCompact && 'ot-stage-tracker-wrap--board',
  ]
    .filter(Boolean)
    .join(' ');

  const nodeWidth = boardCompact ? 62 : mobileCompact ? 76 : 88;
  const minTrack = boardCompact ? 360 : 520;
  const trackMinWidth = Math.max(minTrack, stages.length * nodeWidth);

  return (
    <div className={wrapClass} ref={trackerRef}>
      <div
        className="ot-stage-tracker"
        role="list"
        aria-label="OT stage progress"
        style={{ minWidth: trackMinWidth }}
      >
        {!mobileCompact ? (
          <div className="ot-stage-track" aria-hidden>
            <div className="ot-stage-track-fill" style={{ width: `${progressPct}%` }} />
          </div>
        ) : null}
        {stages.map((s, i) => {
          const cls = stageNodeClass(i, currentIndex, viewIndex);
          const locked = i > nextIdx;
          const isNext = i === nextIdx && nextIdx < stages.length;
          const isCurrent = i === currentIndex;
          const title = isNext ? `Proceed to ${s.name}` : s.desc;

          const content = (
            <>
              <span className="ot-stage-marker">
                {i < currentIndex ? <CheckIcon /> : <span className="ot-stage-num">{i + 1}</span>}
              </span>
              <span className="ot-stage-name">{s.name}</span>
              <span className="ot-stage-time">{s.time}</span>
              {isCurrent ? <span className="ot-stage-badge current">Current</span> : null}
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
  );
}
