import { useState } from 'react';
import { BoardHeader } from '../components/board/BoardHeader';
import { OTGrid } from '../components/board/OTGrid';
import { RangesPanel } from '../components/board/RangesPanel';
import type { ViewMode } from '../types';
import '../styles/board.css';

export function BoardPage() {
  const [view, setView] = useState<ViewMode>('rings');
  const [rangesOpen, setRangesOpen] = useState(false);

  return (
    <>
      <div className="top-strip" />
      <div id="dashboard-screen" style={{ display: 'block' }}>
        <BoardHeader />
        <div className="dash-body">
          <div className="toolbar">
            <span className="toolbar-label">Vitals display</span>
            <div className="toolbar-right">
              <button type="button" className={`ranges-btn${rangesOpen ? ' active' : ''}`} onClick={() => setRangesOpen(o => !o)}>
                ℹ Reference ranges
              </button>
              <div className="view-toggle">
                <button type="button" className={view === 'rings' ? 'active' : ''} onClick={() => setView('rings')}>Rings</button>
                <button type="button" className={view === 'bars' ? 'active' : ''} onClick={() => setView('bars')}>Bars</button>
                <button type="button" className={view === 'numbers' ? 'active' : ''} onClick={() => setView('numbers')}>Numbers</button>
              </div>
            </div>
          </div>
          <RangesPanel open={rangesOpen} />
          <OTGrid view={view} />
        </div>
      </div>
    </>
  );
}
