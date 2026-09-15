import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button type="button" className="topbar-back" onClick={() => navigate('/board')}>
          ← Back
        </button>
        <div className="topbar-brand">
          <img src="/assets/bpl-cortex-ot-logo.png" alt="BPL Cortex OT" className="topbar-logo" />
        </div>
        <div className="active-suite">
          <span className="status-dot" />
          OT Flows Suite
        </div>
      </div>
      <div className="topbar-user">
        <div className="avatar">JJ</div>
        Dr. Jacob Jenner
      </div>
    </header>
  );
}
