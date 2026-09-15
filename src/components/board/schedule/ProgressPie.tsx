interface Props {
  pct: number;
  label?: string;
}

export function ProgressPie({ pct, label = 'Completed' }: Props) {
  const clamped = Math.max(0, Math.min(100, pct));
  const size = 64;
  const cx = size / 2;
  const r = 24;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="compact-pie" aria-label={`${label} ${clamped}%`}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${cx} ${cx})`}>
          <circle className="pie-bg" cx={cx} cy={cx} r={r} />
          <circle className="pie-fg" cx={cx} cy={cx} r={r} strokeDasharray={c} strokeDashoffset={offset} />
        </g>
        <text x={cx} y={cx} textAnchor="middle" dominantBaseline="middle" className="pie-num">
          {clamped}%
        </text>
      </svg>
      <span className="compact-pie-label">{label}</span>
    </div>
  );
}
