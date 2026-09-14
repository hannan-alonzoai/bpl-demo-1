import { useEffect } from 'react';
import type { BoardLayoutOption } from '../../data/boardLayouts';
import { demoUrlForLayout } from '../../data/boardLayouts';

interface LayoutPreviewOverlayProps {
  layout: BoardLayoutOption;
  onClose: () => void;
}

export function LayoutPreviewOverlay({ layout, onClose }: LayoutPreviewOverlayProps) {
  const src = demoUrlForLayout(layout);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="layout-preview" role="dialog" aria-modal="true" aria-label={`Preview: ${layout.name}`}>
      <div className="layout-preview-bar">
        <button type="button" className="layout-preview-close" onClick={onClose} aria-label="Close preview">
          ×
        </button>
        <div className="layout-preview-title">
          <strong>{layout.name}</strong>
          <span>{layout.shortLabel} · standalone HTML demo</span>
        </div>
        <a className="layout-preview-tab" href={src} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
      </div>
      <iframe className="layout-preview-frame" src={src} title={layout.name} />
    </div>
  );
}
