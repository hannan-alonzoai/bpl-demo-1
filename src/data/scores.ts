import type { ScoreData, ScoreType } from '../types';

export interface ScoreTypeMeta extends ScoreType {
  description: string;
  tone: 'blue' | 'teal' | 'purple' | 'green' | 'amber' | 'pink' | 'slate';
}

export const SCORE_TYPES: ScoreTypeMeta[] = [
  { id: 'apache2', icon: 'A2', name: 'APACHE II', description: 'Acute Physiology and Chronic Health Evaluation — ICU severity', tone: 'blue' },
  { id: 'sofa', icon: 'SF', name: 'SOFA', description: 'Sequential Organ Failure Assessment', tone: 'teal' },
  { id: 'saps2', icon: 'SP', name: 'SAPS II', description: 'Simplified Acute Physiology Score', tone: 'purple' },
  { id: 'news', icon: 'NW', name: 'NEWS', description: 'National Early Warning Score', tone: 'green' },
  { id: 'mews', icon: 'MW', name: 'MEWS', description: 'Modified Early Warning Score', tone: 'amber' },
  { id: 'apache23', icon: 'A3', name: 'APACHE 23', description: 'Extended APACHE score', tone: 'blue' },
  { id: 'sirs', icon: 'SR', name: 'SIRS', description: 'Systemic Inflammatory Response Syndrome', tone: 'pink' },
];

export const PARAM_SCORES: Record<string, ScoreData> = {
  apache2: {
    title: 'APACHE II',
    subtitle: 'Acute Physiology and Chronic Health Evaluation — ICU severity',
    total: 14,
    breakdown: 'Physiology 12 · Age 2',
    sections: [
      { title: 'Age', col1: 'Demographics Option', col2: 'Scale Option', rows: [{ label: 'Age', value: 62, unit: 'years' }] },
      { title: 'Heart rate / pulse', col1: 'Parameter', col2: 'Value', rows: [{ label: 'Heart Rate', value: 88, unit: 'bpm' }] },
      { title: 'Respiratory rate', col1: 'Parameter', col2: 'Value', rows: [{ label: 'RR', value: 18, unit: '/min' }] },
      { title: 'Glasgow Coma Scale', col1: 'Parameter', col2: 'Value', rows: [{ label: 'GCS', value: 14, unit: '/15' }] },
    ],
  },
  sofa: {
    title: 'SOFA',
    subtitle: 'Sequential Organ Failure Assessment',
    total: 4,
    breakdown: 'Resp 0 · Coag 0 · Liver 0 · CV 1 · CNS 0 · Renal 1',
    sections: [
      { title: 'Respiration', col1: 'Parameter', col2: 'Value', rows: [{ label: 'PaO₂/FiO₂', value: 280, unit: 'mmHg' }] },
      { title: 'Central nervous system', col1: 'Parameter', col2: 'Value', rows: [{ label: 'GCS', value: 15, unit: '' }] },
    ],
  },
  saps2: {
    title: 'SAPS II',
    subtitle: 'Simplified Acute Physiology Score',
    total: 32,
    breakdown: 'Estimated mortality ~18%',
    sections: [{ title: 'Heart rate', col1: 'Parameter', col2: 'Value', rows: [{ label: 'Heart Rate', value: 92, unit: 'bpm' }] }],
  },
  news: {
    title: 'NEWS',
    subtitle: 'National Early Warning Score',
    total: 3,
    breakdown: 'Low risk · routine monitoring',
    sections: [{ title: 'Heart rate', col1: 'Parameter', col2: 'Value', rows: [{ label: 'HR', value: 82, unit: 'bpm' }] }],
  },
  mews: {
    title: 'MEWS',
    subtitle: 'Modified Early Warning Score',
    total: 1,
    breakdown: 'Stable · continue routine obs',
    sections: [{ title: 'Heart rate', col1: 'Parameter', col2: 'Value', rows: [{ label: 'HR', value: 78, unit: 'bpm' }] }],
  },
  apache23: {
    title: 'APACHE 23',
    subtitle: 'Extended APACHE score',
    total: 11,
    breakdown: 'Physiology 9 · Age 2',
    sections: [{ title: 'Age', col1: 'Demographics Option', col2: 'Scale Option', rows: [{ label: 'Age', value: 62, unit: 'years' }] }],
  },
  sirs: {
    title: 'SIRS',
    subtitle: 'Systemic Inflammatory Response Syndrome',
    total: 2,
    breakdown: '2 of 4 criteria met',
    sections: [{ title: 'Heart rate', col1: 'Parameter', col2: 'Value', rows: [{ label: 'HR', value: 92, unit: 'bpm' }] }],
  },
};
