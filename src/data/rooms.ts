import type { Room } from '../types';

export const rooms: Room[] = [
  {
    id: 'OT-01', status: 'critical', statusLabel: 'Critical',
    patient: 'James · ASA I', procedure: 'CABG',
    vitals: [{ l: 'HR', v: 90, key: 'HR' }, { l: 'SpO2', v: 98, key: 'SpO2' }, { l: 'Temp1', v: 25.6, key: 'Temp' }, { l: 'PEEP', v: 2, key: 'PEEP' }],
    alert: 'Temp2 sensor fall off',
    completion: { pct: 62, status: 'on-track', tag: 'Surgery', priority: 1, proc: 'CABG · General', hr: 90, spo2: 98, map: 82, finish: '16:20', delay: null, nextReady: true },
    detail: {
      hemo: [{ v: 90, l: 'Heart rate', u: 'bpm', max: 180, key: 'HR' }, { v: 86, l: 'Pulse', u: 'bpm', max: 180, key: 'Pulse' }, { v: 98, l: 'SpO2', u: '%', max: 100, key: 'SpO2' }, { v: 14, l: 'Resp. rate', u: '/min', max: 40, key: 'RR' }],
      vent: [{ v: 19, l: 'Ppeak', u: 'cmH2O', max: 40, key: 'Ppeak' }, { v: 2, l: 'PEEP', u: 'cmH2O', max: 20, key: 'PEEP' }, { v: 6.5, l: 'MV', u: 'L/min', max: 15 }, { v: 16, l: 'Pplat', u: 'cmH2O', max: 40, key: 'Pplat' }, { v: 410, l: 'VTi', u: 'mL', max: 800 }, { v: 7, l: 'Pmean', u: 'cmH2O', max: 20, key: 'Pmean' }],
      temp: [{ v: 25.6, l: 'Temp1', u: '°C', max: 42, key: 'Temp' }, { v: 35.9, l: 'Temp2', u: '°C', max: 42, key: 'Temp' }],
    },
  },
  {
    id: 'OT-05', status: 'attention', statusLabel: 'Attention',
    patient: 'Rahul · ASA IV', procedure: 'Emergency laparotomy',
    vitals: [{ l: 'HR', v: 128, key: 'HR' }, { l: 'SpO2', v: 93, key: 'SpO2' }, { l: 'Temp1', v: 35.2, key: 'Temp' }, { l: 'MAP', v: 58 }],
    alert: 'Low urine output',
    completion: { pct: 45, status: 'watch', tag: 'over-run risk', priority: 1, proc: 'Emergency lap. · GA', hr: 128, spo2: 93, map: 58, finish: '17:40', delay: '+35m', nextReady: false },
    detail: {
      hemo: [{ v: 128, l: 'Heart rate', u: 'bpm', max: 180, key: 'HR' }, { v: 124, l: 'Pulse', u: 'bpm', max: 180, key: 'Pulse' }, { v: 93, l: 'SpO2', u: '%', max: 100, key: 'SpO2' }, { v: 22, l: 'Resp. rate', u: '/min', max: 40, key: 'RR' }],
      vent: [{ v: 24, l: 'Ppeak', u: 'cmH2O', max: 40, key: 'Ppeak' }, { v: 5, l: 'PEEP', u: 'cmH2O', max: 20, key: 'PEEP' }, { v: 8.2, l: 'MV', u: 'L/min', max: 15 }, { v: 21, l: 'Pplat', u: 'cmH2O', max: 40, key: 'Pplat' }, { v: 380, l: 'VTi', u: 'mL', max: 800 }, { v: 9, l: 'Pmean', u: 'cmH2O', max: 20, key: 'Pmean' }],
      temp: [{ v: 35.2, l: 'Temp1', u: '°C', max: 42, key: 'Temp' }, { v: 36.1, l: 'Temp2', u: '°C', max: 42, key: 'Temp' }],
    },
  },
  {
    id: 'OT-02', status: 'caution', statusLabel: 'Caution',
    patient: 'Priya · ASA II', procedure: 'Hip replacement',
    vitals: [{ l: 'HR', v: 112, key: 'HR' }, { l: 'SpO2', v: 96, key: 'SpO2' }, { l: 'Temp1', v: 36.8, key: 'Temp' }, { l: 'MAP', v: 64 }],
    alert: null,
    completion: { pct: 70, status: 'watch', tag: 'Surgery', priority: 3, proc: 'Hip replacement · GA', hr: 112, spo2: 96, map: 64, finish: '14:50', delay: null, nextReady: false },
    detail: {
      hemo: [{ v: 112, l: 'Heart rate', u: 'bpm', max: 180, key: 'HR' }, { v: 110, l: 'Pulse', u: 'bpm', max: 180, key: 'Pulse' }, { v: 96, l: 'SpO2', u: '%', max: 100, key: 'SpO2' }, { v: 18, l: 'Resp. rate', u: '/min', max: 40, key: 'RR' }],
      vent: [{ v: 20, l: 'Ppeak', u: 'cmH2O', max: 40, key: 'Ppeak' }, { v: 5, l: 'PEEP', u: 'cmH2O', max: 20, key: 'PEEP' }, { v: 6.8, l: 'MV', u: 'L/min', max: 15 }, { v: 17, l: 'Pplat', u: 'cmH2O', max: 40, key: 'Pplat' }, { v: 420, l: 'VTi', u: 'mL', max: 800 }, { v: 8, l: 'Pmean', u: 'cmH2O', max: 20, key: 'Pmean' }],
      temp: [{ v: 36.8, l: 'Temp1', u: '°C', max: 42, key: 'Temp' }, { v: 36.9, l: 'Temp2', u: '°C', max: 42, key: 'Temp' }],
    },
  },
  {
    id: 'OT-03', status: 'stable', statusLabel: 'Stable',
    patient: 'Arun · ASA III', procedure: 'Bowel resection',
    vitals: [{ l: 'HR', v: 78, key: 'HR' }, { l: 'SpO2', v: 99, key: 'SpO2' }, { l: 'Temp1', v: 37.1, key: 'Temp' }, { l: 'MAP', v: 82 }],
    alert: null,
    completion: { pct: 88, status: 'watch', tag: 'over-run risk', priority: 2, proc: 'Bowel resection · GA', hr: 78, spo2: 99, map: 82, finish: '15:05', delay: '+20m', nextReady: false },
    detail: {
      hemo: [{ v: 78, l: 'Heart rate', u: 'bpm', max: 180, key: 'HR' }, { v: 77, l: 'Pulse', u: 'bpm', max: 180, key: 'Pulse' }, { v: 99, l: 'SpO2', u: '%', max: 100, key: 'SpO2' }, { v: 15, l: 'Resp. rate', u: '/min', max: 40, key: 'RR' }],
      vent: [{ v: 18, l: 'Ppeak', u: 'cmH2O', max: 40, key: 'Ppeak' }, { v: 5, l: 'PEEP', u: 'cmH2O', max: 20, key: 'PEEP' }, { v: 6.0, l: 'MV', u: 'L/min', max: 15 }, { v: 15, l: 'Pplat', u: 'cmH2O', max: 40, key: 'Pplat' }, { v: 400, l: 'VTi', u: 'mL', max: 800 }, { v: 7, l: 'Pmean', u: 'cmH2O', max: 20, key: 'Pmean' }],
      temp: [{ v: 37.1, l: 'Temp1', u: '°C', max: 42, key: 'Temp' }, { v: 37.0, l: 'Temp2', u: '°C', max: 42, key: 'Temp' }],
    },
  },
  {
    id: 'OT-04', status: 'stable', statusLabel: 'Stable',
    patient: 'Leela · ASA II', procedure: 'Thyroidectomy',
    vitals: [{ l: 'HR', v: 70, key: 'HR' }, { l: 'SpO2', v: 99, key: 'SpO2' }, { l: 'Temp1', v: 36.9, key: 'Temp' }, { l: 'MAP', v: 78 }],
    alert: null,
    completion: { pct: 95, status: 'on-track', tag: 'Surgery', priority: 4, proc: 'Thyroidectomy · GA', hr: 70, spo2: 99, map: 78, finish: '13:10', delay: null, nextReady: true },
    detail: {
      hemo: [{ v: 70, l: 'Heart rate', u: 'bpm', max: 180, key: 'HR' }, { v: 69, l: 'Pulse', u: 'bpm', max: 180, key: 'Pulse' }, { v: 99, l: 'SpO2', u: '%', max: 100, key: 'SpO2' }, { v: 13, l: 'Resp. rate', u: '/min', max: 40, key: 'RR' }],
      vent: [{ v: 17, l: 'Ppeak', u: 'cmH2O', max: 40, key: 'Ppeak' }, { v: 4, l: 'PEEP', u: 'cmH2O', max: 20, key: 'PEEP' }, { v: 5.6, l: 'MV', u: 'L/min', max: 15 }, { v: 14, l: 'Pplat', u: 'cmH2O', max: 40, key: 'Pplat' }, { v: 390, l: 'VTi', u: 'mL', max: 800 }, { v: 6, l: 'Pmean', u: 'cmH2O', max: 20, key: 'Pmean' }],
      temp: [{ v: 36.9, l: 'Temp1', u: '°C', max: 42, key: 'Temp' }, { v: 36.8, l: 'Temp2', u: '°C', max: 42, key: 'Temp' }],
    },
  },
];

export function getRoom(id: string): Room | undefined {
  return rooms.find(r => r.id === id);
}
