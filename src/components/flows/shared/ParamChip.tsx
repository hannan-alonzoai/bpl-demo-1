const ICONS: Record<string, string> = { ecg: '♥', resp: '↔', spo2: '◉', temp: '°', validation: '↓' };

interface Props {
  param?: string;
  value?: string | number;
  unit?: string;
  kind?: string;
  validation?: boolean;
}

export function ParamChip({ param, value, unit, kind = 'validation', validation }: Props) {
  return (
    <div className={`vitals-param-item${validation ? ' validation' : ''}`}>
      <span className={`param-icon ${kind}`}>{ICONS[kind] || '•'}</span>
      <span className="pname">{param || 'Validation Parameter'}</span>
      <span className="pval">{value ?? '—'}</span>
      {unit ? <span className="punit">{unit}</span> : null}
    </div>
  );
}
