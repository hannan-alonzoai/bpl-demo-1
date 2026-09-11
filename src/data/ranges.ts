import type { RangeDef } from '../types';

export const RANGES: Record<string, RangeDef> = {
  HR: { label: 'Heart Rate', low: '<60', base: '60–100', avg: '70–80', high: '>100', unit: 'bpm', min: 60, max: 100 },
  RR: { label: 'Respiratory Rate', low: '<12', base: '12–18', avg: '14–16', high: '>20', unit: 'breaths/min', min: 12, max: 18 },
  Temp: { label: 'Temperature', low: '<36.5', base: '36.5–37.3', avg: '~37.0', high: '≥38.0', unit: '°C', min: 36.5, max: 37.3 },
  SpO2: { label: 'SpO₂', low: '<95', base: '95–100', avg: '97–99', high: 'N/A*', unit: '%', min: 95, max: 100, noHigh: true },
  Pulse: { label: 'Pulse', low: '<60', base: '60–100', avg: '70–80', high: '>100', unit: 'bpm', min: 60, max: 100 },
  Ppeak: { label: 'Ppeak', low: '<15', base: '15–25', avg: '~20', high: '>25–30', unit: 'cmH₂O', min: 15, max: 25 },
  PEEP: { label: 'PEEP', low: '<5', base: '5–10', avg: '~5', high: '>10–15', unit: 'cmH₂O', min: 5, max: 10 },
  NIV: { label: 'NIV', low: '—', base: 'Mode-dependent', avg: 'Mode-dependent', high: 'Mode-dependent', unit: '—', modeOnly: true },
  Pplat: { label: 'Pplat', low: '<15', base: '15–25', avg: '20–25', high: '≥30', unit: 'cmH₂O', min: 15, max: 25 },
  VT: { label: 'NTV / VT', low: '<6', base: '6–8', avg: '6–7', high: '>8–10', unit: 'mL/kg IBW', modeOnly: true },
  Pmean: { label: 'Pmean', low: '<5', base: '5–15', avg: '8–12', high: '>15–20', unit: 'cmH₂O', min: 5, max: 15 },
};
