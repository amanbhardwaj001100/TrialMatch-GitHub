export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  tone = 'teal',
}) {
  const tones = {
    teal: {
      background: '#ccfbf1',
      color: '#0f766e',
    },
    blue: {
      background: '#e0f2fe',
      color: '#0369a1',
    },
    purple: {
      background: '#f3e8ff',
      color: '#7e22ce',
    },
    orange: {
      background: '#ffedd5',
      color: '#c2410c',
    },
  }

  const current = tones[tone]

  return (
    <div className="stat-card">
      <div className="stat-top">
        <div
          className="stat-icon"
          style={{
            background: current.background,
            color: current.color,
          }}
        >
          <Icon size={20} />
        </div>

        <span className="badge badge-green">
          {change}
        </span>
      </div>

      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>

      <div className="stat-change">
        Compared with last month
      </div>
    </div>
  )
}
