import { useMemo, useState } from 'react';
import { DUMMY_SUBMISSIONS, FORM_LIST, getFormTitle } from '../../../data/forms';

interface Props {
  onNewEntry: (formId: string) => void;
  onViewEntry: (formId: string, recordId: number) => void;
}

export function FormTab({ onNewEntry, onViewEntry }: Props) {
  const [selectedId, setSelectedId] = useState('critical-care');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => FORM_LIST.filter(f => f.title.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const submissions = DUMMY_SUBMISSIONS[selectedId] ?? [];

  return (
    <div className="shell">
      <aside className="forms-panel">
        <div className="forms-panel-header">
          <h2>Forms</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Search form name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="form-list scroll-y">
          {filtered.map(f => (
            <button
              key={f.id}
              type="button"
              className={`form-list-item${selectedId === f.id ? ' active' : ''}`}
              onClick={() => setSelectedId(f.id)}
            >
              {f.title}
            </button>
          ))}
        </div>
      </aside>
      <main className="main">
        <div className="main-header">
          <div>
            <h1>{getFormTitle(selectedId)}</h1>
            <div className="subtitle">Submitted records for this patient</div>
          </div>
          <button type="button" className="btn btn-new-entry" onClick={() => onNewEntry(selectedId)}>+ New Entry</button>
        </div>
        <div className="table-wrap scroll-y">
          {submissions.length === 0 ? (
            <div className="empty-state">
              <p>No submissions yet for this form.</p>
              <button type="button" className="btn btn-new-entry" onClick={() => onNewEntry(selectedId)}>Create first entry</button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Form Name</th>
                  <th>Submitted By</th>
                  <th>Attach Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((row, i) => (
                  <tr key={row.id}>
                    <td>{i + 1}</td>
                    <td>{row.date}</td>
                    <td>{row.time}</td>
                    <td>
                      {getFormTitle(selectedId)}
                      {' '}
                      <span className="layout-badge">{row.layout === 'a' ? 'A' : 'B'}</span>
                    </td>
                    <td>{row.by}</td>
                    <td>{row.attach ? <span className="attach-link">{row.attach}</span> : '—'}</td>
                    <td>
                      <button type="button" className="action-link" onClick={() => onViewEntry(selectedId, row.id)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
