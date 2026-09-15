import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function BoardHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    logout();
    navigate('/login');
  }

  return (
    <header className="dash-header">
      <div className="brand">
        <img src="/assets/bpl-cortex-ot-logo.png" alt="BPL Cortex OT" className="dash-logo" />
        <div className="title">BPL Cortex OT · Monitoring Dashboard</div>
      </div>
      <div className="header-right">
        <button type="button" className="signout" onClick={handleSignOut}>Sign out</button>
      </div>
    </header>
  );
}
