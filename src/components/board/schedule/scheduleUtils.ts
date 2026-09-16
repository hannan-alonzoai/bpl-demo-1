import { RANGES } from '../../../data/ranges';
import { OR_STAGES } from '../../../data/flows';
import type { CaseTrackSnapshot, OrStage, Room } from '../../../types';

const DEFAULT_CASE_TRACK: CaseTrackSnapshot = {
  lastFluid: { name: 'RL (continuous)', at: '08:42' },
  lastMedication: { name: 'Fentanyl 50 µg', at: '08:38' },
};

export function caseTrackForRoom(room: Room): CaseTrackSnapshot {
  return room.caseTrack ?? DEFAULT_CASE_TRACK;
}

/** Same rules as index4.html `classify()` for strip + detail vitals. */
export function scheduleClassify(key: string | undefined, value: number | string | undefined): string {
  const r = key ? RANGES[key] : undefined;
  if (!r || value == null) return 'vclass-normal';
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (Number.isNaN(num)) return 'vclass-normal';
  if (num < (r.min ?? 0)) return 'vclass-caution';
  if (!r.noHigh && r.max != null && num > r.max) return 'vclass-critical';
  return 'vclass-normal';
}

/** Same 7 stages as index4.html schedule strip. */
export const SCHEDULE_STAGES: OrStage[] = OR_STAGES.slice(0, 7);

export function stageIndexFromPct(pct: number): number {
  if (pct >= 100) return SCHEDULE_STAGES.length - 1;
  return Math.min(SCHEDULE_STAGES.length - 1, Math.floor((pct / 100) * SCHEDULE_STAGES.length));
}

export function currentStageForPct(pct: number): OrStage {
  return SCHEDULE_STAGES[stageIndexFromPct(pct)];
}

export function currentStageForIndex(index: number): OrStage {
  const i = Math.max(0, Math.min(SCHEDULE_STAGES.length - 1, index));
  return SCHEDULE_STAGES[i];
}

/** Completion % aligned with stage index (for strip pie after advance). */
export function pctForStageIndex(index: number): number {
  if (index >= SCHEDULE_STAGES.length - 1) return 100;
  return Math.round(((index + 1) / SCHEDULE_STAGES.length) * 100);
}

export function parsePatient(patient: string): { name: string; asa: string | null } {
  const parts = String(patient).split('·').map(s => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { name: parts[0], asa: parts.slice(1).join(' · ') };
  }
  return { name: patient, asa: null };
}
