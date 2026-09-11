import type { MonitorParam } from '../types';

interface PumpData {
  drug: string;
  rate: string;
  infused: string;
  vtbi: string;
  active: boolean;
}

interface AnesData {
  fio2: number | string;
  tv: number | string;
  rr: number | string;
  peep: number | string;
  etco2: number | string;
  agent: string;
  mac: string;
}

export interface StageVitalData {
  tabular: MonitorParam[];
  monitorParams: MonitorParam[];
  anes: AnesData;
  pumps: PumpData[];
}

export function stageVitals(idx: number): StageVitalData {
  const hr = 72 + idx * 2 + 6;
  const pulse = 72 + idx * 2 + 4;
  const tabular: MonitorParam[] = [
    { param: 'Heart Rate', value: hr, unit: 'bpm', kind: 'ecg' },
    { param: 'Resp. Rate', value: 14 + Math.floor(idx / 2), unit: 'bpm', kind: 'resp' },
    { param: 'SpO₂', value: Math.min(99, 96 + idx), unit: '%', kind: 'spo2' },
    { param: 'Temp1', value: (36.4 + idx * 0.08).toFixed(1), unit: '°C', kind: 'temp' },
    { param: 'Pulse', value: pulse, unit: 'bpm', kind: 'ecg' },
    { param: 'ECG Lead', value: 'Lead II', unit: '', kind: 'ecg' },
    { param: 'ECG Rhythm', value: idx < 4 ? 'Sinus' : 'NSR', unit: '', kind: 'ecg' },
    { param: 'ST Level', value: idx >= 4 ? '+0.5' : '—', unit: 'mm', kind: 'ecg' },
    { param: 'PVC / min', value: idx >= 6 ? 2 : 0, unit: '', kind: 'ecg' },
    { param: 'Validation Parameter', value: '—', unit: '', kind: 'validation', validation: true },
    { param: 'Validation Parameter', value: '—', unit: '', kind: 'validation', validation: true },
    { param: 'Validation Parameter', value: '—', unit: '', kind: 'validation', validation: true },
  ];
  return {
    tabular,
    monitorParams: tabular.filter(r => !r.validation),
    anes: {
      fio2: idx < 4 ? 21 : 40 + idx * 2,
      tv: idx < 4 ? '—' : 480 + idx * 10,
      rr: idx < 4 ? '—' : 12 + Math.floor(idx / 3),
      peep: idx < 5 ? '—' : 5,
      etco2: idx < 4 ? '—' : 32 + idx,
      agent: idx < 4 ? '—' : 'Sevoflurane 1.8%',
      mac: idx < 4 ? '—' : '0.9',
    },
    pumps: idx < 4
      ? [{ drug: '—', rate: '—', infused: '—', vtbi: '—', active: false }]
      : [
          { drug: 'Propofol', rate: `${80 + idx * 5} ml/h`, infused: `${120 + idx * 15} ml`, vtbi: '500 ml', active: true },
          { drug: 'Dopamine', rate: `${12 + idx} ml/h`, infused: `${40 + idx * 8} ml`, vtbi: '250 ml', active: idx >= 6 },
          { drug: 'Fentanyl', rate: idx >= 5 ? `${2 + idx * 0.2} ml/h` : '—', infused: `${8 + idx} ml`, vtbi: '50 ml', active: idx >= 5 },
        ],
  };
}
