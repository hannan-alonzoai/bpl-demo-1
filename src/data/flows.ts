import type { FluidRow, MedSection, OrStage, VitalSource } from '../types';

export const OR_STAGES: OrStage[] = [
  { id: 'positioning', short: 'Position', name: 'Positioning', desc: 'Patient positioned on table', time: '08:28' },
  { id: 'or', short: 'OR', name: 'OR', desc: 'Patient in OR / case started', time: '08:32' },
  { id: 'anes_ready', short: 'Anes Rdy', name: 'Anes Ready', desc: 'Anaesthesia team ready', time: '08:35' },
  { id: 'catheter', short: 'Cath', name: 'Catheter Insertion', desc: 'Arterial / central line', time: '08:42' },
  { id: 'anaesthesia', short: 'Anes', name: 'Anaesthesia', desc: 'Induction given', time: '08:48' },
  { id: 'wound_dressing', short: 'Prep', name: 'Wound Dressing', desc: 'Prep / drape, pre-incision', time: '08:55' },
  { id: 'surgery', short: 'Surgery', name: 'Surgery', desc: 'Surgery underway', time: '09:02' },
  { id: 'incision', short: 'Incision', name: 'Incision', desc: 'Skin incision', time: '09:08' },
  { id: 'handoff', short: 'Handoff', name: 'Hand to Surgeon', desc: 'Hand to surgeon', time: '09:12' },
];

export const VITAL_SOURCES: VitalSource[] = [
  { id: 'monitor', name: 'Patient Monitor', short: 'Monitor' },
  { id: 'anaesthesia_machine', name: 'Anaesthesia Machine', short: 'Anes machine' },
  { id: 'syringe_pump', name: 'Syringe Pump', short: 'Syringe pump' },
];

/** Default OR stage index for demo rooms (matches ot/detail-dashboard.html). */
export const DEFAULT_STAGE_BY_ROOM: Record<string, number> = {
  'OT-01': 6,
  'OT-03': 2,
  'OT-05': 6,
};

export function getDefaultStageIndex(roomId: string): number {
  return DEFAULT_STAGE_BY_ROOM[roomId] ?? 4;
}

export const FLUIDS_TIMES = [
  '16:55', '17:00', '17:05', '17:10', '17:15', '17:20', '17:25', '17:30',
  '17:35', '17:40', '17:45', '17:50', '17:55',
];

export const FLUIDS_INTAKE: FluidRow[] = [
  { name: '25% Dextrose', cells: ['flow','flow','flow','flow','flow','flow','flow','flow','flow','flow','flow','flow','pause'], stayTotal: '' },
  { name: 'RL (continuous)', cells: Array(13).fill('flow') as FluidRow['cells'], stayTotal: '420 ml' },
  { name: 'Blood', cells: ['empty','empty','empty','empty','value','empty','empty','empty','empty','empty','empty','empty','empty'], stayTotal: '1 unit', values: { 4: '1 u' } },
];

export const FLUIDS_OUTPUT: FluidRow[] = [
  { name: 'Urine Output', cells: Array(13).fill('empty') as FluidRow['cells'], stayTotal: '0.00 ml' },
  { name: 'Urinary Catheter', cells: Array(13).fill('empty') as FluidRow['cells'], stayTotal: '' },
];

export const FLUIDS_PREVIEW_COLS = 5;

export const MEDICATIONS_TIMES = [
  '17:06', '17:11', '17:16', '17:21', '17:26', '17:31',
  '17:36', '17:41', '17:46', '17:51', '17:56', '18:01', '18:06',
];

const MED_FLOW = ['flow','flow','flow','flow','flow','flow','flow','flow','flow','flow','flow','flow','pause'] as FluidRow['cells'];

export const MEDICATIONS_SECTIONS: MedSection[] = [
  { title: 'STAT Medications', rows: [{ name: 'Fentanyl', cells: MED_FLOW, stayTotal: '' }] },
  { title: 'PRN Medications', rows: [{ name: 'Propofol', cells: MED_FLOW, stayTotal: '' }] },
  { title: 'INFUSED Medications', rows: [{ name: 'Dopamine', cells: Array(13).fill('flow') as FluidRow['cells'], stayTotal: '17 ml/h' }] },
];

export const MEDICATIONS_PREVIEW_COLS = 5;

export const STAFFING = [
  { name: 'Dr A. Rao — Anaesthetist', time: '08:30 → —' },
  { name: 'Dr J. Belita — Surgeon', time: '08:35 → —' },
];
