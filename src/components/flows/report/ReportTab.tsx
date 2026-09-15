import { useState } from 'react';
import { FORM_LIST } from '../../../data/forms';
import type { PatientProfile } from '../../../types';

const TIME_INTERVALS = ['5 mins', '10 mins', '15 mins', '30 mins', '1 Hr', '2 Hr'];

const TIME_OPTIONS = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

const NOTES = [
  'If surgery duration is < 1hr, time interval is auto-selected to 5 mins.',
  'If surgery duration is 1–2 hrs, time interval is auto-selected to 10 mins.',
  'If surgery duration is 2–3 hrs, time interval is auto-selected to 15 mins.',
  'If surgery duration is 4–6 hrs, time interval is auto-selected to 30 mins.',
  'If surgery duration is > 6 hours, time interval is auto-selected to 1 hr.',
  'If surgery duration is > 12 hrs, the user must select a time interval of 2 hrs.',
];

function toInputDate(dmy: string) {
  const [d, m, y] = dmy.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

interface Props {
  patient: PatientProfile;
}

export function ReportTab({ patient }: Props) {
  const [interval, setInterval] = useState('1 Hr');
  const [startDate, setStartDate] = useState(toInputDate(patient.admitDate));
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState('2026-09-11');
  const [endTime, setEndTime] = useState('08:00');
  const [selectedForms, setSelectedForms] = useState('all');
  const [mobileFormOpen, setMobileFormOpen] = useState(false);

  return (
    <div className="report-view">
      <div className="report-mobile-hero">
        <h2 className="report-mobile-title">OT Report</h2>
        <p className="report-mobile-sub">
          Generate consolidated documentation for {patient.name} ({patient.crn}).
        </p>
        {!mobileFormOpen ? (
          <>
            <button type="button" className="btn btn-report-mobile-primary" onClick={() => setMobileFormOpen(true)}>
              Choose time interval
            </button>
            <div className="report-mobile-info-card">
              <div className="report-mobile-info-title">Last generated</div>
              <div className="report-mobile-info-body">11 Sep 2026, 08:15 · PDF</div>
            </div>
            <div className="report-mobile-info-card">
              <div className="report-mobile-info-title">Included sections</div>
              <div className="report-mobile-info-body">
                Flowsheet, Vitals, Fluids, Staffing, APACHE II
              </div>
            </div>
          </>
        ) : (
          <button type="button" className="report-mobile-back" onClick={() => setMobileFormOpen(false)}>
            ← Back to summary
          </button>
        )}
      </div>

      <div className={`report-card report-card-desktop${mobileFormOpen ? ' report-mobile-form-open' : ''}`}>
        <h2 className="report-title">Choose time Interval</h2>

        <div className="report-form">
          <div className="report-field">
            <label htmlFor="report-interval">Select Time Interval</label>
            <select id="report-interval" value={interval} onChange={e => setInterval(e.target.value)}>
              {TIME_INTERVALS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="report-field">
            <span className="report-field-label">Start Date &amp; Time</span>
            <div className="report-datetime-row">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <select value={startTime} onChange={e => setStartTime(e.target.value)}>
                {TIME_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="report-field">
            <span className="report-field-label">End Date &amp; Time</span>
            <div className="report-datetime-row">
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              <select value={endTime} onChange={e => setEndTime(e.target.value)}>
                {TIME_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="report-field">
            <label htmlFor="report-forms">Select Forms</label>
            <select id="report-forms" value={selectedForms} onChange={e => setSelectedForms(e.target.value)}>
              <option value="all">All forms</option>
              {FORM_LIST.map(f => (
                <option key={f.id} value={f.id}>{f.title}</option>
              ))}
            </select>
          </div>

          <div className="report-actions">
            <button type="button" className="btn btn-report-submit">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M3 8l4 4 6-7" />
              </svg>
              Submit
            </button>
            <button type="button" className="btn btn-report-cancel">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
              Cancel
            </button>
          </div>
        </div>

        <div className="report-notes">
          <h3>Please Note</h3>
          <ol>
            {NOTES.map(note => (
              <li key={note}>{note}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
