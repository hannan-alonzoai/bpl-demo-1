import type { PatientProfile } from '../types';
import { getRoom } from './rooms';

const JAMES_WILSON: PatientProfile = {
  roomId: 'OT-01',
  name: 'James Wilson',
  crn: 'CRN3185',
  dob: '03/06/1964',
  gender: 'Male',
  admitDate: '02/09/2026',
  admitTime: '10:06',
  careUnit: 'OT',
  bed: 'OT-01',
  consulting: 'Dr. Ajay Tiwari, Dr. Sheetal K.',
  caseType: 'General Anaesthesia',
  asa: 'ASA I',
  allergies: 'Latex',
  diagnosis: 'Blocked Coronary Artery (CAD 3…)',
  procedure: 'CABG (Coronary Artery Bypass)',
  comorbidities: 'DM (Type 2), HTN',
  other: 'Skin Eczema',
};

function profileFromRoom(roomId: string): PatientProfile {
  const room = getRoom(roomId);
  if (!room) throw new Error(`Unknown room: ${roomId}`);
  const [namePart, asaPart] = room.patient.split(' · ').map(s => s.trim());
  return {
    roomId,
    name: namePart || roomId,
    crn: `CRN${3000 + parseInt(roomId.replace('OT-', ''), 10)}`,
    dob: '01/01/1970',
    gender: 'Male',
    admitDate: '02/09/2026',
    admitTime: '10:06',
    careUnit: 'OT',
    bed: roomId,
    consulting: 'Dr. Ajay Tiwari',
    caseType: 'General Anaesthesia',
    asa: asaPart || 'ASA II',
    allergies: room.alert?.includes('Latex') ? 'Latex' : 'None known',
    diagnosis: room.procedure,
    procedure: room.procedure,
    comorbidities: '—',
    other: '—',
  };
}

const PROFILES: Record<string, PatientProfile> = {
  'OT-01': JAMES_WILSON,
};

export function getPatient(roomId: string): PatientProfile {
  return PROFILES[roomId] ?? profileFromRoom(roomId);
}
