export type RoomStatus = 'critical' | 'attention' | 'caution' | 'stable';
export type ViewMode = 'rings' | 'bars' | 'numbers';
export type FlowTab = 'record' | 'score' | 'form' | 'report' | 'staffing';
export type OverlayView = 'dashboard' | 'fluids' | 'medications' | 'form' | null;

export interface VitalChip {
  l: string;
  v: number | string;
  key?: string;
}

export interface DetailVital {
  v: number;
  l: string;
  u: string;
  max: number;
  key?: string;
}

export interface RoomCompletion {
  pct: number;
  status: 'on-track' | 'watch';
  tag: string;
  priority: number;
  proc: string;
  hr: number;
  spo2: number;
  map: number;
  finish: string;
  delay: string | null;
  nextReady: boolean;
}

export interface CaseTrackSnapshot {
  lastFluid: { name: string; at: string };
  lastMedication: { name: string; at: string };
}

export interface Room {
  id: string;
  status: RoomStatus;
  statusLabel: string;
  patient: string;
  procedure: string;
  vitals: VitalChip[];
  alert: string | null;
  completion: RoomCompletion;
  caseTrack?: CaseTrackSnapshot;
  detail: {
    hemo: DetailVital[];
    vent: DetailVital[];
    temp: DetailVital[];
  };
}

export interface PatientProfile {
  roomId: string;
  name: string;
  crn: string;
  dob: string;
  gender: string;
  admitDate: string;
  admitTime: string;
  careUnit: string;
  bed: string;
  consulting: string;
  caseType: string;
  asa: string;
  allergies: string;
  diagnosis: string;
  procedure: string;
  comorbidities: string;
  other: string;
}

export interface RangeDef {
  label: string;
  low: string;
  base: string;
  avg: string;
  high: string;
  unit: string;
  min?: number;
  max?: number;
  noHigh?: boolean;
  modeOnly?: boolean;
}

export type FluidCellType = 'flow' | 'pause' | 'empty' | 'value';

export interface FluidRow {
  name: string;
  cells: FluidCellType[];
  stayTotal: string;
  values?: Record<number, string>;
}

export interface MedSection {
  title: string;
  rows: FluidRow[];
}

export interface OrStage {
  id: string;
  short: string;
  name: string;
  desc: string;
  time: string;
}

export interface VitalSource {
  id: string;
  name: string;
  short?: string;
}

export interface MonitorParam {
  param: string;
  value: string | number;
  unit?: string;
  kind: string;
  validation?: boolean;
}

export interface FormItem {
  id: string;
  title: string;
}

export interface FormSubmission {
  id: number;
  date: string;
  time: string;
  by: string;
  layout: 'a' | 'b';
  attach: string | null;
  name?: string;
}

export interface ScoreType {
  id: string;
  icon: string;
  name: string;
}

export interface ScoreRow {
  label: string;
  value: string | number;
  unit: string;
  type?: string;
}

export interface ScoreSection {
  title: string;
  col1: string;
  col2: string;
  rows: ScoreRow[];
}

export interface ScoreData {
  title: string;
  subtitle: string;
  total: number;
  breakdown: string;
  sections: ScoreSection[];
}
