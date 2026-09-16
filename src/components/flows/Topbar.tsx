import { useNavigate } from 'react-router-dom';

function TopbarBackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Props {
  mobile?: boolean;
}
export function Topbar({ mobile }: Props) {
  const navigate = useNavigate();

  return (
    <header className={`topbar${mobile ? ' topbar-mobile' : ''}`}>
      <div className="topbar-left">
        <button
          type="button"
          className={`topbar-back${mobile ? ' topbar-back-mobile' : ''}`}
          onClick={() => navigate('/board')}
          aria-label="Back to surgery schedule"
        >
          {mobile ? (
            <span className="topbar-back-arrow-only" aria-hidden>
              ←
            </span>
          ) : (
            <>
              <span className="topbar-back-icon">
                <TopbarBackIcon />
              </span>
              <span className="topbar-back-label">Back</span>
            </>
          )}
        </button>
        <div className="topbar-brand">
          <img src="/assets/bpl-cortex-ot-logo.png" alt="BPL Cortex OT" className="topbar-logo" />
        </div>
        {!mobile ? (
          <div className="active-suite">
            <span className="status-dot" />
            OT Flows Suite
          </div>
        ) : null}
      </div>
      <div className="topbar-user">
        <div className="avatar">JJ</div>
        {!mobile ? <span className="topbar-user-name">Dr. Jacob Jenner</span> : null}
      </div>
    </header>
  );
}
