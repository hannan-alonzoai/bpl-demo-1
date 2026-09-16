import { useNavigate } from 'react-router-dom';

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
          {mobile ? '←' : '← Back'}
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
