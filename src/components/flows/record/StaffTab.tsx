import { STAFFING } from '../../../data/flows';

export function StaffTab() {
  return (
    <div className="record-view record-view-shell">
      <div className="record-card">
        <div className="record-card-header">
          <h3>Staffing</h3>
          <span className="record-card-meta">
            set pre-op · editable inline <span className="badge-count">2</span>
          </span>
        </div>
        <div className="record-card-body">
          <div className="record-list">
            {STAFFING.map(s => (
              <div className="record-row" key={s.name}>
                <span>{s.name}</span>
                <span className="val">{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
