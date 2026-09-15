import { SCHEDULE_STAGES } from './scheduleUtils';

interface Props {
  currentIndex: number;
  onRequestAdvance: (nextIndex: number) => void;
  /** Drop already-completed stages, leaving the current one and what's still ahead. */
  upcomingOnly?: boolean;
}

export function StageQuickActions({ currentIndex, onRequestAdvance, upcomingOnly }: Props) {
  const nextIndex = currentIndex + 1;
  const canAdvance = nextIndex < SCHEDULE_STAGES.length;
  const visibleStages = upcomingOnly
    ? SCHEDULE_STAGES.map((s, i) => ({ s, i })).filter(({ i }) => i >= currentIndex)
    : SCHEDULE_STAGES.map((s, i) => ({ s, i }));

  return (
    <div className="detail-stages">
      <div className="detail-stages-label">Quick actions · case stages</div>
      <div className="stage-boxes-wrap">
        <div className="stage-boxes">
          {visibleStages.map(({ s, i }) => {
            let cls = '';
            if (i < currentIndex) cls = ' done';
            else if (i === currentIndex) cls = ' current';

            if (canAdvance && i === nextIndex) {
              return (
                <button
                  type="button"
                  key={s.id}
                  className={`stage-box next${cls}`}
                  title={`Proceed to ${s.name}`}
                  onClick={() => onRequestAdvance(i)}
                >
                  <span className="stage-box-num">{i + 1}</span>
                  <span className="stage-box-name">{s.short}</span>
                  <span className="stage-box-time">{s.time}</span>
                </button>
              );
            }

            return (
              <div className={`stage-box${cls}`} key={s.id} title={s.name}>
                <span className="stage-box-num">{i + 1}</span>
                <span className="stage-box-name">{s.short}</span>
                <span className="stage-box-time">{s.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
