import { ClinicalGanttChart, ganttMin, type GanttSection } from './ClinicalGanttChart';

const END = ganttMin(20, 0);

const FLUIDS_SECTIONS: GanttSection[] = [
  {
    title: 'Intake',
    rows: [
      {
        id: 'dextrose',
        name: '25% Dextrose',
        barClass: 'bar-dextrose',
        legendClass: 'leg-dextrose',
        segments: [{ startMin: ganttMin(17, 15), endMin: ganttMin(17, 45), label: '50 ml', labelPosition: 'right' }],
      },
      {
        id: 'rl',
        name: 'RL (continuous)',
        barClass: 'bar-rl',
        legendClass: 'leg-rl',
        segments: [{ startMin: ganttMin(17, 30), endMin: END, label: '100 ml/hr', labelPosition: 'right' }],
      },
      {
        id: 'blood',
        name: 'Blood',
        barClass: 'bar-blood',
        legendClass: 'leg-blood',
        segments: [{ startMin: ganttMin(18, 0), endMin: ganttMin(18, 30), label: '1 unit', labelPosition: 'right' }],
      },
    ],
  },
  {
    title: 'Output',
    rows: [
      {
        id: 'urine',
        name: 'Urine Output',
        barClass: 'bar-urine',
        legendClass: 'leg-urine',
        segments: [
          { startMin: ganttMin(17, 30), endMin: ganttMin(17, 50), label: '80 ml', labelPosition: 'below' },
          { startMin: ganttMin(18, 30), endMin: ganttMin(18, 50), label: '60 ml', labelPosition: 'below' },
          { startMin: ganttMin(19, 30), endMin: ganttMin(19, 50), label: '70 ml', labelPosition: 'below' },
        ],
      },
      {
        id: 'catheter',
        name: 'Urinary Catheter',
        barClass: 'bar-catheter',
        legendClass: 'leg-catheter',
        segments: [{ startMin: ganttMin(17, 30), endMin: END, label: 'Active', labelPosition: 'on-bar' }],
      },
    ],
  },
];

export function FluidsGanttChart() {
  return (
    <ClinicalGanttChart sections={FLUIDS_SECTIONS} ariaLabel="Fluids intake and output timeline" />
  );
}
