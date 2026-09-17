import { useMemo, useState } from 'react';
import { STAFF_DIRECTORY } from '../../../data/flows';

interface AssignedStaff {
  id: string;
  timeIn: string;
  timeOut: string;
}

const INITIAL_ASSIGNED: AssignedStaff[] = [
  { id: 'jacob-jenner', timeIn: '08:30', timeOut: '' },
  { id: 'jane-belita', timeIn: '08:35', timeOut: '' },
];

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function StaffTab() {
  const [assigned, setAssigned] = useState<AssignedStaff[]>(INITIAL_ASSIGNED);
  const [search, setSearch] = useState('');

  const available = useMemo(
    () =>
      STAFF_DIRECTORY.filter(
        s =>
          !assigned.some(a => a.id === s.id) &&
          `${s.name} ${s.role}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [assigned, search],
  );

  function addStaff(id: string) {
    const now = new Date();
    const timeIn = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setAssigned(prev => [...prev, { id, timeIn, timeOut: '' }]);
  }

  function updateTime(id: string, field: 'timeIn' | 'timeOut', value: string) {
    setAssigned(prev => prev.map(a => (a.id === id ? { ...a, [field]: value } : a)));
  }

  const assignedRows = assigned
    .map(row => ({ row, member: STAFF_DIRECTORY.find(s => s.id === row.id) }))
    .filter((x): x is { row: AssignedStaff; member: (typeof STAFF_DIRECTORY)[number] } => Boolean(x.member));

  return (
    <>
    <div className="staffing-mobile-stack">
      <div className="staffing-mobile-toolbar">
        <h2>Staffing</h2>
        <span className="staff-count-badge">{assigned.length} assigned</span>
      </div>

      <div className="staffing-mobile-section">
        <h3 className="staffing-mobile-heading">Selected staff</h3>
        {assignedRows.length === 0 ? (
          <p className="staff-pick-empty">Nobody assigned yet — add from the list below.</p>
        ) : (
          assignedRows.map(({ row, member }) => (
            <div className="staffing-mobile-card" key={row.id}>
              <div className="staffing-mobile-card-head">
                <div>
                  <div className="staffing-mobile-card-name">{member.name}</div>
                  <div className="staffing-mobile-card-role">{member.role}</div>
                </div>
                <span className="staff-group-badge">{member.group}</span>
              </div>
              <div className="staffing-mobile-times">
                <label>
                  <span>Time In</span>
                  <input
                    type="time"
                    className="staff-time-input"
                    value={row.timeIn}
                    onChange={e => updateTime(row.id, 'timeIn', e.target.value)}
                  />
                </label>
                <label>
                  <span>Time Out</span>
                  <input
                    type="time"
                    className="staff-time-input"
                    value={row.timeOut}
                    onChange={e => updateTime(row.id, 'timeOut', e.target.value)}
                  />
                </label>
              </div>
              <button
                type="button"
                className="action-link action-link-danger staffing-mobile-remove"
                onClick={() => setAssigned(prev => prev.filter(a => a.id !== row.id))}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="staffing-mobile-section">
        <h3 className="staffing-mobile-heading">Available staff</h3>
        <input
          type="search"
          className="search-input staffing-mobile-search"
          placeholder="Search name or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {available.length === 0 ? (
          <p className="staff-pick-empty">Everyone is assigned.</p>
        ) : (
          available.map(s => (
            <button key={s.id} type="button" className="staff-pick-item" onClick={() => addStaff(s.id)}>
              <span className="staff-pick-copy">
                <span className="staff-pick-name">{s.name}</span>
                <span className="staff-pick-role">{s.role}</span>
              </span>
              <PlusIcon />
            </button>
          ))
        )}
      </div>
    </div>

    <div className="shell staffing-shell">
      <aside className="forms-panel staffing-panel">
        <div className="forms-panel-header">
          <h2>Available Staff</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Search name or role…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="staff-pick-list scroll-y">
          {available.length === 0 ? (
            <p className="staff-pick-empty">Everyone is assigned.</p>
          ) : (
            available.map(s => (
              <button
                key={s.id}
                type="button"
                className="staff-pick-item"
                onClick={() => addStaff(s.id)}
                title={`Add ${s.name}`}
              >
                <span className="staff-pick-copy">
                  <span className="staff-pick-name">{s.name}</span>
                  <span className="staff-pick-role">{s.role}</span>
                </span>
                <PlusIcon />
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="main">
        <div className="main-header">
          <div>
            <h1>Selected Staff</h1>
            <div className="subtitle">Track who is scrubbed in and their shift window</div>
          </div>
          <span className="staff-count-badge">{assigned.length} assigned</span>
        </div>
        <div className="table-wrap scroll-y">
          {assigned.length === 0 ? (
            <div className="empty-state">
              <p>No staff assigned yet. Add them from the list on the left.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Group</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedRows.map(({ row, member }) => {
                  return (
                    <tr key={row.id}>
                      <td>{member.name}</td>
                      <td>{member.role}</td>
                      <td>
                        <span className="staff-group-badge">{member.group}</span>
                      </td>
                      <td>
                        <input
                          type="time"
                          className="staff-time-input"
                          value={row.timeIn}
                          onChange={e => updateTime(row.id, 'timeIn', e.target.value)}
                          aria-label={`Time in for ${member.name}`}
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          className="staff-time-input"
                          value={row.timeOut}
                          onChange={e => updateTime(row.id, 'timeOut', e.target.value)}
                          aria-label={`Time out for ${member.name}`}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="action-link action-link-danger"
                          onClick={() => setAssigned(prev => prev.filter(a => a.id !== row.id))}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
    </>
  );
}
