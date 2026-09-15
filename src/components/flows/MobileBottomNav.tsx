import type { FlowTab } from '../../types';

interface Props {
  active: FlowTab;
  onChange: (tab: FlowTab) => void;
}

const ITEMS: { id: FlowTab; label: string; icon: 'record' | 'score' | 'form' | 'report' }[] = [
  { id: 'record', label: 'Record', icon: 'record' },
  { id: 'score', label: 'Score', icon: 'score' },
  { id: 'form', label: 'Form', icon: 'form' },
  { id: 'report', label: 'Report', icon: 'report' },
];

function NavIcon({ kind }: { kind: string }) {
  switch (kind) {
    case 'record':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      );
    case 'score':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M3 17l4-8 4 5 4-9 4 12" />
        </svg>
      );
    case 'form':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M8 13h8M8 17h8" />
        </svg>
      );
    case 'report':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
          <path d="M2 10h4M10 8h4M18 12h4" />
        </svg>
      );
    default:
      return null;
  }
}

export function MobileBottomNav({ active, onChange }: Props) {
  return (
    <nav className="flows-mobile-bottom-nav" aria-label="Primary">
      {ITEMS.map(item => (
        <button
          key={item.id}
          type="button"
          className={`flows-mobile-nav-item${active === item.id ? ' active' : ''}`}
          onClick={() => onChange(item.id)}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <NavIcon kind={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
