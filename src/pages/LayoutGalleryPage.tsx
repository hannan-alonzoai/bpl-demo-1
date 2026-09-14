import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LayoutPreviewOverlay } from '../components/layouts/LayoutPreviewOverlay';
import { BOARD_LAYOUTS, boardLayoutById, type BoardLayoutOption } from '../data/boardLayouts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/board.css';
import '../styles/layout-gallery.css';

export function LayoutGalleryPage() {
  const { layoutId } = useParams<{ layoutId?: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [preview, setPreview] = useState<BoardLayoutOption | null>(null);

  const openPreview = useCallback((layout: BoardLayoutOption) => {
    setPreview(layout);
    navigate(`/layouts/${layout.id}`, { replace: true });
  }, [navigate]);

  const closePreview = useCallback(() => {
    setPreview(null);
    navigate('/layouts', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!layoutId) {
      setPreview(null);
      return;
    }
    const layout = boardLayoutById(layoutId);
    if (layout) setPreview(layout);
    else navigate('/layouts', { replace: true });
  }, [layoutId, navigate]);

  function handleSignOut() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <div className="top-strip" />
      <header className="dash-header">
        <div className="brand">
          <img src="/assets/bpl-cortex-ot-logo.png" alt="BPL Cortex OT" className="dash-logo" />
          <div className="title">BPL Cortex OT · Board layout gallery</div>
        </div>
        <div className="header-right">
          <Link to="/board" className="layout-gallery-nav-link">
            React board
          </Link>
          <div className="theme-toggle" title="Light / dark theme">
            <button type="button" className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☀</button>
            <button type="button" className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>☾</button>
          </div>
          <button type="button" className="signout" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      <div className="dash-body layout-gallery-body">
        <div className="layout-gallery-intro">
          <h1>Choose a monitoring layout</h1>
          <p>Select a prototype to preview the standalone HTML demo full screen. The live React app uses the compact grid on <Link to="/board">/board</Link>.</p>
        </div>
        <div className="layout-gallery-grid">
          {BOARD_LAYOUTS.map(layout => (
            <button
              key={layout.id}
              type="button"
              className="layout-picker-card"
              onClick={() => openPreview(layout)}
            >
              <span className="layout-picker-badge">{layout.shortLabel}</span>
              <span className="layout-picker-name">{layout.name}</span>
              <span className="layout-picker-desc">{layout.description}</span>
              <span className="layout-picker-action">Preview layout →</span>
            </button>
          ))}
        </div>
      </div>

      {preview && <LayoutPreviewOverlay layout={preview} onClose={closePreview} />}
    </>
  );
}
