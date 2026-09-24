import { Bell, ChevronDown, ShieldCheck } from 'lucide-react'

export default function Topbar({ title = 'Clinical Trial Platform' }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <div className="topbar-title">{title}</div>
          <div className="topbar-subtitle">
            AI-assisted clinical research workspace
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          className="badge badge-green"
          style={{ padding: '7px 10px' }}
        >
          <ShieldCheck size={12} />
          Demo Environment
        </div>

        <button className="icon-button">
          <Bell size={18} />
        </button>

        <button className="icon-button">
          <ChevronDown size={17} />
        </button>
      </div>
    </header>
  )
}
