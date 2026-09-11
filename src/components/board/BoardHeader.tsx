import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function BoardHeader() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  function handleSignOut() {
    logout();
    navigate('/login');
  }

  return (
    <header className="dash-header">
      <div className="brand">
        <div className="company">BPL Medical Technologies</div>
        <div className="title">BPL Cortex OT · Monitoring Dashboard</div>
      </div>
      <div className="header-right">
        <div className="theme-toggle" title="Light / dark theme">
          <button type="button" className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☀</button>
          <button type="button" className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>☾</button>
        </div>
        <button type="button" className="signout" onClick={handleSignOut}>Sign out</button>
      </div>
    </header>
  );
}
