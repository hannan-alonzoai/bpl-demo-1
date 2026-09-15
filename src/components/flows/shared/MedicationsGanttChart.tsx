import { ClinicalGanttChart, ganttMin, type GanttSection } from './ClinicalGanttChart';

const END = ganttMin(20, 0);

const MEDICATIONS_SECTIONS: GanttSection[] = [
  {
    title: 'STAT Medications',
    rows: [
      {
        id: 'fentanyl',
        name: 'Fentanyl',
        barClass: 'bar-med-stat',
        legendClass: 'leg-med-stat',
        segments: [
          { startMin: ganttMin(17, 6), endMin: ganttMin(17, 18), label: '100 mcg', labelPosition: 'right' },
          { startMin: ganttMin(17, 48), endMin: ganttMin(18, 0), label: '50 mcg', labelPosition: 'right' },
        ],
      },
    ],
  },
  {
    title: 'PRN Medications',
    rows: [
      {
        id: 'propofol',
        name: 'Propofol',
        barClass: 'bar-med-prn',
        legendClass: 'leg-med-prn',
        segments: [{ startMin: ganttMin(17, 35), endMin: ganttMin(17, 55), label: '40 mg', labelPosition: 'right' }],
      },
    ],
  },
  {
    title: 'INFUSED Medications',
    rows: [
      {
        id: 'dopamine',
        name: 'Dopamine',
        barClass: 'bar-med-infused',
        legendClass: 'leg-med-infused',
        segments: [{ startMin: ganttMin(17, 20), endMin: END, label: '17 ml/h', labelPosition: 'right' }],
      },
    ],
  },
];

export function MedicationsGanttChart() {
  return (
    <ClinicalGanttChart sections={MEDICATIONS_SECTIONS} ariaLabel="Medications administration timeline" />
  );
}
