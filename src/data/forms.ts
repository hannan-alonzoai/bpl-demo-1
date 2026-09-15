import type { FormItem, FormSubmission } from '../types';

export const FORM_LIST: FormItem[] = [
  { id: 'critical-care', title: 'Critical Care Notes' },
  { id: 'preop-checklist', title: 'Preoperative Checklist at Ward' },
  { id: 'pre-anesthesia', title: 'Pre-Anesthesia Consultation Form' },
  { id: 'anesthesia-tech', title: 'Anesthesia Technique Record' },
  { id: 'intraop', title: 'Intraoperative Record' },
  { id: 'pacu', title: 'PACU Assessment' },
  { id: 'who-checklist', title: 'WHO Surgical Safety Checklist' },
  { id: 'consent', title: 'Informed Consent Form' },
  { id: 'pain-assessment', title: 'Pain Assessment Scale' },
  { id: 'blood-transfusion', title: 'Blood Transfusion Record' },
  { id: 'ventilator-log', title: 'Ventilator Settings Log' },
  { id: 'nursing-handover', title: 'Nursing Handover Note' },
  { id: 'postop-orders', title: 'Post-Operative Orders' },
  { id: 'antibiotic-prophylaxis', title: 'Antibiotic Prophylaxis Record' },
  { id: 'dvt-prophylaxis', title: 'DVT Prophylaxis Assessment' },
  { id: 'fluid-balance', title: 'Fluid Balance Chart' },
  { id: 'incident-report', title: 'Incident / Adverse Event Report' },
];

export const DUMMY_SUBMISSIONS: Record<string, FormSubmission[]> = {
  'pre-anesthesia': [
    { id: 1, date: '08/09/2026', time: '09:15', by: 'Dr Jacob Jenner', layout: 'a', attach: 'consent.pdf' },
    { id: 2, date: '09/09/2026', time: '07:40', by: 'Dr Ajay Tiwari', layout: 'b', attach: null },
  ],
  'anesthesia-tech': [
    { id: 3, date: '10/09/2026', time: '08:05', by: 'Dr Jacob Jenner', layout: 'a', attach: null },
  ],
  'critical-care': [
    { id: 6, date: '10/09/2026', time: '14:20', by: 'Dr Jacob Jenner', layout: 'a', attach: 'cc-notes.pdf' },
  ],
};


export function getFormTitle(id: string): string {
  return FORM_LIST.find(f => f.id === id)?.title ?? id;
}
