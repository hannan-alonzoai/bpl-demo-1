import { Fragment } from 'react';
import type { FluidCellType, FluidRow } from '../../../types';

function FluidCell({ cell, values, colIdx }: { cell: FluidCellType; values?: Record<number, string>; colIdx: number }) {
  if (cell === 'flow') return <td className="flow-cell"><span className="flow-arrow">→</span></td>;
  if (cell === 'pause') return <td className="flow-cell pause"><span className="pause-icon">⏸</span><span className="flow-arrow">→</span></td>;
  if (cell === 'value' && values?.[colIdx]) return <td>{values[colIdx]}</td>;
  return <td className="empty-cell">·</td>;
}

interface IntakeOutputProps {
  times: string[];
  allTimes: string[];
  intake: FluidRow[];
  output: FluidRow[];
  showTimeHeader?: boolean;
}

export function FluidsGrid({ times, allTimes, intake, output, showTimeHeader = true }: IntakeOutputProps) {
  const timeHeaders = times.map(t => <th key={t}>{t}</th>);
  const colSpan = times.length + 2;

  const mapRow = (row: FluidRow) => (
    <tr key={row.name}>
      <td className="fluid-label-col">{row.name}</td>
      {times.map(t => {
        const fullIdx = allTimes.indexOf(t);
        return <FluidCell key={t} cell={row.cells[fullIdx]} values={row.values} colIdx={fullIdx} />;
      })}
      <td className="stay-total">{row.stayTotal || '·'}</td>
    </tr>
  );

  return (
    <div className="fluids-grid-wrap">
      <table className="fluids-grid">
        {showTimeHeader && (
          <thead>
            <tr className="time-header">
              <th className="fluid-label-col" />
              {timeHeaders}
              <th className="stay-total">Stay Total</th>
            </tr>
          </thead>
        )}
        <tbody>
          <tr className="section-row"><td colSpan={colSpan}>Intake</td></tr>
          {intake.map(mapRow)}
          <tr className="section-row"><td colSpan={colSpan}>Output</td></tr>
          {output.map(mapRow)}
        </tbody>
      </table>
    </div>
  );
}

interface MedProps {
  times: string[];
  allTimes: string[];
  sections: { title: string; rows: FluidRow[] }[];
}

export function MedicationsGrid({ times, allTimes, sections }: MedProps) {
  const timeThs = times.map(t => <th key={t}>{t}</th>);

  return (
    <div className="fluids-grid-wrap">
      <table className="fluids-grid">
        <tbody>
          {sections.map(sec => (
            <Fragment key={sec.title}>
              <tr className="med-section-header">
                <th className="fluid-label-col">{sec.title}</th>
                {timeThs}
                <th className="stay-total">Stay Total</th>
              </tr>
              {sec.rows.map(row => (
                <tr key={row.name}>
                  <td className="fluid-label-col">{row.name}</td>
                  {times.map(t => {
                    const fullIdx = allTimes.indexOf(t);
                    return <FluidCell key={t} cell={row.cells[fullIdx]} values={row.values} colIdx={fullIdx} />;
                  })}
                  <td className="stay-total">{row.stayTotal || '·'}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
