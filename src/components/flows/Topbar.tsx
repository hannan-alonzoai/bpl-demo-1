import { useNavigate } from 'react-router-dom';

interface Props {
  mobile?: boolean;
}

export function Topbar({ mobile }: Props) {
  const navigate = useNavigate();

  return (
    <header className={`topbar${mobile ? ' topbar-mobile' : ''}`}>
      <div className="topbar-left">
        {!mobile ? (
          <button type="button" className="topbar-back" onClick={() => navigate('/board')}>
            ← Back
          </button>
        ) : null}
        <div className="topbar-brand">
          <img src="/assets/bpl-cortex-ot-logo.png" alt="BPL Cortex OT" className="topbar-logo" />
          {mobile ? <span className="topbar-mobile-title">BPL Cortex OT</span> : null}
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
